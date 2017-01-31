
var Player = function(startX,startY) {
  var x = startX; //private
  var y = startY; //private
  var id;

  function getX() {
    return x;
  };

  function setX(x) {
    this.x = x;
  };

  function getY() {
    return y;
  };

  function setY(y) {
    this.y=y;
  };

  var update = function(keys) {

    var prevX = x;
    var prevY = y;

    if(keys.up) {
      y -= MOVEMENT_SPEED;
    } else if (keys.down) {
      y += MOVEMENT_SPEED;
    }

    if(keys.left) {
      x -= MOVEMENT_SPEED;
    } else if (keys.right) {
      x += MOVEMENT_SPEED;
    }
    return prevX != x || prevY != y;
  };

  var draw = function(ctx,color) {
    // console.log(x,y,id);
    ctx.beginPath();
    ctx.arc(x,y,SIZE.player_radius,0,Math.PI * 2)
    ctx.fillStyle = color;
    ctx.fill();
  }

  return {
    getX: getX,
    getY: getY,
    setX: setX,
    setY: setY,
    update: update,
    draw: draw,
    id : id
  };
}
