//Create Socket
var socket = io();
var canvas;
var ctx;
var PLAYER_RADIUS = 20;
var MOVEMENT_SPEED = 10;
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
  socket.on('connected',onSocketConnected);
  socket.on('disconnect',onSocketDisconnect);
  socket.on('new player',onNewPlayer);
  socket.on('move player',onMovePlayer);
  socket.on('remove player',onRemovePlayer);

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

function onSocketConnected() {
  console.log("Socket Connected");
  socket.emit('new player',{x:player.x,y:player.y});
}

function onSocketDisconnect() {
  console.log("Socket disconnected");
}

function onNewPlayer(data) {
  //add new player to remote players list
  remotePlayers[data.id] = new Player(data.x,data.y);
}

function onMovePlayer(data) {
  //move player with the appropriate id according to their new location
  var movingPlayer = remotePlayers[data.id];
  if(movingPlayer) {
    movingPlayer.x = data.x;
    movingPlayer.y = data.y;
  }
}

function onRemovePlayer(data) {
  var removedPlayer = remotePlayers[data.id];
  if(removedPlayer) {
    delete remotePlayers[data.id];
  }
}

function animate() {
  update();
  draw();

  window.requestAnimFrame(animate);
}

function update() {
  console.log(player);
  player.update(keys);
}

function draw() {
  clear();
  player.draw(ctx);
  for (var i in remotePlayers) {
    remotePlayers[i].draw(ctx);
  }
}

function clear() {
  ctx.fillStyle = "gray";
  ctx.fillRect(0,0,canvas.width,canvas.height);
}
