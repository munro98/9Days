class Vec2 {
  constructor (x, y){
    this.x = x;
    this.y = y;

  }

  add (v){
    return new Vec2(this.x + v.x, this.y + v.y);
  }

  sub (v){
    return new Vec2(this.x - v.x, this.y - v.y);
  }

  dot (v){
    return (this.x * v.x + this.y * v.y);
  }

  mul (f){
    return new Vec2 (this.x * f, this.y * f);
  }

  mag (){
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalized (){
    var mag = this.mag();
    if (mag == 0)
      return new Vec2 (0, 0, 0);
    return new Vec2 (this.x / mag, this.y / mag);
  }
}