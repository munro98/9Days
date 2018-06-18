class Zombie extends Actor {
  constructor (pos) {
    super(64, pos)
    this.tileIndex = 4;

    this.health = 100;

    this.targetPos = new Vec2(0, 0);
    this.path = new Array();
    this.currentIndexOnPath = 0;

    this.accel = 800;
    this.maxVel = 120;
    this.texture = new Texture("res/player.png");

    this.periodicTimer = new PeriodicTimer(0.3, true, true);
    this.periodicTimer.trigger();

    this.timeSinceLastAttack = 0;
    this.timeBetweenAttack = 0.5;

    this.lastHitVel = new Vec2(0, 0);

    this.previousRotation = 0;
    
  }

  update (){

    this.timeSinceLastAttack += deltaTime;

    if (this.health < 0 && !this.remove) {
      this.remove = true;

      let spread = 45;

      for (let i = 0; i < 5; i++) {

        let particleVec = this.lastHitVel;

        let dir = particleVec;
        let ang = -Math.atan2(dir.y, dir.x); // In radians
        ang += 90 * (Math.PI / 180);

        ang += (Math.random() * spread - (spread * 0.5) ) * (Math.PI / 180);


        dir = new Vec2(Math.sin(ang), Math.cos(ang));
        //console.log(dir.x);

        if (i < 3) {
          for (let j = 0; j < 4; j++) {
            particleManager.createParticle(this.pos, dir.mul(particleVec.mag()/4+Math.random()*500), ParticleManager.types.BLOOD, 20+Math.random()*10);
          }
        }

        particleManager.createParticle(this.pos, dir.mul(particleVec.mag()/4+Math.random()*500), ParticleManager.types.BLOOD, 20+Math.random()*10);

      }

      let rand = Math.random() * 100;
      //only 20% chance of spawning random weapon
      if (rand > 20) {
        let gunSelection = gameManager.spawnableGuns[gameManager.round];
        let randInt = Math.floor(Math.random()*gunSelection.length);
        let gun = gunSelection[randInt];
        guns.push(new gun(this.pos.copy()));

      }
    }

    if (this.timeSinceLastAttack > this.timeBetweenAttack) {
      if (player.isIntersecting(this) && player.health > 0) {
        this.timeSinceLastAttack = 0.0;
        player.health -= 9;
        player.timeSinceDamaged = 0.0;


        let spread = 45;
        let particleVec = player.pos.sub(this.pos);
        let dir = particleVec.normalized();
        

        for (let j = 0; j < 4; j++) {
          let ang = -Math.atan2(dir.y, dir.x); // In radians

          ang += 90 * (Math.PI / 180);
          ang += (Math.random() * spread - (spread * 0.5) ) * (Math.PI / 180);
          dir = new Vec2(Math.sin(ang), Math.cos(ang));

          particleManager.createParticle(player.getCenter(), dir.mul(200+Math.random()*500), ParticleManager.types.BLOOD, 20+Math.random()*10);
        }
        
      }
    }

    if (this.periodicTimer.willTrigger()) {

      this.previousRotation = this.rotation;

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
    

    if (this.path.length > 2 && this.currentIndexOnPath < this.path.length) {
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

    //if (deltaPos.mag() < 3000) {
      this.vel = this.vel.add(deltaPos);
    //}
    

    if (this.vel.mag() > this.maxVel) {
      this.vel = this.vel.normalized().mul(this.maxVel);
    }

    //

    this.rotation = Math.atan2(deltaPos.y, deltaPos.x) * 180 / Math.PI;
    //if (deltaPos.x >= 0.0) {
    //  
    //}
    this.rotation += 180;

    //this.rotation = lerp(this.previousRotation, this.rotation, this.periodicTimer.currentTime / this.periodicTimer.interval);

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