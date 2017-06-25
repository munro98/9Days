var cameraX = 0;
var cameraY = 0;

var mouseX = 0;
var mouseY = 0;

var mouseX1;
var mouseY1;

var mouseX2;
var mouseY2;

var mouseDown = false;

var level;

var player = new Player(new Vec2(40, 40));
var zombie = new Zombie(new Vec2(100, 100));

var zombieList = new Array();
zombieList.push(zombie);

var entityList = new Array();

var guns = new Array();
guns.push(new Rifle(new Vec2(100, 100)));



var onKeyDownCodeSet = new Set();
var lastKeyCodeSet = new Set();
var keyCodeSet = new Set();

var runTime = 0;
var time2 = 0;

/*

Make map editor in java that generates level
A* search
create game state manager class

Create tile assets

Refactor

fix onkeydown
and concurrency in swapWeapons
*/
var c;
var ctx;

var background;
var bullet;
var fence;


var deltaTime = 0.0;
var previousTime = 0.0;

var date;

var cameraPosition;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

window.onload = async function() {
  date = new Date();
  var currentTime = date.getTime() / 1000.0;
  previousTime = currentTime;

  c = document.getElementById("Canvas");
  ctx = c.getContext("2d");

  ctx.canvas.width  = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  background = new Image();
  background.src = "res/grass.jpeg";

  fence = new Image();
  fence.src = "res/fence.png";

  levelImage = new Image();
  levelImage.onload = function() {
    
    ctx.drawImage(levelImage,0,0);
    level = new Level(levelImage.width);

    setInterval(tick, 16);
  };
  levelImage.src = "res/level.png";

  //await sleep(2000);

  

  c.addEventListener("mouseup", onMouseUp, false);
  c.addEventListener("mousedown", onMouseDown, false);
  c.addEventListener("mousemove", onMouseMove, false);
  c.addEventListener("wheel", onMouseWheel, false);
  
  cameraPosition = player.pos.mul(-1).add(new Vec2 (ctx.canvas.width / 2, ctx.canvas.height / 2));

  //ctx.fillRect(10, 10, 100, 100);
  //setInterval(tick, 32);
};

function levelLoaded() {
  
}


function tick() {
  ctx.canvas.width  = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  date = new Date();
  var currentTime = date.getTime() / 1000.0;
  deltaTime = currentTime - previousTime;
  previousTime = currentTime;

  runTime += deltaTime;
  //deltaTime *= 0.5;

  cameraPosition = player.pos.mul(-1).add(new Vec2 (ctx.canvas.width / 2, ctx.canvas.height / 2));

  //console.log(deltaTime);
  
  time2 += deltaTime;

  ctx.strokeStyle="#000000";
  ctx.beginPath();
  var vec3 = cameraPosition.add(player.pos);

  ctx.moveTo(vec3.x,vec3.y);

  ctx.lineTo(mouseX, mouseY);
  ctx.stroke();
  
  

  if (time2 > 1) {
    time2 = 0;
    //zombieList.push(new Zombie(new Vec3(100, 100, 0)));
  }

  //ctx.rotate(20*Math.PI/180);

  
  player.update();

  
  for (var i = 0; i < zombieList.length; i++) {
    zombieList[i].update();
  }
  

  for (var i = 0; i < entityList.length; i++) {
    entityList[i].update();
    if (entityList[i].lifeTime > 4) {
      entityList.splice(i, 1);
    }
  }


  for (var i = 0; i < entityList.length; i++) {
    for (var j = 0; j < zombieList.length; j++) {
      if (zombieList[j].hit(entityList[i].pos)) {
        entityList.splice(i, 1);
        zombieList.splice(j, 1);
        i--;
        j--;
      }
    }
  }

  for (var i = 0; i < entityList.length; i++) {
      if (level.hit(entityList[i].pos)) {
        entityList.splice(i, 1);
        i--;
      }
  }







  //ctx.strokeStyle="#f0f0f0";
  //ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  
  //ctx.strokeStyle="#000000";
  
  //rendering

  level.draw(cameraPosition);

  for (var i = 0; i < guns.length; i++) {
    guns[i].draw(cameraPosition);
  }

  for (var i = 0; i < zombieList.length; i++) {
    zombieList[i].draw(cameraPosition);
  }

  for (var i = 0; i < entityList.length; i++) {
    entityList[i].draw(cameraPosition);
  }

  //Draw HUD

  ctx.font = "30px Verdana";
  //ctx.font = "30px Impact";
  ctx.textAlign="center";
  ctx.fillText("Day X",ctx.canvas.width / 2,50);

  ctx.textAlign="left";
  ctx.fillText("Abilities",20, ctx.canvas.height - 20);

  ctx.textAlign="right";
  ctx.fillText("Ammo: " + player.activeWeapon.ammo,ctx.canvas.width - 20, ctx.canvas.height - 20);

  //ctx.rotate(20*Math.PI/180);
  //console.log(runTime);

  player.draw(cameraPosition);
  
  //ctx.translate(500, 500);
  //ctx.rotate((runTime * 100)*Math.PI/180);
  //ctx.drawImage(img,-32,-32);


  lastKeyCodeSet = new Set();
}

document.documentElement.addEventListener("keydown", onKeyDown, false);
function onKeyDown(event)
{
  keyCodeSet.add(event.keyCode);
  onKeyDownCodeSet.add(event.keyCode);
  //console.log("KeyDown " + event.keyCode);

}

document.documentElement.addEventListener("keyup", onKeyUp, false);
function onKeyUp(event)
{
  keyCodeSet.delete(event.keyCode);
  //console.log("KeyUp");
}

// Take input
function onMouseWheel(event)
{
  console.log("Wheel");
  player.swapWeapon();
}

function onMouseDown(event)
{
  //console.log("Up");
  var x = event.x;
  var y = event.y;

  x -= c.offsetLeft;
  y -= c.offsetTop;

  mouseX1 = x;
  mouseY1 = y;
  mouseDown = true;
  if (event.which == 1) {
    
  }

}

function onMouseUp(event)
{
  //console.log("Up");
  var x = event.x;
  var y = event.y;

  x -= c.offsetLeft;
  y -= c.offsetTop;

  mouseX2 = x;
  mouseY2 = y;
  mouseDown = false;
  console.log("Up");
  if (event.which == 1) {
  
  }
}

function onMouseMove(event) {
  mouseX = event.pageX;
  mouseY = event.pageY;
}
