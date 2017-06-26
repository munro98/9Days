class Zombie extends Actor {
  constructor (pos) {
    super(64, pos)

    this.accel = 100;
    this.maxVel = 100;
  }

  update (){
    
    this.lifeTime += deltaTime;

    var deltaPos = player.pos.sub(this.pos);
    deltaPos = deltaPos.normalized().mul(deltaTime * this.accel);
    this.vel = this.vel.add(deltaPos);

    if (this.vel.mag() > this.maxVel) {
      this.vel = this.vel.normalized().mul(this.maxVel);
    }

    if (deltaPos.mag() == 0) {
      this.vel = this.vel.mul(25 * deltaTime);
    }

    this.pos.x += this.vel.x * deltaTime;
    this.pos.y += this.vel.y * deltaTime;

    this.rotation = Math.atan(this.vel.y / this.vel.x) * 180 / Math.PI;
    if (this.vel.x >= 0.0) {
      this.rotation += 180;
    }

    this.rotation += 90;

    this.texture = new Texture("res/player.png");
  }

  draw (view){
    var vec3 = view.add(this.pos);

    ctx.save();
    ctx.translate(vec3.x,vec3.y);
    ctx.strokeStyle = "rgb(255,0,0)";
    ctx.strokeRect(0, 0,this.width,this.height);
    ctx.rotate(this.rotation * Math.PI/180);
    ctx.drawImage(this.texture.image,-32,-32);
    ctx.restore();
  }

  hit (v){
    //if(this.pos.x+this.width / 2 < v.x || this.pos.x-this.width  / 2 > v.x ) return false;
    //if(this.pos.y+this.height / 2 < v.y || this.pos.y-this.height  / 2 > v.y ) return false;

    if(this.pos.x+this.width / 2 < v.x || this.pos.x-this.width  / 2 > v.x ) return false;
    if(this.pos.y+this.height / 2 < v.y || this.pos.y-this.height  / 2 > v.y ) return false;

    return true;
  }
}