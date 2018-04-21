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
var tileImage;

var player = new Player(new Vec2(700, 1500)); // 400, 40
var zombie = new Zombie(new Vec2(600, 100));

var zombieList = new Array();
//zombieList.push(zombie);
//zombieList.push(new Zombie(new Vec2(600, 100)));
//zombieList.push(new Zombie(new Vec2(600, 200)));

for (var j = 0; j < 25; j++) {
  //zombieList.push(new Zombie(new Vec2(100, 1800+j*50)));
}

for (var i = 0; i < 28; i++) {
  for (var j = 0; j < 10; j++) {//25
    zombieList.push(new Zombie(new Vec2(100+i*50, 1800+j*50)));
  }
}



//zombieList.push(new Zombie(new Vec2(200, 200)));
//zombieList.push(new Zombie(new Vec2(400, 400)));

var bulletList = new Array();

var guns = new Array();
guns.push(new Rifle(new Vec2(500, 100)));



var onKeyDownCodeSet = new Set();
var keyCodeSet = new Set();

var runTime = 0;
var time2 = 0;


function playSound() {
    var source = context.createBufferSource();
    source.buffer = gunFire;
    source.connect(context.destination);
    source.start(0);
}

/*

battle royal game mode
pulse wave gun
using sniper gives extended view range
add dash mechanic
fix sniper spread
A* fix zombies merging
place zombie spawners
gui show gamestate
scoreboard
respawning
playerid/team in bullet class
bullet spread from weapon properties
team dethmatch
bullet sponge gamemode (players gradually get more powerful guns)
don't draw offscreen entities(use quadtree) / bullets

make more art
animate legs


design abilities

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

var gameManager;

var width = 20;

var grid;





window.onload = async function() {
  date = new Date();
  var currentTime = date.getTime() / 1000.0;
  previousTime = currentTime;

  gameManager = new GameManager();

  c = document.getElementById("Canvas");
  ctx = c.getContext("2d");

  ctx.canvas.width  = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  background = new Image();
  background.src = "res/grass.jpeg";

  fence = new Image();
  fence.src = "res/fence.png";






  var client = new XMLHttpRequest();
  client.open('GET', 'res/untitled.tmx');
  client.onload = function() {

    //console.log(client.responseText);

    

    //console.log(this.grid);


    tileImage = new Image();
    tileImage.onload = function() {


    level = new Level(100, tileImage, client.responseText);
    setInterval(tick, 16);

    };
    tileImage.src = "res/tilesheet_complete.png";


  }
  client.send();


  //await sleep(2000);

  c.addEventListener("mouseup", onMouseUp, false);
  c.addEventListener("mousedown", onMouseDown, false);
  c.addEventListener("mousemove", onMouseMove, false);
  c.addEventListener("wheel", onMouseWheel, false);
  
  cameraPosition = player.pos.mul(-1).add(new Vec2 (ctx.canvas.width / 2 + 16, ctx.canvas.height / 2 + 16));

  //ctx.fillRect(10, 10, 100, 100);
  //setInterval(tick, 32);
};

function levelLoaded() {
  
}

function doThing1() {
  console.log("doThing1");
}
function doThing2() {
  console.log("doThing2");
}

var doThing = doThing1;

var scaleFitNative = 1; 

var lastDownKeys = new Set();
var downKeysFrame = new Set();

function tick() {
  //doThing();
  //ctx.canvas.width  = window.innerWidth;
  //ctx.canvas.height = window.innerHeight;

  //var browserZoomLevel = Math.round(window.devicePixelRatio * 100);
  //var z = ( window.outerWidth - 10 ) / window.innerWidth;
  //console.log(ctx.canvas.width);

  var currentDownKeys = new Set(keyCodeSet);
  downKeysFrame = new Set();

  for (var key of currentDownKeys) {
    if (!lastDownKeys.has(key)) {
      downKeysFrame.add(key);
    }

  }

  if (downKeysFrame.has(87)) {
    console.log("KeyDown " + 81);
  }
  

  var nativeWidth = 800;  // the resolution the games is designed to look best in
  var nativeHeight = 800;

  deviceWidth = window.innerWidth;
  deviceHeight = window.innerHeight;


  scaleFitNative = Math.min(window.innerWidth / nativeWidth, window.innerHeight / nativeHeight);

  ctx.canvas.width  = Math.floor(deviceWidth / scaleFitNative);
  ctx.canvas.height = Math.floor(deviceHeight / scaleFitNative);

  cameraBox = new Vec2(ctx.canvas.width, ctx.canvas.height);

  ctx.canvas.style.width = '100%';
  ctx.canvas.style.height = '100%';

  date = new Date();
  var currentTime = date.getTime() / 1000.0;
  deltaTime = currentTime - previousTime;
  previousTime = currentTime;

  //console.log(deltaTime);

  runTime += deltaTime;
  //deltaTime *= 0.2;

  gameManager.update(deltaTime);
  //gameManager.log();

  cameraPosition = player.pos.mul(-1).add(new Vec2 (ctx.canvas.width / 2, ctx.canvas.height / 2));

  //console.log(cameraPosition.x);
  
  time2 += deltaTime;

  var mouseWorld = new Vec2(mouseX, mouseY);
  mouseWorld = mouseWorld.sub(cameraPosition);

  var mouseWorldGrid = new Vec2(Math.floor(mouseWorld.x / 32), Math.floor(mouseWorld.y / 32));
  mouseWorldGrid.x = Math.max(0, Math.min(level.width, mouseWorldGrid.x));
  mouseWorldGrid.y = Math.max(0, Math.min(level.width, mouseWorldGrid.y));

  var zombieGrid = new Vec2(Math.floor(zombie.posCenter.x / 32), Math.floor(zombie.posCenter.y / 32));
  zombieGrid.x = Math.max(0, Math.min(level.width, zombieGrid.x));
  zombieGrid.y = Math.max(0, Math.min(level.width, zombieGrid.y));


  //console.log(mouseWorldGrid.x + ", " + mouseWorldGrid.y);

  ctx.strokeStyle="#000000";
  ctx.beginPath();
  var vec3 = cameraPosition.add(player.pos);

  ctx.moveTo(vec3.x,vec3.y);

  ctx.lineTo(mouseX, mouseY);
  ctx.stroke();
  
  

  if (time2 > 1) {
    time2 = 0;
    //zombieList.push(new Zombie(new Vec2(100, 100)));
  }


  //level.aStarSearch(zombieGrid.x, zombieGrid.y, mouseWorldGrid.x, mouseWorldGrid.y);

  
  player.update();


  
  for (var i = 0; i < zombieList.length; i++) {
    zombieList[i].update();
  }
  
  ///*
  for (var i = 0; i < bulletList.length; i++) {
    bulletList[i].update();
  }
  //*/


  var playersAndZombies = zombieList.concat(player);

  //Build Quadtree
  var quadTree = new QuadTree(0, 0, 3200, 0);
  quadTree.addEntity(player);
  for (var j = 0; j < zombieList.length; j++) {
    quadTree.addEntity(zombieList[j]);
  }
  
  //console.log("els" + quadTree.countElements());
  ///*

  // Don't let players and zombies get inside each other
  for (var j = 0; j < playersAndZombies.length; j++) {
    var potentialCollisions = quadTree.selectBoxes(playersAndZombies[j]);
    //console.log(potentialCollisions.length);
    for (var i = 0; i < potentialCollisions.length; i++) {
      if (playersAndZombies[j] == potentialCollisions[i])
        continue;
      if (playersAndZombies[j].isIntersecting(potentialCollisions[i])) {
        playersAndZombies[j].resolveCollision(potentialCollisions[i]);
        
      }
    }
  }
  //*/
  //Bullets hitting zombies
  for (var j = 0; j < bulletList.length; j++) {
    //console.log(bulletList[j]);
    if (bulletList[j].remove == true)
      continue;

    var potentialCollisions = quadTree.selectPoints(bulletList[j].pos);
    //console.log(potentialCollisions.length);
    label1:
    for (var i = 0; i < potentialCollisions.length; i++) {
      if (potentialCollisions[i] == player)
        continue;

      var samples = 8;
      var step = 1 / samples;

      for (var k = 0, fraction = 0.0; k < samples; k++, fraction+= step ) {

        if (potentialCollisions[i].isPointIntersecting2(    bulletList[j].pos.add(bulletList[j].vel.mul(deltaTime*fraction))     )) {
          potentialCollisions[i].health -= bulletList[j].damage;
          bulletList[j].remove = true;
          break label1;
        }
        

      }

    }


    
  }

  /*
  var potentialCollisions = quadTree.selectBoxes(player);
  for (var i = 0; i < potentialCollisions.length; i++) {
    //console.log("ow" + potentialCollisions[i].pos);
    if (player == potentialCollisions[i])
      continue;
    if (player.isIntersecting(potentialCollisions[i])) {
      console.log("ow");
    }
  }
  */


  //Remove entites

  //Remove dead bullets
  for (var i = 0; i < bulletList.length; i++) {
    if (bulletList[i].remove) {
      bulletList.splice(i, 1);
      i--;
    }
  }

  //Remove dead zombies
  for (var i = 0; i < zombieList.length; i++) {
    if (zombieList[i].remove) {
      zombieList.splice(i, 1);
      i--;
    }
  }

  
  
  //rendering

  level.draw(cameraPosition, ctx.canvas.width, ctx.canvas.height);
  //level.aStarDraw(cameraPosition);

  for (var i = 0; i < guns.length; i++) {
    guns[i].draw(cameraPosition);
  }

  var cameraPosAndBox = {
    pos: cameraPosition.mul(-1),
    width: cameraBox.x,
    height: cameraBox.y,
  }

  var potentialCollisions = quadTree.selectBoxes(cameraPosAndBox);
  for (var i = 0; i < potentialCollisions.length; i++) {
    potentialCollisions[i].draw(cameraPosition);
  }

  //for (var i = 0; i < zombieList.length; i++) {
  //  zombieList[i].draw(cameraPosition);
  //}

  for (var i = 0; i < bulletList.length; i++) {
    bulletList[i].draw(cameraPosition, cameraBox);
  }

  //player.draw(cameraPosition);
  quadTree.drawQuads(cameraPosition);


  //ctx.fillStyle = "#00FF00";
  for (var n of zombieList[0].path) {
    ctx.fillRect(cameraPosition.x + n.x*level.tileSize, cameraPosition.y+n.y*level.tileSize,level.tileSize,level.tileSize);
  }

  //Draw HUD

  ctx.font = "30px Verdana";
  //ctx.font = "30px Impact";
  ctx.textAlign="center";
  ctx.fillText("Day X "+ zombieList.length + " " + bulletList.length,ctx.canvas.width / 2,50);

  ctx.textAlign="left";
  ctx.fillText("Abilities",20, ctx.canvas.height - 20);

  ctx.textAlign="right";
  ctx.fillText("Ammo: " + player.activeWeapon.ammo,ctx.canvas.width - 20, ctx.canvas.height - 20);


  lastDownKeys = currentDownKeys;
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
  mouseX = event.pageX / scaleFitNative;
  mouseY = event.pageY / scaleFitNative;
}
