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

    this.altWeapon = new Rifle(new Vec2(0, 0));
		this.activeWeapon = new Pistol(new Vec2(0, 0));

    
  }

  update (){

    var vec3 = cameraPosition.add(this.getCenter()); // position of player screen space
		var relvec3 = new Vec2(mouseX, mouseY).sub(vec3);

		this.rotation = Math.atan(relvec3.y / relvec3.x) * 180 / Math.PI;
		if (relvec3.x >= 0.0) {
			this.rotation += 180;
		}

		this.rotation += 90;

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

    var deltaPos = inputVec3;
    deltaPos = deltaPos.normalized().mul(deltaTime * this.accel);
    this.vel = this.vel.add(deltaPos);

    if (this.vel.mag() > this.maxVel) {
      this.vel = this.vel.normalized().mul(this.maxVel);
    }

    var deceleration = this.decel * deltaTime;
    //console.log(this.decel);
    if (inputVec3.mag() == 0) {
      //var decelerationVec3 = new Vec3(0, 0, 0); TODO Make deceleration normalized
      if (this.vel.x > 0) {
        this.vel.x = Math.max(this.vel.x - deceleration, 0);
      } else {
        this.vel.x = Math.min(this.vel.x + deceleration, 0);
      }
      if (this.vel.y > 0) {
        this.vel.y = Math.max(this.vel.y - deceleration, 0);
      } else {
        this.vel.y = Math.min(this.vel.y + deceleration, 0);
      }
    }

    if (downKeysFrame.has(69)) {
      console.log("sdg")
      for (var i = 0; i < guns.length; i++) {
        if (guns[i].hit(this.getCenter())) { //.add(new Vec2(this.width / 2, this.height / 2))
          if (this.altWeapon == null) {
            this.altWeapon = this.activeWeapon;
            this.activeWeapon = guns[i];
          } else {
            this.activeWeapon = guns[i];
          }
          
          guns.splice(i, 1);
          i--;
        }
        
      }
    }

    this.timeSinceLastFire += deltaTime;

    if (this.activeWeapon.ammo <= 0) {
      this.activeWeapon = new Pistol(new Vec2(0,0));
    }

    var bulletVec2 = new Vec2(mouseX, mouseY).sub(cameraPosition.add(this.getCenter()));
    var bulletAngle = -Math.atan2(bulletVec2.y, bulletVec2.x); // In radians

    var spread = this.activeWeapon.spread;
    bulletAngle += 90 * (Math.PI / 180); // offset 90 degrees 

    //console.log(bulletAngle + ": " + bulletVec3.x + " " + bulletVec3.y + " ")
    //console.log();

    if (this.timeSinceLastFire > this.activeWeapon.timeBetweenShots && mouseDown && this.activeWeapon.ammo > 0) {


      this.timeSinceLastFire = 0;
      //playSound();
      for (var i = 0; i < this.activeWeapon.bulletsEachShot; i++) {

        var offsetAngle = bulletAngle + (Math.random() * spread - (spread * 0.5) ) * (Math.PI / 180);
        bulletVec2 = new Vec2(Math.sin(offsetAngle), Math.cos(offsetAngle));


        var bullet = new Bullet(this.getCenter(), this.activeWeapon.damage); // , -offsetAngle * 180 / Math.PI
        bullet.vel = bulletVec2.normalized().mul(this.activeWeapon.bulletSpeed);
        bulletList.push(bullet);
        
      }
      this.activeWeapon.ammo = this.activeWeapon.ammo - 1;
    }

    //if (onKeyDownCodeSet.has(69)) {
    


    super.update();
  }

  swapWeapon() {
    if (this.altWeapon == null)
      return;
    var temp = this.activeWeapon;
    this.activeWeapon = this.altWeapon;
    this.altWeapon = temp;
  }
}