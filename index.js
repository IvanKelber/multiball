var fs = require('fs');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Player = require('./Player').Player;
var port = process.env.PORT || 8000
//SET UP STATIC ASSETS FOLDER
app.use(express.static(__dirname + '/static'));

//SERVE HTML AND BEGIN LISTENING
app.get('/', function(req,res) {
  res.sendFile(__dirname + "/index.html");
});
http.listen(port,function() {
  console.log("Listening on ",port);
});

var players = {};
var wordToId = {};

//When a client connects
io.on('connection',function(socket) {
  socket.emit('init',{id:socket.conn.id});

  readFile(__dirname + "/static/assets/data/english_words.txt",function(text) {
    var lines = text.split('\n');
    var word = lines[Math.floor(Math.random()*lines.length)];
    wordToId[word] = socket.conn.id;
    socket.emit('word decided',word);
  });

  console.log(socket.conn.id);
  socket.on('new player',onNewPlayer);
  socket.on('move player',onMovePlayer);
  socket.on('disconnect',onRemovePlayer);
  socket.on('new controller',onNewController);

});

function onNewPlayer(data) {
  this.broadcast.emit('new player',{x:data.x,y:data.y,id:this.conn.id});

  for(var id in players) {
    var p = players[id];
    this.emit('new player',{x:p.getX(),y:p.getY(),id:id});
  }
  players[this.conn.id] = new Player(data.x,data.y);
}

function onMovePlayer(data) {
  var p = players[data.id];
  if(p) {
    p.setX(data.x);
    p.setY(data.y);

    io.emit('move player',{x:data.x,y:data.y,id:data.id});
  }

}

function onRemovePlayer() {
  var p = players[this.conn.id];
  if(p) {
    delete players[this.conn.id];
    this.broadcast.emit('remove player',{id:this.conn.id});
  }
  for (word in wordToId) {
    if (wordToId[word] === this.conn.id) {
      delete wordToId[word];
    }
  }
}

function onNewController(data) {
  console.log("ON NEW CONTROLLER", data.client_id);
  if(data.client_id in players) {
    console.log("client id exists");
    io.to(data.client_id).emit('new controller',{id:this.conn.id});
  }
}

function readFile(file, callback) {
  fs.readFile(file,"utf-8",function(err,data) {
    if(err) {
      console.log("Error while reading file " + file +": " + err);
    };
    callback(data);
  });
}

setInterval(function() {
  console.log("===========");
  for (var id in players) {
    console.log(id,wordToId);
  }
},50000);
