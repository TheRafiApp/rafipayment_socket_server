'use strict';

let ssl = false;
if (['production', 'staging'].indexOf(process.env.NODE_ENV) !== -1) ssl = true;

console.log(process.env)

const fs = require('fs');
const engine = require('engine.io');
const port = 4200;

let http_package;
let options; 

if (ssl) {

  console.log(process.env.NODE_ENV)

  console.log('trying ssl')
  http_package = 'https';

  let domain = process.env.NODE_ENV === 'production' ?
    'app.payment.rafiproperties.com' :
    'app.staging.payment.rafiproperties.com'

  let root_path = '/etc/letsencrypt/live/';
  let key_path =  `${root_path}${domain}/privkey.pem`;
  let cert_path = `${root_path}${domain}/cert.pem`;

  options = {
    key: fs.readFileSync( key_path ),
    cert: fs.readFileSync( cert_path )
  }
} else {
  http_package = 'http';
}

const http = require(http_package)
  .createServer(options).listen(port);

console.log(`Sockets server listening on port ${port}`)
const server = engine.attach(http);

let clients = [];

function sendMessage(data, socket) {
  socket.send(JSON.stringify(data))
}

function sendToClients(data, clients) {
  for (var socket in clients) {
    console.log(socket);
    sendMessage(data, clients[socket]);
  }
}

function handleIncoming(_data, socket) {
  sendMessage({
    message: 'Data received'
  }, socket);

  let data = JSON.parse(_data);
  console.log(data);

  if (data.event === 'deployment')
    if (data.refresh === true)
      sendToClients(data, clients)
}

function addClient(socket) {
  clients[socket.id] = socket;
}

function removeClient(socket) {
  delete clients[socket.id];
}

server.on('connection', function(socket) {
  addClient(socket);
  console.log(Object.keys(clients).length)

  console.log(socket.remoteAddress)

  socket.on('message', function(data){
    handleIncoming(data, socket);
  });

  socket.on('close', function(){
    console.log('closed')
    removeClient(socket);
  });
});
