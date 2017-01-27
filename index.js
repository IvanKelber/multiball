var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Player = require('./static/assets/js/game.js').Player;
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
  // console.log("a user connected");
  //
  // console.log(socket.conn.id);
  //put new player into table

  var newPlayer = new Player(null,null);
  newPlayer.id = socket.conn.id;
  players[socket.conn.id] = newPlayer;

  socket.emit('init');
  console.log(socket.conn.id + " initialized");

  // io.emit('draw player',{x:newPlayer.getX(),y:newPlayer.getY()}); //let other client know this player exists
  //
  // for (var id in players) {
  //   var existingPlayer = players[id];
  //   socket.emit('draw player',{x:existingPlayer.getX(),y:existingPlayer.getY()});
  // }

  socket.on('update position',function(x,y) {
    console.log("update position being called");
    players[socket.conn.id].setX(x);
    players[socket.conn.id].setY(y);

    io.emit('clear');
    for (var id in players) {
      existingPlayer = players[id];
      io.emit('draw player',{x:existingPlayer.x,y:existingPlayer.y});
    }
  });

  socket.on('disconnect',function() {
    //remove user from table
    //TODO: redraw without this player!
    delete players[socket.conn.id];
    
    io.emit('clear');
    for (var id in players) {
      existingPlayer = players[id];
      io.emit('draw player',{x:existingPlayer.x,y:existingPlayer.y});
    }

  });


});

// When the server disconnects...?
io.on('disconnect',function(socket) {
  console.log("SERVER DISCONNECTED");
});
