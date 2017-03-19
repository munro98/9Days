class Gun extends Entity {
  constructor (size, pos, path, timeBetweenShots, damage, spread, bulletsEachShot, ammo) {
    super();
    this.pos = pos;
    this.size = size;
    this.texture = new Texture(path);
    this.timeBetweenShots = timeBetweenShots;
    this.damage = damage;
    this.spread = spread;
    this.bulletsEachShot = bulletsEachShot;
    this.ammo = ammo;

  }

  draw (view) {
  	var vec3 = view.add(this.pos);
  	ctx.drawImage(this.texture.image, vec3.x, vec3.y);
  }

  hit (v){
    if(this.pos.x+this.size < v.x || this.pos.x > v.x ) return false;
    if(this.pos.y+this.size < v.y || this.pos.y > v.y ) return false;

    return true;
  }
}

class Pistol extends Gun {
	constructor (pos) {
    	super(64, pos, "res/pistol.png", 0.4, 25, 2, 1, 999);
  	}
}

class Rifle extends Gun {
	constructor (pos) {
    	super(64, pos,"res/rifle.png", 0.1, 60, 2, 1, 230);
  	}
}


class Sniper extends Gun {
	constructor (pos) {
    	super(64, pos,"res/fence.png", 0.1, 200, 2, 1, 60);
  	}
}
