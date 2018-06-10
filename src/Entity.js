class Entity {
  constructor (size, pos) {
    this.pos = pos;
    this.vel = new Vec2(0, 0);
    this.newVel = new Vec2(0, 0);

    this.width = size;
    this.height = size;
    this.lifeTime = 0;
    this.health = 100;
    this.rotation = 0;

    this.mass = 10;
    this.remove = false;
  }

  update (){

    ///*
		var nextXposition = this.pos.x + this.vel.x * deltaTime;
		var hitX = false;

		for (let x = 0; x <= this.width; x += 32) {
			for (let y = 0; y <= this.width; y += 32) {
				hitX |= level.hit(new Vec2(nextXposition + x, this.pos.y + y));
			}
		}

		if (!hitX) {
			this.pos.x += this.vel.x * deltaTime;
		} else {
			this.vel.x = 0;
		}

		var nextYposition = this.pos.y + this.vel.y * deltaTime;
		var hitY = false;

		for (let x = 0; x <= this.width; x += 32) {
			for (let y = 0; y <= this.width; y += 32) {
				hitY |= level.hit(new Vec2(this.pos.x + x, nextYposition + y));
			}
		}
		if (!hitY) {
			this.pos.y += this.vel.y * deltaTime;
		} else {
			this.vel.y = 0;
		}
		//*/

		this.lifeTime += deltaTime;

		if (this.health < 0) {
			this.remove = true;
		}
  }

  getCenter() {
		return this.pos.add(new Vec2(this.width * 0.5, this.height * 0.5));
	}

  isOnScreen (view){
    var vec2 = view.add(this.pos);
    //if (vec2.x > 0 & vec2.y > 0) {
      //return true
    //}
  }

  isIntersecting (other) {
      if(other.pos.x + other.width < this.pos.x || other.pos.x > this.pos.x + this.width) return false;
      if(other.pos.y + other.height< this.pos.y || other.pos.y > this.pos.y + this.height) return false;
         return true;
  }

  isPointIntersecting (other) {
      if(other.pos.x < this.pos.x || other.pos.x > this.pos.x + this.width) return false;
      if(other.pos.y < this.pos.y || other.pos.y > this.pos.y + this.height) return false;
         return true;
  }

  isPointIntersecting2 (other) {
      if(other.x < this.pos.x || other.x > this.pos.x + this.width) return false;
      if(other.y < this.pos.y || other.y > this.pos.y + this.height) return false;
         return true;
  }

  resolveCollision(other) {
    // Calculate relative velocity
    var rv = new Vec2 (other.vel.x, other.vel.y);
    rv = rv.sub(new Vec2 (this.vel.x, this.vel.y));

    // Calculate relative velocity in terms of the normal direction
    var normal = new Vec2 (other.pos.x, other.pos.y);
    normal = normal.sub(new Vec2 (this.pos.x, this.pos.y));
    normal = normal.normalized();
    var velAlongNormal = rv.dot(normal);

    // Do not resolve if velocities are separating
    if(velAlongNormal > 0)
      return;

    // Calculate restitution
    //var e = Math.min( A.restitution, B.restitution)
    var e = 0.6;

    // Calculate impulse scalar
    var j = -(1 + e) * velAlongNormal
    j /= 1 / this.mass + 1 / other.mass

    // Apply impulse
    var impulse = normal.mul(j);//j * normal

    var  vA = new Vec2 (1 / this.mass * impulse.x, 1 / this.mass * impulse.y);
    var  vB = new Vec2 (1 / other.mass * impulse.x, 1 / other.mass * impulse.y);

    this.vel.x -= vA.x;
    this.vel.y -= vA.y;

    other.vel.x += vB.x;
    other.vel.y += vB.y;
  }

  draw (view){
    //console.log("draw " + this.pos.x);
    var vec = view.add(this.pos);
    vec.x = Math.floor(vec.x);
    vec.y = Math.floor(vec.y);

    ctx.save();
    ctx.translate(vec.x,vec.y); //  +this.height*0.5
    ctx.strokeStyle = "rgb(255,0,0)";
    //ctx.strokeRect(0, 0,this.width,this.height);

    ctx.translate(+this.width*0.5, +this.width*0.5);
    ctx.rotate(this.rotation * Math.PI/180);

    ctx.drawImage(this.texture.image,-32,-32);
    ctx.restore();

  }

}