
var Player = function(startX,startY) {
  var x = startX; //private
  var y = startY; //private
  var speed = 5; //private
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

  return {
    getX: getX,
    getY: getY,
    setX: setX,
    setY: setY,
    id : id
  };
}

exports.Player = Player;
