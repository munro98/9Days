//4000 bullet speed should be the limit

class Gun extends Entity {
  constructor (size, pos, tileIndex, timeBetweenShots, damage, spread, bulletsEachShot, ammo, bulletSpeed, recoil) {
    super(size, pos);
    this.tileIndex = tileIndex;
    this.timeBetweenShots = timeBetweenShots;
    this.damage = damage;
    this.spread = spread;
    this.bulletsEachShot = bulletsEachShot;
    this.ammo = ammo;
    this.bulletSpeed = bulletSpeed;
    this.recoil = recoil;

    this.lifeTime = 0;
    this.remove = false;
    this.isPenatrating = false;

    this.playerTileIndex = 0;

  }

  update() {
    this.lifeTime += deltaTime;

    if (this.lifeTime > 30) {
      this.remove = true;
    }

  }

  draw (view) {
    // TODO: check if onscreen

    let vec = view.add(this.pos);

    let type = this.tileIndex;
    let tileX = type % Gun.tilesPerRow;
    let tileY = (type / Gun.tilesPerRow) >> 0;
    ctx.drawImage(Gun.texture.image, tileX * Gun.tileSize, tileY * Gun.tileSize, Gun.tileSize, Gun.tileSize, vec.x ,vec.y, Gun.tileSize, Gun.tileSize);
  }

  isIntersecting (other) {
    if(other.pos.x + other.width < this.pos.x || other.pos.x > this.pos.x + this.width) return false;
    if(other.pos.y + other.height< this.pos.y || other.pos.y > this.pos.y + this.height) return false;
       return true;
  }

}

class Pistol extends Gun {
  constructor (pos) {
      super(64, pos, 0, 0.35, 25, 14, 1, 999, 1000, 20);
    }
}

class Deagle extends Gun {
  constructor (pos) {
      super(64, pos, 1, 0.4, 51, 14, 1, 999, 2000, 20);
    }
}

class Rifle extends Gun {
  constructor (pos) {
      super(64, pos, 2, 0.1, 30, 8, 1, 330, 1500, 20);
      this.playerTileIndex = 1;
    }
}

class SuperRifle extends Gun {
  constructor (pos) {
      super(64, pos, 3, 0.001, 30, 2, 4, 9999, 2000, 20);
      this.playerTileIndex = 1;
    }
}

class Uzi extends Gun {
  constructor (pos) {
      super(64, pos, 7, 0.1, 30, 45, 1, 330, 1500, 20);
      this.playerTileIndex = 3;
    }
}

class Sniper extends Gun {
  constructor (pos) {
      super(64, pos, 4, 0.4, 120, 0.00, 1, 90, 3000, 200);
      this.playerTileIndex = 1;
    }
}

class PenatratorSniper extends Gun {
  constructor (pos) {
      super(64, pos, 5, 0.6, 120, 0.00, 1, 90, 5000, 300);
      this.isPenatrating = true;
      this.playerTileIndex = 1;
    }
}

class ShotGun extends Gun {
  constructor (pos) {
      super(64, pos, 9, 0.4, 60, 20, 5, 60, 1000, 300);
      this.playerTileIndex = 2;
    }
}

class BoomStick extends Gun {
  constructor (pos) {
      super(64, pos, 8, 0.4, 40, 70, 3, 60, 1000, 1000);
      this.playerTileIndex = 2;
    }
}

Gun.tileSize = 64;
Gun.tilesPerRow = 4;
Gun.texture = new Texture("res/guns.png");

Gun.Guns = [Sniper, Rifle, ShotGun, BoomStick, PenatratorSniper];