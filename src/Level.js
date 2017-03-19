class Level{
  constructor (width) {
    this.width = width;
    console.log(width);
    this.pos = new Vec2(0, 0, 0);

    this.backgroundcells = new Array();
    this.cells = new Array();

    this.nodes = new Map();
    this.edges = new Map();
    /*
    for (var i = 0; i < this.width; i++) {
        this.backgroundcells.push(new Array());
        this.cells.push(new Array());
        for (var j = 0; j < this.width; j++) {

          this.backgroundcells[i].push(1);

          if (i == 0 || i == (this.width-1) || j == 0 || j == (this.width-1)) 
          {
            this.cells[i].push(2);
          }
          else 
          {
            this.cells[i].push(0);
          }
          

        }
        
    }*/

    for (var i = 0; i < this.width; i++) {
        this.backgroundcells.push(new Array());
        this.cells.push(new Array());
        for (var j = 0; j < this.width; j++) {

          var pixel = ctx.getImageData(i, j, 1, 1).data;
          //console.log(pixel);

          if (this.aroundColour(pixel[0], 255)) {
            this.backgroundcells[i].push(1);
          } else {
            this.backgroundcells[i].push(0);
          }
          
          if (this.aroundColour(pixel[1], 255)) 
          {
            this.cells[i].push(2);
          }
          else 
          {
            this.cells[i].push(0);
            this.nodes.set(i + j * this.width, new Node(i, j));
          }
          

        }
        
    }

    // Construct graph of level





  }

  aroundColour(pixel, desiredColour) {
    if (pixel > desiredColour - 14 && pixel < desiredColour + 14) {
        return true;
    }
    return false;
  }

  draw (view){
    //console.log("draw " + this.pos.x);
    var vec3 = view.add(this.pos);
    //ctx.strokeRect(vec3.x - this.width/2, vec3.y - this.height/2, this.width, this.height);

    for (var i = 0; i < this.width; i++) {
        for (var j = 0; j < this.width; j++) {
          if (this.backgroundcells[i][j] == 1) {
            //ctx.fillRect(cameraX + i*zoom, cameraY+j*zoom,zoom,zoom);
            //ctx.strokeRect(vec3.x + i * 20, vec3.y + j * 20,20,20);
            ctx.drawImage(background,vec3.x + i * 32,vec3.y + j * 32);
          } 

          if (this.cells[i][j] == 2) {
            ctx.drawImage(fence,vec3.x + i * 32,vec3.y + j * 32);
          
          }
        }

        
      }
  }

  hitPlayer (v){
    
    //if(this.pos.x+this.width / 2 < v.x || this.pos.x-this.width  / 2 > v.x ) return false;
    //if(this.pos.y+this.height / 2 < v.y || this.pos.y-this.height  / 2 > v.y ) return false;
    return false;
    //return true;
  }

  hit (v){
    ///*
    var x = Math.round((v.x - 6) / 32 );
    var y = Math.round((v.y - 6) / 32 );

    if (x >= 0 && x < 32 && y >= 0 && y < 32 && this.cells[x][y]) {
      return true;
    }
    //*/
    //if(this.pos.x + this.width < v.x || this.pos.x > v.x ) return false;
    //if(this.pos.y + this.width < v.y || this.pos.y > v.y ) return false;
    return false;
    //return true;
  }
}


class Node{
    constructor (i, j) {
      this.i = i;
      this.j = j;
    }
}