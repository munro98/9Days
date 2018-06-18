class ParticleManager
{
    constructor() {
        this.particleCount = 1024;
        this.positions = new Float32Array(this.particleCount * 2);
        this.velocities = new Float32Array(this.particleCount * 2);

        this.lifeTimes = new Float32Array(this.particleCount);
        this.particleTypes = new Uint8Array(this.particleCount);
        this.isAlive = new Uint8Array(this.particleCount);

        this.currentParticle = 0;

        this.tileSize = 16;
        this.textureTilesPerRow = 4;
        this.texture = new Texture("res/particles.png");
    }

    createParticle(pos, vel, type, lifeTime) {

        let i = this.currentParticle;

        if (this.isAlive[i] == 1) {
            this.isAlive[i] = 0;

            let type = this.particleTypes[i];
            let tileX = type % this.textureTilesPerRow;
            let tileY = (type / this.textureTilesPerRow) >> 0;
            
            level.drawParticleToChunk(this.positions[i* 2], this.positions[i* 2+1], this.texture, tileX, tileY, this);
        }
        
        this.lifeTimes[i] = lifeTime;

        this.isAlive[i] = 1;

        this.positions[i* 2] = pos.x;
        this.positions[i* 2+1] = pos.y;

        this.velocities[i* 2] = vel.x;
        this.velocities[i* 2+1] = vel.y;

        this.particleTypes[i] = type;


        this.currentParticle++;
        this.currentParticle = this.currentParticle % this.particleCount;
       
    }

    update(level, deltaTime) {

        for (let i = 0; i < this.particleCount; i++) {

            this.lifeTimes[i] -= deltaTime;

            if (this.lifeTimes[i] < 0) {
                if (this.isAlive[i] == 1) {
                    this.isAlive[i] = 0;

                    let type = this.particleTypes[i];
                    let tileX = type % this.textureTilesPerRow;
                    let tileY = (type / this.textureTilesPerRow) >> 0;

                    level.drawParticleToChunk(this.positions[i* 2], this.positions[i* 2+1], this.texture, tileX, tileY, this);

                    //console.log("particleded");
                }
                continue;
            }

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


    render(view, cameraBound) {

        //let i = 0;
        //ctx.drawImage(chunk.offscreenCanvas, 0, 0, chunk.offscreenCanvas.width, chunk.offscreenCanvas.height, vec.x + i * (this.tileSize*this.chunkSize),vec.y + j * (this.tileSize*this.chunkSize), chunk.offscreenCanvas.width, chunk.offscreenCanvas.height);

        for (let i = 0; i < this.particleCount; i++) {

            if (this.isAlive[i] == 0) {
                continue;
            }

            let posX = this.positions[i* 2];
            let posY = this.positions[i* 2+1];

            let vec = view.add(new Vec2(posX, posY));
            vec.x = vec.x >> 0;
            vec.y = vec.y >> 0;

            /*
            if (vec.x < 0|| vec.y < 0)
            return;
            if (vec.x > cameraBound.x || vec.y > cameraBound.y)
            return;
            */

            let type = this.particleTypes[i];
            let tileX = type % this.textureTilesPerRow;
            let tileY = (type / this.textureTilesPerRow) >> 0;

            ctx.drawImage(this.texture.image, tileX * this.tileSize, tileY * this.tileSize, this.tileSize, this.tileSize, vec.x ,vec.y, this.tileSize, this.tileSize);

        }

    }
}

ParticleManager.tileSize = 16;
ParticleManager.types = {
    DEBRI : 0,
    BLOOD : 1,
    FIRE : 2,
    SMOKE : 3,
    SPARK : 4,
};