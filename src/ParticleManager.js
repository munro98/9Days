class ParticleManager
{
    constructor() {
        this.particleCount = 256;

        this.positions = new Float32Array(this.particleCount * 2);
        this.velocities = new Float32Array(this.particleCount * 2);
        this.colors = new Float32Array(this.particleCount * 3);

        this.lifeTimes = new Float32Array(this.particleCount);

        this.currentParticle = 0;

        //this.texture = "res/player.png";
        this.texture = new Texture("res/debris.png");
    }

    createParticle(pos, vel, color, lifeTime) {

        let i = this.currentParticle;
        
        this.lifeTimes[i] = lifeTime;

        this.positions[i* 2] = pos.x;
        this.positions[i* 2+1] = pos.y;

        this.velocities[i* 2] = vel.x;
        this.velocities[i* 2+1] = vel.y;

        this.colors[i* 2] = color.x;
        this.colors[i* 2+1] = color.y;
        this.colors[i* 2+2] = color.z;

        this.currentParticle++;
        this.currentParticle = this.currentParticle % this.particleCount;
       
    }

    update(level, deltaTime) {

        for (let i = 0; i < this.particleCount; i++) {

            this.lifeTimes[i] -= deltaTime;

            let vel = new Vec2(this.velocities[i* 2], this.velocities[i* 2+1]);

            let newMag = vel.mag() - 4000 * deltaTime;

            if (vel.mag() < 100) {
                vel = new Vec2(0, 0);
            }

            vel = vel.normalized();


            this.velocities[i* 2] = vel.x * newMag;
            this.velocities[i* 2+1] = vel.y * newMag;

            this.positions[i* 2] += this.velocities[i* 2] * deltaTime;
            this.positions[i* 2+1] += this.velocities[i* 2+1] * deltaTime;
            
        }

    }


    render(view) {

        //let i = 0;
        //ctx.drawImage(chunk.offscreenCanvas, 0, 0, chunk.offscreenCanvas.width, chunk.offscreenCanvas.height, vec.x + i * (this.tileSize*this.chunkSize),vec.y + j * (this.tileSize*this.chunkSize), chunk.offscreenCanvas.width, chunk.offscreenCanvas.height);

        for (let i = 0; i < this.particleCount; i++) {

            if (this.lifeTimes[i] < 0) {
                continue;
            }

            let posX = this.positions[i* 2];
            let posY = this.positions[i* 2+1];

            var vec = view.add(new Vec2(posX, posY));
            vec.x = Math.floor(vec.x);
            vec.y = Math.floor(vec.y);

            //ctx.save();
            //ctx.translate(vec.x,vec.y);
            //ctx.drawImage(texture.getTexture(this.texture), -32/2, -32/2);
            ctx.drawImage(this.texture.image, 0, 0, 32, 32, vec.x ,vec.y, 32, 32);
            //ctx.drawImage(this.texture.image, -32/2, -32/2);
            //ctx.restore();

        }

    }
}