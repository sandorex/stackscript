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

function maskAll(value, mask) {
	return (value & mask) == mask;
}

function maskAny(value, mask) {
	return (value & mask) > 0;
}

function maskNone(value, mask) {
	return !maskAny(value, mask);
}

function draw_shape(shape, x, y, w, h, inc = 0, d = false) {
	function mask(flag) {
		if (maskAll(shape, flag))
			return inc;

		return 0;
	}

	if (maskAll(shape, X)) {
		if (maskAll(shape, TOP | BOTTOM | LEFT | RIGHT)) {
			line(
				x - w / 2,
				y,
				x + w / 2,
				y
			);
			line(
				x,
				y - h / 2,
				x,
				y + h / 2
			);
		}
	} else {
		if (maskAll(shape, TOP)) {
			line(
				x - w / 2 - mask(LEFT),
				y - h / 2 - inc,
				x + w / 2 + mask(RIGHT),
				y - h / 2 - inc
			);
		}

		if (maskAll(shape, BOTTOM))
			line(
				x - w / 2 - mask(LEFT),
				y + h / 2 + inc,
				x + w / 2 + mask(RIGHT),
				y + h / 2 + inc
			);

		if (maskAll(shape, LEFT))
			line(
				x - w / 2 - inc,
				y - h / 2 - mask(TOP),
				x - w / 2 - inc,
				y + h / 2 + mask(BOTTOM)
			);

		if (maskAll(shape, RIGHT))
			line(
				x + w / 2 + inc,
				y - h / 2 - mask(TOP),
				x + w / 2 + inc,
				y + h / 2 + mask(BOTTOM)
			);
	}
}

// TODO use this
class Shape {
	constructor(shape) {
		this.shape = shape;
	}

	has(flags) {
		return (this.shape & flags) == flags;
	}

	any(flags) {
		retrun(this.shape & flags) > 0;
	}

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

function drawv9000(shapes, x, y, bounds, inc) {
	shapes.forEach(shape => {
		function mNot(flag) {
			if (!maskAll(shape, flag))
				return inc;

			return 0;
		}

		if (maskAll(shape, X)) {
			// TODO scale width a bit so it bit more proprtional to the height
			const offsetX = inc * 2 + (0.1 * bounds.right);
			const lX = x + bounds.right + offsetX / 2;

			if (maskAll(shape, TOP | BOTTOM | LEFT | RIGHT)) {
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
			} else if (maskAll(shape, TOP)) {
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

			}

			bounds.right += offsetX + inc;
		} else {
			// copy the bound so they are not modified while drawing.. damn you js
			const oldBounds = JSON.parse(JSON.stringify(bounds));

			if (maskAll(shape, TOP)) {
				line(
					x - oldBounds.left + mNot(LEFT),
					y - oldBounds.up,
					x + oldBounds.right - mNot(RIGHT),
					y - oldBounds.up
				);

				bounds.up += inc;
			}

			if (maskAll(shape, BOTTOM)) {
				line(
					x - oldBounds.left + mNot(LEFT),
					y + oldBounds.down,
					x + oldBounds.right - mNot(RIGHT),
					y + oldBounds.down
				);

				bounds.down += inc;
			}

			if (maskAll(shape, LEFT)) {
				line(
					x - oldBounds.left,
					y - oldBounds.up + mNot(TOP),
					x - oldBounds.left,
					y + oldBounds.down - mNot(BOTTOM)
				);

				bounds.left += inc;
			}

			if (maskAll(shape, RIGHT)) {
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

// function write_string(str, x, y, w, h) {
// 	draw_shape(~(X), x, y,)
// }

function setup() {
	createCanvas(800, 800);
	strokeCap(PROJECT);
}

function draw() {
	background(0);
	stroke(255, 255, 255);
	strokeWeight(4);

	drawv9000([BOX, CROSS, BOX & ~(LEFT), BOX & ~(RIGHT), CROSS, X | TOP, BOX], width / 2, height / 2, new Bounds(25, 25, 25, 25), 15);
	// SHAPE_L.draw(width / 2, height / 2, 50, 50);
	// draw_shape(~(X), width / 2, height / 2, 50, 50);

	// draw_shape(BOTTOM | TOP, width / 2, height / 2, 50, 50, 15);
	// draw_shape(LEFT | RIGHT | TOP | BOTTOM, width / 2, height / 2, 50, 50 + 30, 15);
	// draw_shape(0xff, width / 2 + 50 + 30, height / 2, 50, 50);
	// draw_shape(LEFT | RIGHT | TOP | BOTTOM, width / 2, height / 2, 50 + 50 + 30, 50 + 30 * 2, 15);

	stroke(255, 0, 0);
	point(width / 2, height / 2);
}
