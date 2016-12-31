
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
  "peerIdentity": "name" + Math.floor(Math.random() * 1000)
};

new RTCPeerConnection(rtc_config);

