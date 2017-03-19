class Entity {
  constructor () {
    this.pos = new Vec2(0, 0, 0);
    this.vel = new Vec2(0, 0, 0);

    this.width = 32;
    this.height = 32;
    this.lifeTime = 0;
    this.rotation = 0;
  }

  update (){
    this.pos.x += this.vel.x * deltaTime;
    this.pos.y += this.vel.y * deltaTime;
    this.lifeTime += deltaTime;
  }

  isOnScreen (view){
    var vec2 = view.add(this.pos);
    //if (vec2.x > 0 & vec2.y > 0) {
      //return true
    //}
  }
  /*
  draw (view){
    //console.log("draw " + this.pos.x);
    var vec2 = view.add(this.pos);
    ctx.strokeRect(vec2.x, vec2.y, this.width, this.height);
  }
  */
}