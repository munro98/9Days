class Player extends Actor {
    constructor (pos) {
    super(64, pos)
    
    this.accel = 800;
    this.decel = 400;
    this.maxVel = 240;
    this.rotation = 0;

    this.timeSinceLastFire = 0;

    this.texture = new Texture("res/player.png");

    this.altWeapon = null;
    this.activeWeapon = new Pistol(new Vec2(0,0));
  }

  update (){

    var vec3 = cameraPosition.add(this.pos); // position of player screen space
    var relvec3 = new Vec2(mouseX, mouseY).sub(vec3);
    
    //this.rotation
    this.rotation = Math.atan(relvec3.y / relvec3.x) * 180 / Math.PI;
    if (relvec3.x >= 0.0) {
      this.rotation += 180;
    }

    this.rotation += 90;
    //(Math.random() - 0.5) * 2;
    //console.log(this.rotation);

    this.lifeTime += deltaTime;

    var inputVec3 = new Vec2(0,0);
    if (keyCodeSet.has(87)) {
      inputVec3.y = -4;
    }
    if (keyCodeSet.has(83)) {
      inputVec3.y = 4;
    }

    if (keyCodeSet.has(65)) {
      inputVec3.x = -4;
    }
    if (keyCodeSet.has(68)) {
      inputVec3.x += 4;
    }

    var deltaPos = inputVec3;
    deltaPos = deltaPos.normalized().mul(deltaTime * this.accel);
    this.newVel = this.newVel.add(deltaPos);

    if (this.newVel.mag() > this.maxVel) {
      this.newVel = this.newVel.normalized().mul(this.maxVel);
    }

    var deceleration = this.decel * deltaTime;
    //console.log(this.decel);
    if (inputVec3.mag() == 0) {
      //var decelerationVec3 = new Vec3(0, 0, 0); TODO Make deceleration normalized
      if (this.newVel.x > 0) {
        this.newVel.x = Math.max(this.newVel.x - deceleration, 0);
      } else {
        this.newVel.x = Math.min(this.newVel.x + deceleration, 0);
      }
      if (this.newVel.y > 0) {
        this.newVel.y = Math.max(this.newVel.y - deceleration, 0);
      } else {
        this.newVel.y = Math.min(this.newVel.y + deceleration, 0);
      }
    }

    if (keyCodeSet.has(69) & 1) {
      for (var i = 0; i < guns.length; i++) {
        if (guns[i].hit(this.pos)) { //.add(new Vec2(this.width / 2, this.height / 2))
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

    var bulletVec3 = new Vec2(mouseX, mouseY).sub(cameraPosition.add(this.pos));
    // this.timeSinceLastFire > activeWeapon.fireRate && mouseDown
    if (this.timeSinceLastFire > this.activeWeapon.timeBetweenShots && mouseDown && this.activeWeapon.ammo > 0) {
      this.timeSinceLastFire = 0;
      for (var i = 0; i < this.activeWeapon.bulletsEachShot; i++) {
        var bullet = new Bullet(new Vec2(this.pos.x, this.pos.y), this.rotation);
        bullet.vel = new Vec2(bulletVec3.x, bulletVec3.y, 0).normalized().mul(1000);
        entityList.push(bullet);
        this.activeWeapon.ammo = this.activeWeapon.ammo - 1;
      }
    }
    //console.log(this.pos.x);
    //this.pos.x += this.vel.x * deltaTime;
    //this.pos.y += this.vel.y * deltaTime;

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

  draw (view){
    //console.log("draw " + this.pos.x);
    var vec3 = view.add(this.pos);

    ctx.save();
    ctx.translate(vec3.x,vec3.y);
    ctx.strokeStyle = "rgb(255,0,0)";
    ctx.strokeRect(0, 0,this.width,this.height);
    ctx.rotate(this.rotation * Math.PI/180);
    ctx.drawImage(this.texture.image,-32,-32);
    ctx.restore();

  }
}