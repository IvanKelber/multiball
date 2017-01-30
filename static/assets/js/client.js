//Create Socket
var socket = io();
var canvas;
var ctx;
var PLAYER_RADIUS = 20;
var MOVEMENT_SPEED = 4;
var player;
var keys;
var remotePlayers = {};

function init() {
  canvas = $('#battleground')[0]
  ctx = canvas.getContext('2d');
  keys = new Keys();
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  player = new Player(Math.random()*canvas.width,Math.random()*canvas.height);

  setEventHandlers();

}

function setEventHandlers() {
  window.addEventListener("keydown",onKeyDown);
  window.addEventListener("keyup",onKeyUp);

  window.addEventListener("resize",onResize);


  //Socket event handlers
  socket.on('init',onInit);
  socket.on('connected',onSocketConnected);
  socket.on('disconnect',onSocketDisconnect);
  socket.on('new player',onNewPlayer);
  socket.on('move player',onMovePlayer);
  socket.on('remove player',onRemovePlayer);
  socket.on('new controller',onNewController);

}

function onKeyDown(key) {
  if(player) {
    keys.onKeyDown(key);
  };
}

function onKeyUp(key) {
  if(player) {
    keys.onKeyUp(key);
  }
}

function onResize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function onInit(id) {
  player.id = id;
  $('#connection').text($('#connection').text() + ": " + player.id);
  socket.emit('new player',{x:player.getX(),y:player.getY()});
}

function onSocketConnected() {
  console.log("Socket Connected");
  socket.emit('new player',{x:player.getX(),y:player.getY()});
}

function onSocketDisconnect() {
  console.log("Socket disconnected");
}

function onNewPlayer(data) {
  //add new player to remote players list
  remotePlayers[data.id] = new Player(data.x,data.y);
  remotePlayers[data.id].id = data.id;
}

function onMovePlayer(data) {
  //move player with the appropriate id according to their new location
  if(remotePlayers[data.id]) {

    remotePlayers[data.id] = new Player(data.x,data.y);
    remotePlayers[data.id].id = data.id;
  }
}

function onRemovePlayer(data) {
  var removedPlayer = remotePlayers[data.id];
  if(removedPlayer) {
    delete remotePlayers[data.id];
  }
}

function onNewController(data) {
  console.log("New controller: " + data.id);
}

function animate() {
  update();
  draw();

  window.requestAnimFrame(animate);
}

function update() {
  // console.log(remotePlayers);
  if(player.update(keys)) {
    socket.emit('move player',{x:player.getX(),y:player.getY(),id:player.id})
  };
}

function draw() {
  clear();
  // console.log("PLAYER:");
  player.draw(ctx,"#aa0000");
  ctx.font = "30px Arial"
  ctx.fillText(player.id,10,25);
  // console.log("REMOTE PLAYERS");
  for (var i in remotePlayers) {
    remotePlayers[i].draw(ctx,"#00aaaa");
  }
}

function clear() {
  ctx.fillStyle = "gray";
  ctx.fillRect(0,0,canvas.width,canvas.height);
}
