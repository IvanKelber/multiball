//Create Socket
var socket = io();
var canvas;
var ctx;
var MOVEMENT_SPEED = 15;
var player;
var keys;
var remotePlayers = {};
var connect_word = "";
var controller_id;

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
  socket.on('controller disconnect',onControllerDisconnect);
  socket.on('controller down',onKeyDown);
  socket.on('controller up',onKeyUp);
  socket.on('word decided',onWordDecided);

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

function onInit(data) {
  player.id = data.id;
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
    console.log("moving player: " + data.id);
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
  controller_id = data.id;
}

function onControllerDisconnect() {
  controller_id = null;
}

function onControllerLeft() {
  console.log("onControllerLeft: ", player.getX());
  player.setX(player.getX() - MOVEMENT_SPEED);
  console.log("onControllerLeft: ", player.getX());
  socket.emit('move player',{x:player.getX(),y:player.getY(),id:player.id})
}

function onWordDecided(word) {
  // console.log(word);
  connect_word = word;
}


function animate() {
  update();
  draw();

  window.requestAnimFrame(animate);
}

function update() {
  // console.log("updating:remotePlayers);
  if(player.update(keys)) {
    socket.emit('move player',{x:player.getX(),y:player.getY(),id:player.id})
  };
}

function draw() {
  clear();
  // console.log("PLAYER:");
  player.draw(ctx,COLORS.player);
  if(connect_word && !controller_id) {
    ctx.font = "30px Arial"
    ctx.fillText(connect_word,10,SIZE.player_radius);
  } else {
    ctx.fillStyle = COLORS.connected;
    ctx.fillText("Connected!",10,SIZE.player_radius);
  }
  for (var i in remotePlayers) {
    remotePlayers[i].draw(ctx,COLORS.other);
  }
}

function clear() {
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0,0,canvas.width,canvas.height);
}
