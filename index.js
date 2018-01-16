const env = process.env.NODE_ENV
const config = require('./src/config')[env]
const Server = require('./src')

const port = config.port

/* eslint-disable no-new */
new Server({ port })
