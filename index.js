var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//SET UP STATIC ASSETS FOLDER
app.use(express.static(__dirname + '/static'));

//SERVE HTML AND BEGIN LISTENING
app.get('/', function(req,res) {
  res.sendFile(__dirname + "/index.html");
});
http.listen(8000,function() {
  console.log("Listening on 8000");
});

var users = {};

//When a client connects
io.on('connection',function(socket) {
  // console.log("a user connected");
  //
  // console.log(socket.conn.id);
  //put user into table
  users[socket.conn.id] = [0,0];
  io.emit('update color',"red");
  socket.on('disconnect',function() {
    //remove user from table
    delete users[socket.conn.id];
  });


});

// When the server disconnects...?
io.on('disconnect',function(socket) {
  console.log("SERVER DISCONNECTED");
});
