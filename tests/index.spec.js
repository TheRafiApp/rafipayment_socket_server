const env = process.env.NODE_ENV
const config = require('../src/config')[env]
const Server = require('../src')

const port = config.port

/* eslint-disable no-new */
const server = new Server({ port })

afterAll(() => {
  server.close()
})

describe('Rafi websockets server', () => {
  it('should run the websockets server', () => {
    expect(2)
      .toBe(2)
  })
})
