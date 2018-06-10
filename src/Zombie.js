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

    this.timeSinceLastAttack = 0;
    this.timeBetweenAttack = 0.5;
    
  }

  update (){

    if (this.health < 0 && !this.remove) {

      guns.push(new Rifle(this.pos.copy()));

      let rand = Math.random() * 100;
      if (rand > 20) {
        let rand = Math.random() * 100;
        let randInt = Math.floor(Math.random()*4);

      }
    }

    if (this.timeSinceLastAttack > this.timeBetweenAttack) {
      //vec forward =
      //let attack box = 
      // get all players in attach box
      // attack the first one
    }

    if (this.periodicTimer.trigger()) {

      var mouseWorldGrid = new Vec2(Math.floor(player.getCenter().x / 32), Math.floor(player.getCenter().y / 32));
      mouseWorldGrid.x = Math.max(0, Math.min(level.width, mouseWorldGrid.x));
      mouseWorldGrid.y = Math.max(0, Math.min(level.width, mouseWorldGrid.y));

      var zombieGrid = new Vec2(Math.floor(this.getCenter().x / 32), Math.floor(this.getCenter().y / 32));
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
    var deltaPos = this.targetPos.sub(this.getCenter());

    if (deltaPos.mag() < level.tileSize) {
      this.currentIndexOnPath = Math.min(this.currentIndexOnPath+1, this.path.length-1);
    }


    deltaPos = deltaPos.normalized().mul(deltaTime * this.accel);
    this.vel = this.vel.add(deltaPos);

    if (this.vel.mag() > this.maxVel) {
      this.vel = this.vel.normalized().mul(this.maxVel);
    }

    if (deltaPos.mag() == 0) {
      this.vel = this.vel.mul(25 * deltaTime);
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