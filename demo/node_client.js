const crypto = require('crypto')
const client = require('engine.io-client')
const secret = require('../deployment_secret.json').key

const url = 'wss://ws.staging.rafipayment.com'
const version = '0.0.0'

const key = crypto.createHmac('sha256', secret).digest('hex')
const socket = client(url)

socket.on('open', () => {
  console.log(`Connected to socket server at: ${url}`)

  socket.on('message', data => {
    console.log(data)
  })

  socket.on('close', () => {
    console.log('Closed connection')
  })
})

socket.send(JSON.stringify({
  key,
  deployment: {
    refresh: true,
    timestamp: new Date(),
    version
  }
}))

socket.close()
