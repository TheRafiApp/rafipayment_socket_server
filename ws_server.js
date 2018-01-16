const fs = require('fs')

const env = process.env.NODE_ENV
const ssl = ['production', 'staging'].includes(env)

let ssl_options

const http_package = ssl
  ? 'http'
  : 'https'

if (ssl) {
  console.log(`Using SSL for ${env}`)

  let domain = env === 'production'
    ? 'rafipayment.com'
    : 'staging.rafipayment.com'

  let root_path = '/etc/letsencrypt/live/'
  let key_path =  `${root_path}${domain}/privkey.pem`
  let cert_path = `${root_path}${domain}/cert.pem`

  ssl_options = {
    key: fs.readFileSync( key_path ),
    cert: fs.readFileSync( cert_path )
  }
}

module.exports = function(options) {

  const port = options.port

  const http = require(http_package)
    .createServer(ssl_options).listen(port)
  
  console.log(`Sockets server listening on port ${port}`)

  const server = require('engine.io')(http)

  const clients = []

  function sendMessage(data, socket) {
    socket.send(JSON.stringify(data))
  }

  function sendToClients(data, clients) {
    for (var socket in clients) {
      console.log(socket)
      sendMessage(data, clients[socket])
    }
  }

  function handleIncoming(_data, socket) {
    sendMessage({
      message: 'Data received!'
    }, socket)

    let data = JSON.parse(_data)
    console.log(data)

    sendToClients(data, clients)
  }

  function addClient(socket) {
    clients[socket.id] = socket
  }

  function removeClient(socket) {
    delete clients[socket.id]
  }

  server.on('connection', socket => {
    addClient(socket)
    
    console.log(Object.keys(clients).length)
    console.log(socket.remoteAddress)

    socket.on('message', data => {
      handleIncoming(data, socket)
    })

    socket.on('close', () => {
      console.log('closed')
      removeClient(socket)
    })
  })

}
