const env = process.env.NODE_ENV

const chalk = require('chalk')
const config = require('./config')[env]
const utils = require('./utils')
const ssl_options = utils.ssl_options()
const format_obj = utils.format_object

const log = console.log

module.exports = class Server {
  constructor(options) {
    this.clients = []
    this.init(options)
  }

  init(options) {
    log(chalk`{blueBright Starting websockets server on port ${options.port}}`)

    this.port = options.port
    this.http = require(config.http_package)
      .createServer(ssl_options).listen(this.port)
    this.server = require('engine.io')(this.http)

    this.initEventListeners()

    log(chalk`{greenBright Websockets server listening on port ${this.port}}`)
  }

  initEventListeners() {
    this.server.on('connection', socket => {
      this.addClient(socket)

      socket.on('message', data => {
        this.handleIncoming(data, socket)
      })

      socket.on('close', () => {
        this.removeClient(socket)
      })
    })
  }

  get clients_count() {
    return Object.keys(this.clients).length
  }

  on(event, callback) {
    this.server.on(event, callback)
  }

  addClient(socket) {
    this.clients[socket.id] = socket
    this.statusUpdate(socket)
  }

  removeClient(socket) {
    delete this.clients[socket.id]
    this.statusUpdate(socket, true)
  }

  statusUpdate(socket, removed = false) {
    const action = removed
      ? 'Closed'
      : 'Connected to'
    const label = this.clients_count === 1
      ? 'client'
      : 'clients'
    const count = this.clients_count
    const addr = socket.remoteAddress
    log(
      chalk`{blueBright ${action} ${addr}, {magentaBright ${count}} ${label} connected}`
    )
  }

  handleIncoming(_data, socket) {
    this.sendMessage({
      message: 'Data received!'
    }, socket)

    let data = JSON.parse(_data)
    log(format_obj(data))

    this.sendToClients(data)
  }

  sendToClients(data) {
    for (let socket in this.clients) {
      this.sendMessage(data, this.clients[socket])
    }
  }

  sendMessage(data, socket) {
    socket.send(JSON.stringify(data))
  }

  close() {
    this.server.close()
    this.http.close()
  }
}
