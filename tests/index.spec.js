const env = process.env.NODE_ENV

const engine_client = require('engine.io-client')
const config = require('../src/config')[env]
const sleep = require('../src/utils').sleep
const Server = require('../src')

const port = config.port
const delay = 100

const server = new Server({ port })
const client = engine_client(`ws://localhost:${port}`)

const mockServerOpenCallback = jest.fn()
const mockServerMessageCallback = jest.fn()
const mockServerCloseCallback = jest.fn()

server.on('connection', mockServerOpenCallback)
server.on('connection', socket => {
  socket.on('message', mockServerMessageCallback)
  socket.on('close', mockServerCloseCallback)
})

const mockClientOpenCallback = jest.fn()
const mockClientMessageCallback = jest.fn()
const mockClientCloseCallback = jest.fn()

client.on('open', mockClientOpenCallback)
client.on('open', () => {
  client.on('message', mockClientMessageCallback)
  client.on('close', mockClientCloseCallback)
})

afterAll(() => {
  server.close()
})

// jest.setTimeout(10000)

describe('Rafi websockets server', async () => {
  it('should fire the server open callback', async () => {
    expect.assertions(1)
    await sleep(delay)
    expect(mockServerOpenCallback)
      .toBeCalled()
  })
  it('should fire the client open callback', async () => {
    expect.assertions(1)
    await sleep(delay)
    expect(mockClientOpenCallback)
      .toBeCalled()
  })

  it('server should receive a message from client', async () => {
    expect.assertions(1)
    const data = JSON.stringify({
      test: 'test'
    })
    client.send(data)
    await sleep(delay)
    expect(mockServerMessageCallback)
      .toBeCalledWith(data)
  })

  it('client should receive a message from server', async () => {
    expect.assertions(1)
    const data = JSON.stringify({
      test: 'test'
    })
    await server.sendToClients(data)
    await sleep(delay)
    expect(mockClientMessageCallback)
      .toBeCalledWith(data)
  })
})
