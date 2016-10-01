import { Base } from 'canvas-screens';
import { Evented } from './evented.js';

// Start by making sure the basic CGI based connection
// Next, make sure host DataChannel connection establishment works
// Later, switch over to a WS based connection

export const Peer = Object.create(Evented);

Peer.init = function(id, connection) {
  Evented.init.call(this);
  this.id = id;
  this.connection = connection;
  this.connection.link("message", this.receive.bind(this));
};

Peer.receive = function(sender, message) {
  if(sender == this.id)
    this.trigger("message", [message]);
};

Peer.send = function(message) {
  return this.connection.send(this.id, message);
};

export const Connection = Object.create(Evented);

Connection.init = function() {
  Evented.init.call(this);
  this.peers = [];
};

Connection.listPeers = function() {
  // updates the list of connected peers
  // Strictly speaking, should be unnecessary
  return new Promise(function(resolve, reject) { });
};

Connection.knownPeers = function() {
  // retrieve a locally maintained list of known peers
  return this.peers;
};

Connection.destroy = function() {
  return new Promise(function(resolve, reject) { });
};

Connection.send = function(id, msg) {
  return new Promise(function(resolve, reject) { });
};

Connection.getPeer = function(id) {
  return Peer.create(id, this);
};


function left_dispatch_message(idx, msg) {
  console.log("Left side dispatched message to peer " + idx);
}
function left_fail_message(idx, e) {
  console.log("Left side failed while sending message" + idx);
  console.log(e);
}

// Verifies that a message can be sent back and forth
export function connection_test_left(connection_obj) {
  // Just connect, wait for a message from the right side
  connection_obj.link("message", function(peerid, message) {
    if(message == "from right side") {
      console.log("Left side received message from peer " + peerid);
      // Send a response
      connection_obj.getPeer(peerid).send("from left side")
      .then(left_dispatch_message.bind(null, peerid))
      .catch(left_fail_message.bind(null, peerid));
    }
  });
}

function right_dispatch_message(idx, msg) {
  console.log("Right side dispatched message to peer " + idx);
  console.log(msg);
}
function right_fail_message(idx, e) {
  console.log("Right side failed while sending message" + idx);
  console.log(e);
}

export function connection_test_right(connection_obj) {
  // Connect, search for a left side
  connection_obj.link("message", function(peerid, message) {
    if(message == "from left side") {
      console.log("Right side received response from peer " + idx);
    }
  });
  connection_obj.link("peer", function(peer_id) {
    connection_obj.getPeer(peer_id).send("from right side")
      .then(right_dispatch_message.bind(null, peer_id))
      .catch(right_fail_message.bind(null, peer_id));
  });
}

// A CGI Based connection
export const CGIConnection = Object.create(Connection);

CGIConnection.xhrReceive = function(xhr, resolve, reject) {
  if(xhr.status >= 200 && xhr.status < 300)
    resolve(JSON.parse(xhr.response));
  else
    reject(xhr.statusText);
};

CGIConnection.xhrExecutor = function(method, url, data, resolve, reject) {
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("load", this.xhrReceive.bind(this, xhr, resolve, reject), false);
  xhr.open(method, url, true);
  if(data)
    xhr.send(data);
  else
    xhr.send();
};


CGIConnection.init = function(
    listpath,
    createpath,
    sendpath,
    pollpath,
    destroypath) {
  Connection.init.call(this);
  this.listpath = listpath;
  this.createpath = createpath;
  this.sendpath = sendpath;
  this.pollpath = pollpath;
  this.destroypath = destroypath;
  this.last_packet = 0;
  // Must poll immediately
  this.last_poll = 0;
  this.poll_period = 1000;
  // can't poll yet
  this.id = null;
  this.quit = false;
  this.xhrExecutor("GET", this.createpath, null,
  (function(data) {
    // success
    this.id = data.id;
    this.trigger("connected", [this.id]);
    // start message polling
    this.poll();
  }).bind(this),
  (function(data) {
    // failure
    console.log("Connection failure");
  }).bind(this));
};

CGIConnection.pollReceive = function(packets) {
  for(var c = 0; c < packets.length; c++) {
    var message = packets[c].message;
    var senderid = packets[c].sender;
    if(message === "") {
      this.peers.push(packets[c].sender);
      this.trigger("peer", [packets[c].sender]);
    } else {
      console.log("Received " + message + " from " + senderid);
      this.trigger("message", [senderid, message]);
    }
    this.last_packet = packets[c].id;
  }
  if(!this.quit)
    this.poll();
};

CGIConnection.pollFailure = function() {
  console.log("Poll Failure");
};

CGIConnection.poll = function() {
  var now = Date.now();
  var dt = now - this.last_poll;
  console.log(dt);
  if(dt >= this.poll_period) {
    this.last_poll = now;
    this.xhrExecutor("GET", this.pollpath + "?id=" + this.id + "&from=" + this.last_packet, null,
      this.pollReceive.bind(this),
      this.pollFailure.bind(this));
  } else
    setTimeout(this.poll.bind(this), this.poll_period - dt);
};

CGIConnection.send = function(id, msg) {
  return new Promise(
    this.xhrExecutor.bind(
      this,
      "POST",
      this.sendpath,
      JSON.stringify({
        "sender": this.id,
        "recipient": id,
        "message": msg
      })));
};

CGIConnection.destroy = function() {
  this.quit = true;
  return new Promise(
    this.xhrExecutor.bind(
      this, 
      "GET", 
      this.destroypath + "?id=" + this.id, 
      null));
};

CGIConnection.listPeers = function() {
  return new Promise(this.xhrExecutor.bind(this, "GET", this.listpath, null));
};

export const DataChannelConnection = Object.create(Connection);

DataChannelConnection.init = function(hostpeer) {
  Connection.init.call(this);
  // The connection used to initiate the connection to the host
  this.hostpeer = hostpeer;
  // Used to connect to other users
  navigator.mediaDevices.getUserMedia({ "audio": true, "video": true })
  .then((function() {
    // success
  }).bind(this))
  .catch((function() {
    // error
  }).bind(this));
  this.hostConnection = new RTCPeerConnection();
  this.connections = [this.hostConnection];
  Connection.init.call(this);
};

DataChannelConnection.getPeerConnection = function(id) {
  return this.connections[id];
};

DataChannelConnection.hostNegotiation = function() {
  // generate an offer
  this.oldConnection.send(this.oldHostId);
};

export const DataChannelConnectionHost = Object.create(DataChannelConnection);

