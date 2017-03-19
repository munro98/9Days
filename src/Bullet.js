class Bullet {
  constructor (pos, rot) {
    this.pos = pos;
    this.vel = new Vec2(0, 0, 0);

    this.width = 16;
    this.height = 16;
    this.lifeTime = 0;
    this.rotation = rot;

    this.texture = new Texture("res/bullet.png");
  }

  update (){
    this.pos.x += this.vel.x * deltaTime;
    this.pos.y += this.vel.y * deltaTime;
    this.lifeTime += deltaTime;
  }

  draw (viewMatrix){
    var vec3 = viewMatrix.add(this.pos);
    ctx.save();
    ctx.translate(vec3.x,vec3.y);
    ctx.rotate((this.rotation + 90) * Math.PI/180);
    ctx.drawImage(this.texture.image,-8,-8);
    ctx.restore();
  }
}