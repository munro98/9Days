class Player extends Actor {
    constructor (pos) {
    super(64, pos)
    
    this.accel = 1600;
    this.decel = 800;
    this.maxVel = 240;
    this.rotation = 0;

    this.timeSinceLastFire = 0;

    this.texture = new Texture("res/player.png");

    //this.altWeapon = new PulseWave(new Vec2(0,0));
    //this.activeWeapon = new Sniper(new Vec2(0,0));

    this.altWeapon = new Pistol(new Vec2(0, 0));
    //this.activeWeapon = new Sniper(new Vec2(0, 0));
    this.activeWeapon = new Pistol(new Vec2(0, 0));
    this.activeWeapon = new Uzi(new Vec2(0, 0));

    this.swayAngle = 0;
    this.timeSinceDamaged = 0;
  }

  update (){

    this.timeSinceDamaged += deltaTime;

    if (player.timeSinceDamaged > 5 & this.health < 100) {
      this.health += 4 * deltaTime;
    }

    var vec3 = cameraPosition.add(this.getCenter()); // position of player screen space
		var relvec3 = new Vec2(mouseX, mouseY).sub(vec3);

		this.rotation = Math.atan(relvec3.y / relvec3.x) * 180 / Math.PI;
		if (relvec3.x >= 0.0) {
			this.rotation += 180;
		}

    this.lifeTime += deltaTime;

    var inputVec3 = new Vec2(0,0);
    if (keyCodeSet.has(87)) {
      inputVec3.y += -1;
    }
    if (keyCodeSet.has(83)) {
      inputVec3.y += 1;
    }

    if (keyCodeSet.has(65)) {
      inputVec3.x += -1;
    }
    if (keyCodeSet.has(68)) {
      inputVec3.x += 1;
    }

    let lookDotInput = inputVec3.normalized().dot(relvec3.normalized());

    // Move slower when going backwards
    let inputFactor = Math.min(Math.max(0,lookDotInput+1.5), 1);
    //console.log(inputFactor);
    var deltaPos = inputVec3;//.mul(inputFactor);

  
    deltaPos = deltaPos.normalized().mul(deltaTime * this.accel);

    // apply velocity from controls
    this.vel = this.vel.add(deltaPos);

    // Do friction
    let newMag = this.vel.mag() - this.decel * deltaTime;

    if (this.vel.mag() < 4) {
      this.vel = new Vec2(0, 0);
    }

    this.vel = this.vel.normalized();
    this.vel = this.vel.mul(newMag);

    // Speed limit
    if (this.vel.mag() > this.maxVel * inputFactor) {
      this.vel = this.vel.normalized().mul(this.maxVel * inputFactor);
    }

    //TODO: update this code e.g put guns into quadtree
    if (downKeysFrame.has(69)) {
      for (var i = 0; i < guns.length; i++) {
        if (guns[i].isIntersecting(this)) {

          if (this.altWeapon == null) {
            this.altWeapon = this.activeWeapon;
            this.activeWeapon = guns[i];
          } else {
            this.activeWeapon = guns[i];
          }
          this.tileIndex = this.activeWeapon.playerTileIndex;
          
          guns.splice(i, 1);
          i--;

          break;
        }
        
      }
    }

    // Firing bullets stuff
    this.timeSinceLastFire += deltaTime;
    // We ran out of ammo. spawn a pistol
    if (this.activeWeapon.ammo <= 0) {
      this.activeWeapon = new Pistol(new Vec2(0,0));
      this.tileIndex = this.activeWeapon.playerTileIndex;
    }

    var bulletVec2 = new Vec2(mouseX, mouseY).sub(cameraPosition.add(this.getCenter()));
    var bulletAngle = -Math.atan2(bulletVec2.y, bulletVec2.x); // In radians

    var spread = this.activeWeapon.spread;
    bulletAngle += 90 * (Math.PI / 180); // offset 90 degrees 


    if (this.timeSinceLastFire > this.activeWeapon.timeBetweenShots && mouseDown && this.activeWeapon.ammo > 0) {

      this.timeSinceLastFire = 0;
      //playSound();
      this.vel = this.vel.sub(bulletVec2.normalized().mul(this.activeWeapon.recoil));

      for (var i = 0; i < this.activeWeapon.bulletsEachShot; i++) {

        var offsetAngle = bulletAngle + (Math.random() * spread - (spread * 0.5) ) * (Math.PI / 180);
        bulletVec2 = new Vec2(Math.sin(offsetAngle), Math.cos(offsetAngle));

        var bullet = new Bullet(this.getCenter(), this.activeWeapon.damage);
        bullet.vel = bulletVec2.normalized().mul(this.activeWeapon.bulletSpeed);
        bullet.isPenatrating = this.activeWeapon.isPenatrating;
        bulletList.push(bullet);
        
      }
      this.activeWeapon.ammo = this.activeWeapon.ammo - 1;
    }
    
    super.update();
  }

  swapWeapon() {
    if (this.altWeapon == null)
      return;
    var temp = this.activeWeapon;
    this.activeWeapon = this.altWeapon;
    this.altWeapon = temp;
    this.tileIndex = this.activeWeapon.playerTileIndex;
  }
}