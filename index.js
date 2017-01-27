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
  var startX = Math.random()*45;
  var startY = Math.random()*100;
  var newPlayer =  new Player(startX,startY);
  newPlayer.id = socket.conn.id;
  players[socket.conn.id] = newPlayer;

  io.emit('new client',{x:newPlayer.getX(),y:newPlayer.getY()}); //let other client know this player exists
  for (var id in players) {
    var player = players[id];
    socket.emit('new client',{x:player.getX(),y:player.getY()});
  }
  socket.on('disconnect',function() {
    //remove user from table
    delete players[socket.conn.id];
  });


});

// When the server disconnects...?
io.on('disconnect',function(socket) {
  console.log("SERVER DISCONNECTED");
});
