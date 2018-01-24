const http = require('http')
const crypto = require('crypto')
const chalk = require('chalk')
const Engine = require('engine.io')

const utils = require('./utils')

const key = process.env.NODE_ENV !== 'test'
  ? crypto
    .createHmac('sha256', require('../deployment_secret.json').key)
    .digest('hex')
  : null

const log = console.log

const format_obj = utils.format_object

module.exports = class Server {
  constructor(options) {
    this.clients = []
    this.init(options)
  }

  get clients_count() {
    return Object.keys(this.clients).length
  }

  on(event, callback) {
    this.server.on(event, callback)
  }

  init(options) {
    log(
      chalk`{blueBright Starting websockets server on port ${options.port}}`
    )

    this.port = options.port
    this.http = http
      .createServer(this.handleRequest)
      .listen(this.port)
    this.server = new Engine(this.http)

    this.initEventListeners()

    log(
      chalk`{greenBright Websockets server listening on port ${this.port}}`
    )
  }

  initEventListeners() {
    this.on('connection', socket => {
      this.addClient(socket)

      socket.on('message', data => {
        this.handleIncoming(data, socket)
      })

      socket.on('close', () => {
        this.removeClient(socket)
      })
    })
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

  handleRequest(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Request-Method', '*')
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET')
    res.setHeader('Access-Control-Allow-Headers', '*')
    if (req.method === 'OPTIONS') {
      res.writeHead(200)
      res.end()
    }
  }

  handleIncoming(_data, socket) {
    const data = JSON.parse(_data)

    log(
      format_obj(data)
    )

    if (data.key === key) {
      this.sendMessage({
        message: 'Data received!'
      }, socket)

      this.sendToClients(data)
    } else {
      log(
        chalk`{magenta Received data without correct key}`
      )
    }
  }

  sendToClients(data) {
    for (let socket in this.clients) {
      this.sendMessage(data, this.clients[socket])
    }
    log(
      chalk`{blueBright Sent message to {magentaBright ${this.clients_count}} clients}`
    )
  }

  sendMessage(data, socket) {
    socket.send(JSON.stringify(data))
  }

  close() {
    this.server.close()
    this.http.close()
  }
}
