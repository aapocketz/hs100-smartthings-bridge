/**
 *  hs100.js
 *
 *  Copyright 2016 Dan Logan
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License. You may obtain a copy of the License at:
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed
 *  on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License
 *  for the specific language governing permissions and limitations under the License.
 *
 */

var sock = require('net');
var http = require('http');
var url = require('url');
var hs100api = require('hs100-api');

const PORT = 8083;

var server = http.createServer(onRequest);
server.listen(PORT);
console.log("The HS-100 controller has started");

function onRequest(request, response){
  //var pathname = url.parse(request.url).pathname;
  var command = request.headers["x-hs100-command"];
  var deviceIP = request.headers["x-hs100-ip"];
  var hs100 = new hs100api({host:deviceIP});
  var msg = '';
  switch(command) {
    case "on":
      console.log("on");
      msg = 'you turned ' + deviceIP + ' on';
      hs100.setPowerState(true);
      response.end(msg);
      break;
    case "off":
      console.log("off");
      msg = 'you turned ' + deviceIP + ' off';
      hs100.setPowerState(false);
      response.end(msg);
      break;
    case "status":
      console.log("status");
      console.log(deviceIP + ":" + command);
      var p = Promise.resolve(hs100.getPowerState());
      p.then(function(data){
         var state = ((data) ? "on" : "off");
         msg = "you checked " + deviceIP +  " status:" + state;
         response.setHeader("x-hs100-status", state);
         response.end(msg);
      });
      break;
    default:
      response.end('hs100');
  }
}
