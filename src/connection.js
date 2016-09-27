import { Evented } from './evented.js';

// Analogous to a listening socket
export const Accept = Object.create(Evented);

export const ServerAccept = Object.create(Accept);

ServerAccept.init = function(
    register,
    deregister,
    send,
    poll) {
  Accept.init.call(this);
  if(arguments.length < 5) {
    var basepath = (register === undefined)? "cgi-bin" : register;
    register = [basepath, "createid.py"].join("/");
    deregister = [basepath, "destroyid.py"].join("/");
    send = [basepath, "sendmessage.py"].join("/");
    poll = [basepath, "getmessages.py"].join("/");
  }
  this.register = register;
  this.deregister = deregister;
  this.send = send;
  this.poll = poll;
  this.peer = peerid;
  // Need to create the id first
  this.id = null;
}

ServerAccept.made = function() {
  this.trigger("idreceived", []);
}

ServerAccept.make = function() {
  var xhr = new XMLHttpRequest();
  xhr.addEventListener
  xhr.open("GET", this.register, true);
  xhr.send();
}

// Analogous to a data transfer socket
export const Connection = Object.create(Evented);


export const ServerConnection = Object.create(Connection);

ServerConnection.init = function() {
  Connection.init.call(this);
  if(arguments.length < 5) {
    var basepath = (register === undefined)? "cgi-bin" : register;
    register = [basepath, "createid.py"].join("/");
    deregister = [basepath, "destroyid.py"].join("/");
    send = [basepath, "sendmessage.py"].join("/");
    poll = [basepath, "getmessages.py"].join("/");
  }
  this.register = register;
  this.deregister = deregister;
  this.send = send;
  this.poll = poll;
  this.peer = peerid;
  this.id = 
}

ServerConnection.write = function() {
}

export const PeerConnection = Object.create(Connection);

PeerConnection.init = function() {
}

navigator.mediaDevices
  .getUserMedia({ 
    "audio": true ,
    "video": false
  }).then(function(mediaStream) {
    // success
  }).catch(function(err) {
    // failure
  });

var ice_servers = [{
  "urls": []
}];

var rtc_config = {
  "iceServers": [{
    "urls": [""]
  }],
  "peerIdentity": "name" + Math.floor(Math.random() * 1000);
};

new RTCPeerConnection(rtc_config);

