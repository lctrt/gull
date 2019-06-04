const fs = require('fs');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const dgram = require('dgram');

global.samplePath = __dirname + '/samples';

function Socket () {
  const loadSamples = () => {
    fs.readdir(global.samplePath, (err, items) => {
      if (err) throw err;
      if (items.includes('default.gull')) {
        openFile(`${global.samplePath}/default.gull`)
      }
      io.send({ type: 'filechange', files: items, path: global.samplePath});
    });
  };

  const requestSave = (filename) => {
    io.send({ type: 'saveFile', filename});
  }

  const openFile = (filename) => {
    fs.readFile(filename, {encoding: 'utf-8'}, (err,data) => {
      if (err) throw err;
      io.send({ type: 'openFile', filename, data})
    })
  };

  // socket io setup
  app.get('/', function(req, res){
    res.send('');
  });

  io.on('connection', function(socket){
    console.log('a user connected');
    loadSamples();

    socket.on('saveData', function({filename, data}) {
      fs.writeFile(filename, data, (err) => {
        if (err) {
          console.error('issue while saving', err)
        }
      })
    })

  });


  http.listen(3000, function(){
  console.log('listening on *:3000');
  });

  // TODO: reimplement sample reload with new dynamic path
  // watch for sample changes and send to client for reload
  // fs.watch(path, {persistent: true}, loadSamples);

  return {
    io,
    loadSamples,
    requestSave,
    openFile
  };
}


// UDP listener
function Listener (socket) {
  this.server = dgram.createSocket('udp4')

  this.server.on('message', (msg, rinfo) => {
    const message = msg.toString('utf-8');
    if (message.startsWith('ED')) {
      socket.io.send({ type: 'edit', msg: message.substring(2)})
    } else {
      socket.io.send({ type: 'trig', msg: message });
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

global.socket = Socket();
Listener(global.socket);

