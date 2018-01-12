# Rafipayment Sockets Server

Websockets server to watch for deployments and alert users


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

Uses a Webpack development server to run on `localhost:4200`.
