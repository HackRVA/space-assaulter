import { ClickScreen } from './clickscreen.js';

export const MatchScreen = Object.create(ClickScreen);

MatchScreen.init = function(renderer) {
  // Start some calls out to the server
  // This needs to do some cross-site access tricks to hackrva.org
  // Setting up a different server would also be permissible
  ClickScreen.init.call(this, renderer, options);
  // the default host
  this.server_host = "hackrva.org";
  this.room_path = "cgi-bin/rooms.py"
  console.log(window.location.host);
}

MatchScreen.queryServer = function() {
  // Don't sweat Internet Explorer support
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("load", this.receiveRooms.bind(this, xhr), false);
  xhr.open("GET", this.server_host + "/" + this.room_path, true);
  xhr.send();
}

MatchScreen.receiveRooms = function(xhr, e) {
  // parse the received rooms
  
}

