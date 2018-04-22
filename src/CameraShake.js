class CameraShake {
  constructor(interval, triggerFirst, randomInitialDelay) {
    this.growth = 5;

    this.amplitude = 3; // 3
    this.frequency = 60; // 100

    this.amount = 4; // 4
    this.time = 0;

    this.offset = new Vec2(0, 0);
  }

  reset() {
    this.amount = 1;
    this.time = 0;
  }

  update(dt) {
    this.amount = Math.max(1, this.amount ^ 0.9);
    this.time = this.time + dt;
  }

  more() {
    this.amount = this.amount + this.growth;
  }

  preDraw() {
    let shakeFactor = this.amplitude * Math.log(this.amount);
    let waveX = Math.sin(this.time * this.frequency);
    let waveY = Math.cos(this.time * this.frequency);

    this.offset = new Vec2(shakeFactor * waveX, shakeFactor * waveY);

    //console.log(this.offset.x);
  }




}