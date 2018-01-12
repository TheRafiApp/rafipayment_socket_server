# Rafipayment Websockets Server

Websockets server to watch for deployments and alert users, built with node and [engine.io](https://github.com/socketio/engine.io)


## Running locally

```
npm start
```

## Running in production

Use application declaration, passing optional environment variables

```
pm2 start ws_server.json --env staging
```

Don't forget to save!

```
pm2 save
```

## Overview

Runs a node websockets server at `localhost:4200`.
