
//Create Socket
var socket = io();
var canvas = $('#battleground')[0]
var PLAYER_RADIUS = 20;
var MOVEMENT_SPEED = 5;
var player;

setEventHandlers();
//=============================On Event Received ===============================

socket.on('draw player',function(player) {
  // console.log($('#battleground') + ": " + color)
  // console.log("draw player being called");
  // console.log(player.x,player.y);
  if(player.x != null && player.y != null) {
    draw(player.x,player.y);
  }
});



socket.on('init',function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var x = Math.random() * (canvas.width - PLAYER_RADIUS);
  var y = Math.random() * (canvas.height - PLAYER_RADIUS);
  player = {x:x,y:y};
  // console.log(x,y);
  socket.emit('update position', x,y);
});

socket.on('clear',function() {
  // console.log("clear being called");
  clear();
})

//==============================Sending Events ================================


//==============================Auxiliary Functions===========================

function draw(x,y) {
  var ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.arc(x,y,PLAYER_RADIUS,0,Math.PI * 2)
  ctx.fillStyle = "#00aa8f"
  ctx.fill();
}

function clear() {
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = "gray";
  ctx.fillRect(0,0,canvas.width,canvas.height);
}

function setEventHandlers() {
  console.log("setEventHandlers");
  window.addEventListener("keydown",function(key) {
    switch (key.code) {
      case "KeyA":
        //left
        player.x -= MOVEMENT_SPEED;
        break;
      case "KeyW":
        //up
        player.y -= MOVEMENT_SPEED;
        break;
      case "KeyS":
        //down
        player.y += MOVEMENT_SPEED;
        break;
      case "KeyD":
        //right
        player.x += MOVEMENT_SPEED;
        break;
    }
    socket.emit('update position',player.x,player.y);
  });

  window.addEventListener("keyup",function(key) {
    switch (key.code) {
      case "KeyA":
        //left
        break;
      case "KeyW":
        //up
        break;
      case "KeyS":
        //down
        break;
      case "KeyD":
        //right
        break;
    }
  });
}
