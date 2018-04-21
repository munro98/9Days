class Zombie extends Actor {
  constructor (pos) {
    super(64, pos)

    this.health = 100;

    this.targetPos = new Vec2(0, 0);
    this.path = new Array();
    this.currentIndexOnPath = 0;

    this.accel = 800;
    this.maxVel = 100;
    this.texture = new Texture("res/player.png");

    this.periodicTimer = new PeriodicTimer(0.6, true, true);

    
  }

  update (){

    if (this.periodicTimer.trigger()) {

      var mouseWorldGrid = new Vec2(Math.floor(player.posCenter.x / 32), Math.floor(player.posCenter.y / 32));
      mouseWorldGrid.x = Math.max(0, Math.min(level.width, mouseWorldGrid.x));
      mouseWorldGrid.y = Math.max(0, Math.min(level.width, mouseWorldGrid.y));

      var zombieGrid = new Vec2(Math.floor(this.posCenter.x / 32), Math.floor(this.posCenter.y / 32));
      zombieGrid.x = Math.max(0, Math.min(level.width, zombieGrid.x));
      zombieGrid.y = Math.max(0, Math.min(level.width, zombieGrid.y));
      
      this.path = level.aStarSearch(zombieGrid.x, zombieGrid.y, mouseWorldGrid.x, mouseWorldGrid.y, cameraPosition);
      this.currentIndexOnPath = 0;

      //console.log("tick");
    }


    //console.log("p: " + this.currentIndexOnPath);
    

    if (this.path.length > 0 && this.currentIndexOnPath < this.path.length) {
      this.targetPos = new Vec2(this.path[this.currentIndexOnPath].x * level.tileSize + 16, this.path[this.currentIndexOnPath].y * level.tileSize +16);
    }
    //this.targetPos = new Vec2(30+16, 30+16);
    //console.log(this.targetPos);

    //var deltaPos = player.posCenter.sub(this.posCenter);
    var deltaPos = this.targetPos.sub(this.posCenter);

    if (deltaPos.mag() < level.tileSize) {
      this.currentIndexOnPath = Math.min(this.currentIndexOnPath+1, this.path.length-1);
    }


    deltaPos = deltaPos.normalized().mul(deltaTime * this.accel);
    this.newVel = this.newVel.add(deltaPos);

    if (this.newVel.mag() > this.maxVel) {
      this.newVel = this.newVel.normalized().mul(this.maxVel);
    }

    if (deltaPos.mag() == 0) {
      this.newVel = this.newVel.mul(25 * deltaTime);
    }

    this.rotation = Math.atan(deltaPos.y / deltaPos.x) * 180 / Math.PI;
    if (deltaPos.x >= 0.0) {
      this.rotation += 180;
    }

    this.rotation += 90;

    super.update();
  }

  hit (v){
    //if(this.pos.x+this.width / 2 < v.x || this.pos.x-this.width  / 2 > v.x ) return false;
    //if(this.pos.y+this.height / 2 < v.y || this.pos.y-this.height  / 2 > v.y ) return false;

    if(this.pos.x+this.width / 2 < v.x || this.pos.x-this.width  / 2 > v.x ) return false;
    if(this.pos.y+this.height / 2 < v.y || this.pos.y-this.height  / 2 > v.y ) return false;

    return true;
  }
}