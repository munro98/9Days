"use strict";
class QuadTree {

	constructor(x, y, w, depth) {
		this.x = x;
		this.y = y;
		this.w = w;

		this.depth = depth;

		this.q = new Array(4);
		this.isLeaf = false;
		this.points = new Array();
		this.selected = false;
	}

	addEntity(entity) {
		//console.log("e.x" + entity.pos.x);

		// The entity isn't completely contained in our box
		if (entity.pos.x < this.x || entity.pos.x + entity.width > this.x + this.w || entity.pos.y < this.y || entity.pos.y + entity.height > this.y + this.w) {
			//console.log("not fit ")
			return false;
		}

		if (this.points.length == 0 && this.isLeaf == false && this.q[0] == null) { // This node is empty so make it a leaf
			this.points.push(entity);
			this.isLeaf = true;

			return true;

		} else if (this.isLeaf) { // we are a leaf so check if need subdivide

			// If we can subdivide then subdivide
			//                   MaxElements      MaxDepth    
			if (this.points.length >= 1 && this.depth < 32) { //

				this.q[0] = new QuadTree(this.x, this.y, this.w / 2, this.depth + 1);
				this.q[1] = new QuadTree(this.x + this.w / 2, this.y, this.w / 2, this.depth + 1);
				this.q[2] = new QuadTree(this.x, this.y + this.w / 2, this.w / 2, this.depth + 1);
				this.q[3] = new QuadTree(this.x + this.w / 2, this.y + this.w / 2, this.w / 2, this.depth + 1);

				this.isLeaf = false; // Quadrant 0 is no longer a leaf node

				// try stuff out elements into our children if they can fit
				var insertionCounter = 0;
				var unfitList = new Array();
				while (this.points.length > 0) {
					var temp = this.points.pop();
					if (!this.q[0].addEntity(temp)) {

						if (!this.q[1].addEntity(temp)) {

							if (!this.q[2].addEntity(temp)) {

								if (!this.q[3].addEntity(temp)) {

									unfitList.push(temp);
								} else {insertionCounter++;}
							} else {insertionCounter++;}
						} else {insertionCounter++;}
					} else {insertionCounter++;}
				}

				// These elements couldn't fit in children
				// Keep them here for now
				this.points = unfitList;

				// Try insert new element into children
				for (let i = 0; i < 4; i++) {
					if (this.q[i].addEntity(entity)) {
						return true;
					}
				}
				// New element couldn't fit in children
				this.points.push(entity);

				//We could't fit anything in sub nodes so delete them
				if (insertionCounter == 0) {
					this.isLeaf = true; // We are now a leaf node again
					
					for (let i = 0; i < 4; i++) {
						this.q[i] = null;
					}
				}

				return true;
			}
		} else { // This node has children nodes so try insert new element into them
			for (let i = 0; i < 4; i++) {
				if (this.q[i].addEntity(entity)) {
					return true;
				}
			}
			// The new element couldn't fit so keep them in this node
			this.points.push(entity);
			return true;
		}
	}

	//Draws the quadrants of the quadtree
	drawQuads(cameraPosition) {
		ctx.save();
		ctx.translate(cameraPosition.x, cameraPosition.y);
		if (this.selected) {
			ctx.strokeStyle = "rgb(255,0,0)";
			ctx.strokeRect(this.x, this.y, this.w, this.w);
		} else {
			ctx.strokeStyle = "rgb(0,0,0)";
			ctx.strokeRect(this.x, this.y, this.w, this.w);
		}
		ctx.restore();

		for (let i = 0; i < 4; i++) {
			if (this.q[i] != null) {
				this.q[i].drawQuads(cameraPosition);
			}
		}
	}

	//Draws all points within the subtree
	drawLeaves() {
		for (var i = 0; i < this.points.length; i++) {
			var p = this.points[i];
			//ctx.strokeRect(p.x, p.y,80,80);
			p.draw();
		}

		for (let i = 0; i < 4; i++) {
			if (this.q[i] != null) {
				this.q[i].drawLeaves();
			}
		}
	}

	deselectLeaves() {
		this.selected = false;

		for (let i = 0; i < 4; i++) {
			if (this.q[i] != null) {
				this.q[i].deselectLeaves();
			}
		}
	}

	selectLeaves(entity) {
		if (entity.pos.x + entity.width < this.x || entity.pos.x > this.x + this.w) return false;
		if (entity.pos.y + entity.height < this.y || entity.pos.y > this.y + this.w) return false;

		this.selected = true;

		for (let i = 0; i < 4; i++) {
			if (this.q[i] != null) {
				this.q[i].selectLeaves(entity);
			}
		}
	}

	selectBoxes(entity) {
		var result = new Array();

		if (entity.pos.x + entity.width < this.x || entity.pos.x > this.x + this.w) return result;
		if (entity.pos.y + entity.height < this.y || entity.pos.y > this.y + this.w) return result;

		if (this.points.length > 0) {
			result = result.concat(this.points);
		}

		for (let i = 0; i < 4; i++) {
			if (this.q[i] != null) {
				result = result.concat(this.q[i].selectBoxes(entity));
			}
		}
		return result;
	}

	selectPoints(entity) {

		var result = new Array();

		if (entity.x < this.x || entity.x > this.x + this.w) return result;
		if (entity.y < this.y || entity.y > this.y + this.w) return result;

		if (this.points.length > 0) {
			result = result.concat(this.points);
		}

		for (let i = 0; i < 4; i++) {
			if (this.q[i] != null) {
				result = result.concat(this.q[i].selectPoints(entity));
			}
		}

		return result;
	}

	countElements() {
		var count = this.points.length;

		for (let i = 0; i < 4; i++) {
			if (this.q[i] != null) {
				count += this.q[i].countElements();
			}
		}
		return count;
	}

}

// if running inside node
if (typeof exports !== "undefined")
	exports.QuadTree = QuadTree;