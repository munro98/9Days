
class QuadTree {

  constructor(x, y, w, depth) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.depth = depth;

    this.q0 = null;
    this.q1 = null;
    this.q2 = null;
    this.q3 = null;

    this.isLeaf = false;
    this.points = new Array();

    this.selected = false;
  }
  
  addEntity (entity) {
    //console.log("e.x" + entity.pos.x);
    
    // The entity isn't completely contained in ours
    if (entity.pos.x < this.x || entity.pos.x + entity.width > this.x + this.w || entity.pos.y < this.y || entity.pos.y + entity.height > this.y + this.w) {
      //console.log("not fit ")
      return false;
    }

    if (this.points.length == 0 && this.isLeaf == false && this.q0 == null) { // This node is empty so make it a leaf
      this.points.push(entity);
      this.isLeaf = true;

      return true;

    } else if (this.isLeaf) { // we are a leaf so check if need subdivide

      // If we can subdivide then subdivide
      //                   MaxElements      MaxDepth    
      if (this.points.length >= 1 && this.depth < 32) {//

        this.q0 = new QuadTree(this.x, this.y, this.w / 2, this.depth + 1);
        this.q1 = new QuadTree(this.x + this.w / 2, this.y, this.w / 2, this.depth + 1);
        this.q2 = new QuadTree(this.x, this.y + this.w / 2, this.w / 2, this.depth + 1);
        this.q3 = new QuadTree(this.x + this.w / 2, this.y + this.w / 2, this.w / 2, this.depth + 1);

        this.isLeaf = false; // Quadrant 0 is no longer a leaf node

        // try stuff out elements into our children if they can fit
        var insertionCounter = 0;
        var unfitList = new Array();
        while (this.points.length > 0) {
          var temp = this.points.pop();
          
          if (!this.q0.addEntity(temp)) {

            if (!this.q1.addEntity(temp)) {

              if (!this.q2.addEntity(temp)) {

                  if (!this.q3.addEntity(temp)) {

                    unfitList.push(temp);

                  } else {insertionCounter++}
              } else {insertionCounter++}
            } else {insertionCounter++}
          }else {insertionCounter++}
        }

        // These elements couldn't fit in children
        // Keep them here for now
        this.points = unfitList;

        // Try insert new element into children
        if (this.q0.addEntity(entity)) {
          return true;
        }
        if (this.q1.addEntity(entity)) {
          return true;
        }
        if (this.q2.addEntity(entity)) {
          return true;
        }
        if (this.q3.addEntity(entity)) {
          return true;
        }
        // New element couldn't fit in children
        this.points.push(entity);

        //We could't fit anything in sub nodes so delete them
        if (insertionCounter == 0) {
          this.isLeaf = true; // We are now a leaf node again

          this.q0 = null;
          this.q1 = null;
          this.q2 = null;
          this.q3 = null;
        }

        return true;
      }
    } else { // This node has children nodes so try insert new element into them
      //console.log("TEST");
      if (this.q0.addEntity(entity)) {
        return true;
      }
      if (this.q1.addEntity(entity)) {
        return true;
      }
      if (this.q2.addEntity(entity)) {
        return true;
      }
      if (this.q3.addEntity(entity)) {
        return true;
      }
      // The new element couldn't fit so keep them in this node
      this.points.push(entity);
      return true;
    }
  }

  //Draws the quadrants of the quadtree
  drawQuads (cameraPosition) {
      ctx.save();
      ctx.translate(cameraPosition.x,cameraPosition.y);
      if (this.selected) {
        ctx.strokeStyle = "rgb(255,0,0)";
        ctx.strokeRect(this.x, this.y,this.w,this.w);
      } else {
        ctx.strokeStyle = "rgb(0,0,0)";
        ctx.strokeRect(this.x, this.y,this.w,this.w);
      }
      ctx.restore();
      

      if (this.q0 != null){
        this.q0.drawQuads(cameraPosition);
      }
      if (this.q1 != null ){
        this.q1.drawQuads(cameraPosition);
      }
      if (this.q2 != null){
        this.q2.drawQuads(cameraPosition);
      }
      if (this.q3 != null){
        this.q3.drawQuads(cameraPosition);
      }

  }

  //Draws all points within the subtree
  drawLeaves (){
    //if (this.q0 == null && this.q1 == null && this.q2 == null && this.q3 == null) {
    for (var i = 0; i < this.points.length; i++) {
        var p = this.points[i];
        //ctx.strokeRect(p.x, p.y,80,80);
        p.draw();
    }
    //}

    if (this.q0 != null) {
      this.q0.drawLeaves();
    }
    if (this.q1 != null) {
      this.q1.drawLeaves();
    }
    if (this.q2 != null) {
      this.q2.drawLeaves();
    }
    if (this.q3 != null) {
      this.q3.drawLeaves();
    }
  }

  deselectLeaves (entity){
    this.selected = false;
    if (this.q0 != null) {
      this.q0.deselectLeaves();
    }
    if (this.q1 != null) {
      this.q1.deselectLeaves();
    }
    if (this.q2 != null) {
      this.q2.deselectLeaves();
    }
    if (this.q3 != null) {
      this.q3.deselectLeaves();
    }
  }

  selectLeaves (entity){
    
    if(entity.pos.x + entity.width < this.x || entity.pos.x > this.x + this.w) return false;
    if(entity.pos.y + entity.height < this.y || entity.pos.y > this.y + this.w) return false;
    //console.log("selected");
    this.selected = true;

    if (this.q0 != null) {
      this.q0.selectLeaves(entity);
    }
    if (this.q1 != null) {
      this.q1.selectLeaves(entity);
    }
    if (this.q2 != null) {
      this.q2.selectLeaves(entity);
    }
    if (this.q3 != null) {
      this.q3.selectLeaves(entity);
    }

  }

  selectBoxes (entity){

    var result = new Array();
    
    if(entity.pos.x + entity.width < this.x || entity.pos.x > this.x + this.w) return result;
    if(entity.pos.y + entity.height < this.y || entity.pos.y > this.y + this.w) return result;

    if (this.points.length > 0) {
      result = result.concat(this.points);
    }

    if (this.q0 != null) {
      result = result.concat(this.q0.selectBoxes(entity));
      //result = result.concat(this.q0.points);
    }
    if (this.q1 != null) {
      result = result.concat(this.q1.selectBoxes(entity));
    }
    if (this.q2 != null) {
      result = result.concat(this.q2.selectBoxes(entity));
    }
    if (this.q3 != null) {
      result = result.concat(this.q3.selectBoxes(entity));
    }

    return result;
  }

  selectPoints (entity){
    //console.log(entity.pos.x);

    var result = new Array();
    
    if(entity.x < this.x || entity.x > this.x + this.w) return result;
    if(entity.y < this.y || entity.y > this.y + this.w) return result;

    if (this.points.length > 0) {
      result = result.concat(this.points);
    }

    if (this.q0 != null) {
      result = result.concat(this.q0.selectPoints(entity));
    }
    if (this.q1 != null) {
      result = result.concat(this.q1.selectPoints(entity));
    }
    if (this.q2 != null) {
      result = result.concat(this.q2.selectPoints(entity));
    }
    if (this.q3 != null) {
      result = result.concat(this.q3.selectPoints(entity));
    }

    return result;
  }

  countElements (){
    var count = this.points.length;

    if (this.q0 != null) {
      count += this.q0.countElements();
    }
    if (this.q1 != null) {
      count += this.q1.countElements();
    }
    if (this.q2 != null) {
      count += this.q2.countElements();
    }
    if (this.q3 != null) {
      count += this.q3.countElements();
    }
    return count;
  }

}
