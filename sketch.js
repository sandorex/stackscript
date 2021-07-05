'use strict';

const NULL = 0;
const X = (1 << 0);
const TOP = (1 << 1);
const BOTTOM = (1 << 2);
const LEFT = (1 << 3);
const RIGHT = (1 << 4);
const DASH = (1 << 5);
const DASHES = DASH | (1 << 6);

const BOX = TOP | BOTTOM | LEFT | RIGHT;
const CROSS = X | BOX;

// TODO stop formatting this!!
const CHARACTERS = {
	'Y': BOTTOM | RIGHT | DASH, 'W': BOX & ~(TOP) | DASH, 'Z': BOTTOM | LEFT | DASH,
	'J': BOTTOM | RIGHT, 'U': BOX & ~(TOP), 'L': BOTTOM | LEFT,

	'S': BOX & ~(LEFT) | DASH, 'B': BOX | DASH, 'E': BOX & ~(RIGHT) | DASH,
	'D': BOX & ~(LEFT), 'O': BOX, 'C': BOX & ~(RIGHT),

	'Q': TOP | RIGHT | DASH, 'M': BOX & ~(BOTTOM) | DASH, 'F': TOP | LEFT | DASH,
	'G': TOP | RIGHT, 'P': BOX & ~(BOTTOM), 'R': TOP | LEFT,

	// the X thingy
	'V': X | TOP, '.': X | TOP | DASH,
	// '?': X | LEFT, // also beg"
	'K': X | RIGHT, // also end"
	'A': X | BOTTOM, 'N': X | BOTTOM | DASH,

	// special cases
	'T': CROSS,
	'H': BOTTOM,
	'I': RIGHT,
}

class Shape {
	constructor(shape) {
		this.shape = shape;
	}

	// all flags are present
	has(flags) {
		return (this.shape & flags) == flags;
	}

	// all flags are not present
	not(flags) {
		return !this.has(flags);
	}

	// any of the flags is present
	any(flags) {
		return (this.shape & flags) != 0;
	}

	// none of the flags are present
	none(flags) {
		return !this.any(flags);
	}
}

class Bounds {
	constructor(up, down, left, right) {
		this.up = up;
		this.down = down;
		this.left = left;
		this.right = right;
	}

	static from2d(width, height) {
		return new Bounds(width / 2, width / 2, height / 2, height / 2);
	}
}

function drawShape(shapes, x, y, bounds, inc) {
	shapes.forEach((shapeo, index) => {
		var shape = new Shape(shapeo);

		function mNot(flag) {
			if (shape.not(flag))
				return inc;

			return 0;
		}

		// TODO all Xs are offset if they are the first character
		if (shape.has(X)) {
			const scale = 0.1; // proportional scale width to height so it doesn't look awful
			const offsetX = inc * 2 + (scale * bounds.right);
			const lX = x + bounds.right + offsetX / 2;

			if (shape.has(TOP | BOTTOM | LEFT | RIGHT)) {
				// +
				line(
					lX - offsetX / 2,
					y,
					lX + offsetX / 2,
					y
				);
				line(
					lX,
					y - bounds.up + inc,
					lX,
					y + bounds.down - inc
				);
			} else if (shape.has(TOP)) {
				// V
				line(
					lX - offsetX / 2,
					y - bounds.up + inc,
					lX,
					y + bounds.down - inc
				);
				line(
					lX + offsetX / 2,
					y - bounds.up + inc,
					lX,
					y + bounds.down - inc
				);
			} else if (shape.has(BOTTOM)) {
				// A
				line(
					lX - offsetX / 2,
					y + bounds.down - inc,
					lX,
					y - bounds.down + inc
				);
				line(
					lX + offsetX / 2,
					y + bounds.down - inc,
					lX,
					y - bounds.down + inc
				);
			} else if (shape.has(LEFT)) {
				// >
				line(
					lX - offsetX / 2,
					y - bounds.up + inc,
					lX + offsetX / 2,
					y
				);
				line(
					lX - offsetX / 2,
					y + bounds.down - inc,
					lX + offsetX / 2,
					y
				);
			} else if (shape.has(RIGHT)) {
				// <
				line(
					lX + offsetX / 2,
					y - bounds.up + inc,
					lX - offsetX / 2,
					y
				);
				line(
					lX + offsetX / 2,
					y + bounds.down - inc,
					lX - offsetX / 2,
					y
				);
			} else {
				// X
				line(
					lX + offsetX / 2,
					y - bounds.up + inc,
					lX - offsetX / 2,
					y + bounds.down - inc
				);
				line(
					lX - offsetX / 2,
					y - bounds.up + inc,
					lX + offsetX / 2,
					y + bounds.down - inc
				);
			}

			bounds.right += offsetX + inc;
		} else {
			// copy the bounds so they are not modified while drawing.. damn you js
			const oldBounds = JSON.parse(JSON.stringify(bounds));

			if (shape.has(TOP)) {
				line(
					x - oldBounds.left + mNot(LEFT),
					y - oldBounds.up,
					x + oldBounds.right - mNot(RIGHT),
					y - oldBounds.up
				);

				bounds.up += inc;
			}

			if (shape.has(BOTTOM)) {
				line(
					x - oldBounds.left + mNot(LEFT),
					y + oldBounds.down,
					x + oldBounds.right - mNot(RIGHT),
					y + oldBounds.down
				);

				bounds.down += inc;
			}

			if (shape.has(LEFT)) {
				line(
					x - oldBounds.left,
					y - oldBounds.up + mNot(TOP),
					x - oldBounds.left,
					y + oldBounds.down - mNot(BOTTOM)
				);

				bounds.left += inc;
			}

			if (shape.has(RIGHT)) {
				line(
					x + oldBounds.right,
					y - oldBounds.up + mNot(TOP),
					x + oldBounds.right,
					y + oldBounds.down - mNot(BOTTOM)
				);

				bounds.right += inc;
			}

		}
	});
}

var STR = 'Hello';

function setup() {
	createCanvas(1000, 1000);
	strokeCap(PROJECT);
}

function draw() {
	background(0);
	stroke(255, 255, 255);
	strokeWeight(4);
	// drawv9000([BOX, CHARACTERS['a'], BOX & ~(LEFT), BOX & ~(RIGHT), CROSS, X | TOP, X | BOTTOM, X | LEFT, X | RIGHT, X, BOX], width / 2 - 250, height / 2, new Bounds(25, 25, 25, 25), 15);

	var shapes = [];

	// drawShape([CHARACTERS['E']], width / 3, height / 2, new Bounds(25, 25, 25, 25), 15);

	for (let i = 0; i < STR.length; i++) {
		const ch = STR.charAt(i).toUpperCase();
		try {
			const shapeFound = CHARACTERS[ch];
			shapes.push(shapeFound);
		} catch (error) {
			console.log('Error could not find the character "' + ch + '" in the database:\n' + error);
			break;
		}
	}
	// console.log(shapes);
	drawShape(shapes, width / 3, height / 2, new Bounds(25, 25, 25, 25), 15);
	stroke(255, 0, 0);
	point(width / 2, height / 2);
}

