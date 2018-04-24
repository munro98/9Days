
class GameManager {
  constructor (){

    this.states = {
      WARMUP: 0,
      PLAYING: 1,
      INTERMISSION: 2,
      END: 3
    };

    this.statesText = ["Warm Up", "Playing", "Intermission", "End"];

    this.warmupLength = 5;
    this.roundLength = 10;
    this.intermissionLength = 8;

    this.noRounds = 3;

    this.state = this.states.WARMUP;

    this.time = 0;
    this.round = 0;

    this.isDuringRound = false;


    this.logCounter = 0;
    this.timeBetweenLogs = 1;

    this.zombieSpawns = [new Vec2(2, 42), new Vec2(1, 62), new Vec2(1, 98), new Vec2(44, 98), new Vec2(82, 80), new Vec2(96, 70), new Vec2(44, 7)];


    this.zombieSpawnTime = 1.0;

    this.zombieSpawnTimer = 0.0;

  }

  update(deltaTime) {

    this.time += deltaTime;
    this.logCounter += deltaTime;


    if (this.state == this.states.WARMUP) {
      if (this.time > this.warmupLength) {
        this.time = 0.0;
        this.state = this.states.PLAYING;
        this.isDuringRound = true;
        this.round++;
      }
    } else if (this.state == this.states.PLAYING) {

      this.zombieSpawnTimer -= deltaTime;

      if (this.zombieSpawnTimer < 0 ) {
        this.zombieSpawnTimer = this.zombieSpawnTime;
        //zombieList.push(new Zombie(new Vec2(100+i*50, 1800+j*50)));

        let randInt = Math.floor(Math.random()*this.zombieSpawns.length);
        let spawnPos = this.zombieSpawns[randInt].mul(32);
        zombieList.push(new Zombie(spawnPos));

      }

      if (this.time > this.roundLength) {

        this.time = 0.0;
        if (this.round >= this.noRounds) {
          this.state = this.states.END;
          this.isDuringRound = false;
        } else {
          
          this.state = this.states.INTERMISSION;
          this.isDuringRound = false;
        }
        
      }

    } else if (this.state == this.states.INTERMISSION) {
      if (this.time > this.intermissionLength) {
        this.time = 0.0;
        this.state = this.states.PLAYING;
        this.round++;
      }
      
    } else if (this.state == this.states.END) {
      this.isDuringRound = false;
    }

  }

  log() {
    if (this.logCounter > this.timeBetweenLogs) {
      this.logCounter = 0.0;

      console.log("round: " + this.round + " " + this.state + " " + this.time + " ");

    }
  }

  doStuff (v){
    
  }


  
}