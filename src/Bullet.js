class Bullet {
  constructor (pos, damage) {
    this.pos = new Vec2(pos.x, pos.y);
    this.damage = damage;
    this.vel = new Vec2(0, 0);

    this.width = 16;
    this.height = 16;
    this.lifeTime = 0;
    this.rotation = 0;

    this.texture = new Texture("res/bullet.png");
    this.remove = false;
  }

  update (){
    /*
    
    */
    if (level.hit(this.pos.add(new Vec2(this.vel.x * deltaTime, 0))) || level.hit(this.pos.add(new Vec2(this.vel.x * (deltaTime * 0.5), 0))) ) {
      this.vel.x = -this.vel.x;
    } else if (level.hit(this.pos.add(new Vec2(0, this.vel.y * deltaTime))) ||  level.hit(this.pos.add(new Vec2(0, this.vel.y * (deltaTime * 0.5)))) ) {
      this.vel.y = -this.vel.y;
    }

    if (this.testHitLevel()) {
      //this.remove = true;
    }

    this.pos.x += this.vel.x * deltaTime;
    this.pos.y += this.vel.y * deltaTime;
    this.lifeTime += deltaTime;

    

    if (this.lifeTime > 4) {
      this.remove = true;
    }
  }

  testHitLevel() {
    var samples = 4;
    var step = 1 / samples;
    for (var i = 0, fraction = 0.0; i < samples; i++, fraction+= step ) {
      if (level.hit(this.pos.add(this.vel.mul(deltaTime*fraction)))) {
        return true;
      }

    }
    return false;
  }

  draw (view, cameraBound){
    var vec3 = view.add(this.pos);
    if (vec3.x < 0|| vec3.y < 0)
      return;
    if (vec3.x > cameraBound.x || vec3.y > cameraBound.y)
      return;

    this.rotation = Math.atan(this.vel.y / this.vel.x) * 180 / Math.PI;
    if (this.vel.x >= 0.0) {
      this.rotation += 180;
    }


    ctx.save();
    ctx.translate(vec3.x,vec3.y);
    ctx.rotate((this.rotation-180) * Math.PI/180);
    ctx.drawImage(this.texture.image,-8,-8);
    ctx.restore();
  }
}