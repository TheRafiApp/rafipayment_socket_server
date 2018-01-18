# Rafipayment Websockets Server

[![Coverage Status](https://coveralls.io/repos/github/TheRafiApp/rafipayment_socket_server/badge.svg?branch=master)](https://coveralls.io/github/TheRafiApp/rafipayment_socket_server?branch=master)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)


Websockets server to watch for deployments and alert users, built with node and [engine.io](https://github.com/socketio/engine.io)


## Development

It is possible to run using `export NODE_ENV=dev && npm start`, but better to run in Docker

```
docker-compose -f docker-compose.dev.yml up --build
```

## Deployment

Uses `post-receive` git hook to rebuild the container using `docker-compose`

## Tests

Jest unit tests

```
npm test
```
