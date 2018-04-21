"use strict";
class Vec2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;

	}

	add(v) {
		return new Vec2(this.x + v.x, this.y + v.y);
	}

	sub(v) {
		return new Vec2(this.x - v.x, this.y - v.y);
	}

	dot(v) {
		return (this.x * v.x + this.y * v.y);
	}

	mul(f) {
		return new Vec2(this.x * f, this.y * f);
	}

	mag() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	len() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	lenSq() {
		return this.x * this.x + this.y * this.y;
	}

	perp() {
		return new Vec2(-this.y, this.x);
	}

	lerp(v, f) {
		//return a + f * (b - a);
		var x = this.x * f + v.x * (1.0 - f);
		var y = this.y * f + v.y * (1.0 - f);
		return new Vec2(x, y);
	}

	//dist() {

	//}

	copy() {
		return new Vec2(this.x, this.y);
	}

	normalized() {
		var mag = this.mag();
		if (mag == 0)
			return new Vec2(0, 0);
		return new Vec2(this.x / mag, this.y / mag);
	}

	normalize() {
		var mag = this.mag();
		if (mag == 0) {
			this.x = 0.0;
			this.y = 0.0;
		}
		this.x /= mag;
		this.y /= mag;
	}
}

// if running inside node
if (typeof exports !== "undefined")
	exports.Vec2 = Vec2;