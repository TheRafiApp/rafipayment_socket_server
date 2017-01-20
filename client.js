window.onload = function() {
  var socket = require('engine.io-client')('ws://localhost:4200');

  socket.on('open', function(){
    console.log('opened ws')

    socket.on('message', function(data){
      console.log(data)
    });
    socket.on('close', function(){
      console.log('close')
    });
  });

  var $btn = document.getElementById('emit-event');

  $btn.addEventListener('click', function() {
    console.log('click')
    socket.send('button was clicked')
  })
}
