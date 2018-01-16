const env = process.env.NODE_ENV

const engine_client = require('engine.io-client')
const config = require('../src/config')[env]
const sleep = require('../src/utils').sleep
const Server = require('../src')

const port = config.port

const server = new Server({ port })
const client = engine_client(`ws://localhost:${port}`)

// const mockServerOpenCallback = jest.fn()
const mockServerMessageCallback = jest.fn()
const mockServerCloseCallback = jest.fn()

server.on('connection', socket => {
  // console.log('server connected!')
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

jest.setTimeout(10000)

describe('Rafi websockets server', async () => {
  it('should open the websockets connection', async () => {
    expect.assertions(1)
    await sleep(1000) // make sure the server started
    await client.open()
    expect(mockClientOpenCallback)
      .toBeCalled()
  })

  // it('server should receive a message', async () => {
  //   expect.assertions(1)
  //   client.send(JSON.stringify({
  //     test: 'test'
  //   }))
  //   await sleep(500)
  //   expect(mockServerMessageCallback)
  //     .toBeCalledWith('test')
  // })

  // it('client should receive a message', async () => {
  //   expect.assertions(1)
  //   await server.sendToClients(JSON.stringify({
  //     test: 'test'
  //   }))
  //   await sleep(500)
  //   expect(mockClientMessageCallback)
  //     .toBeCalledWith('test')
  // })
})
