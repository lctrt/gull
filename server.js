const fs = require('fs');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const dgram = require('dgram');

function Socket () {
  const path = __dirname + '/samples'
  const loadSamples = () => {
    fs.readdir(path, (err, items) => {
      console.log(items);
      io.send({ type: 'filechange', files: items});
      for (var i=0; i<items.length; i++) {
          console.log(items[i]);
      }
    });
  };

  // socket io setup
  app.get('/', function(req, res){
    res.send('');
  });

  io.on('connection', function(socket){
    console.log('a user connected');
    loadSamples();
  });

  http.listen(3000, function(){
  console.log('listening on *:3000');
  });

  // watch for sample changes and send to client for reload
  fs.watch(path, {persistent: true}, loadSamples);

  return io;
}


// UDP listener
function Listener (socket) {
  this.server = dgram.createSocket('udp4')

  this.server.on('message', (msg, rinfo) => {
    const message = msg.toString('utf-8');
    if (message.startsWith('ED')) {
      socket.send({ type: 'edit', msg: message.substring(2)})
    } else {
      socket.send({ type: 'trig', msg: message });
    }
  })

  this.server.on('listening', () => {
    const address = this.server.address()
    console.log(`Server listening for UDP:\n ${address.address}:${address.port}`)
  })

  this.server.on('error', (err) => {
    console.log(`Server error:\n ${err.stack}`)
    server.close()
  })

  this.server.bind(49161) // TODO - make this configurable
}

Listener(Socket());

