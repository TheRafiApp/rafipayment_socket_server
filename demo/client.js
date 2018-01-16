const url = 'ws://localhost:4200'

window.onload = () => {
  const $console = document.querySelector('.console pre')
  const socket = require('engine.io-client')(url)
  const format_obj = require('../src/utils').format_object

  socket.on('open', () => {
    $console.innerText = `Connected to websockets server at ${url}`

    socket.on('message', (data) => {
      $console.innerHTML = format_obj(JSON.parse(data))
    })
    socket.on('close', () => {
      $console.innerText = 'Closed websocket connection'
    })
  })

  const $actions = document.querySelector('.actions')
  const $btn_emit = document.querySelector('.emit-event')
  const $btn_deploy = document.querySelector('.emit-deployment')
  const $btn_close = document.querySelector('.close-connection')
  const $btn_open = document.querySelector('.open-connection')

  $btn_emit.addEventListener('click', () => {
    socket.send(JSON.stringify({
      test: 'button was clicked'
    }))
  })

  $btn_deploy.addEventListener('click', () => {
    socket.send(JSON.stringify({
      deployment: {
        refresh: true,
        timestamp: new Date(),
        version: '2.0.1'
      }
    }))
  })

  $btn_close.addEventListener('click', () => {
    $actions.classList.add('closed')
    socket.close()
  })

  $btn_open.addEventListener('click', () => {
    $actions.classList.remove('closed')
    socket.open()
  })
}
