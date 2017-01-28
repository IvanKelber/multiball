var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Player = require('./Player').Player;
//SET UP STATIC ASSETS FOLDER
app.use(express.static(__dirname + '/static'));

//SERVE HTML AND BEGIN LISTENING
app.get('/', function(req,res) {
  res.sendFile(__dirname + "/index.html");
});
http.listen(8000,function() {
  console.log("Listening on 8000");
});

var players = {};

//When a client connects
io.on('connection',function(socket) {
  socket.emit('init');

  socket.on('new player',onNewPlayer);
  socket.on('move player',onMovePlayer);
  socket.on('remove player',onRemovePlayer);
  socket.on('disconnect',onDisconnect);

});

function onNewPlayer(data) {
  this.broadcast.emit('new player',{x:data.x,y:data.y,id:this.conn.id});
  for(var id in players) {
    var p = players[id];
    this.emit('new player',{x:p.x,y:p.y,id:id});
  }
  players[this.conn.id] = new Player(data.x,data.y)
}

function onMovePlayer(data) {
  var p = players[data.id];
  if(p) {
    p.x = data.x;
    p.y = data.y;

    io.emit('move player',data);
  }

}

function onRemovePlayer(data) {
  var p = players[data.id];
  if(p) {
    delete players[data.id];
    io.emit('remove player',data);
  }

}

function onDisconnect() {
  //remove user from table
  delete players[this.conn.id];
}

setInterval(function() {
  for (var id in players) {
    console.log(id);
  }
},5000);
