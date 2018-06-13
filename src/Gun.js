//4000 bullet speed should be the limit

class Gun extends Entity {
  constructor (size, pos, path, timeBetweenShots, damage, spread, bulletsEachShot, ammo, bulletSpeed) {
    super(size, pos);
    this.texture = new Texture(path);
    this.timeBetweenShots = timeBetweenShots;
    this.damage = damage;
    this.spread = spread;
    this.bulletsEachShot = bulletsEachShot;
    this.ammo = ammo;
    this.bulletSpeed = bulletSpeed;

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

class Pistol extends Gun { // smg1_fire1
  constructor (pos) {
      super(64, pos, "res/pistol.png", 0.2, 25, 14, 1, 999, 1000);
    }
}

class Deagle extends Gun { // deagle_fire
  constructor (pos) {
      super(64, pos, "res/pistol.png", 0.2, 25, 14, 1, 999, 1000);
    }
}

class Rifle extends Gun { // mk20_sfire
  constructor (pos) {
      super(64, pos,"res/rifle.png", 0.1, 30, 8, 1, 330, 1500);
    }
}

class SuperRifle extends Gun {
  constructor (pos) {
      super(64, pos,"res/rifle.png", 0.001, 30, 2, 4, 9999, 2000);
    }
}

class Uzi extends Gun { // mk20_sfire
  constructor (pos) {
      super(64, pos,"res/rifle.png", 0.1, 30, 8, 1, 330, 1500);
    }
}


class Sniper extends Gun { // mk20_fire
  constructor (pos) {
      super(64, pos,"res/fence.png", 0.4, 120, 0.00, 1, 90, 4000);
    }
}


class PenatratorSniper extends Gun { // Sniper
  constructor (pos) {
      super(64, pos,"res/fence.png", 0.4, 120, 0.00, 1, 90, 4000);
    }
}


class ShotGun extends Gun { // shotgun_fire
  constructor (pos) {
      super(64, pos,"res/rifle.png", 0.4, 60, 20, 5, 60, 1000);
    }
}

// Add mass knockback on player and target
class BoomStick extends Gun { // shotgun_dbl_fire
  constructor (pos) {
      super(64, pos,"res/rifle.png", 0.4, 60, 20, 8, 60, 1000);
    }
}

var Guns = [Sniper, Rifle, ShotGun, BoomStick];