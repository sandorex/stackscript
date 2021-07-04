'use strict';

const NULL = 0;
const X = (1 << 0);
const TOP = (1 << 1);
const BOTTOM = (1 << 2);
const LEFT = (1 << 3);
const RIGHT = (1 << 4);
const BOX = TOP | BOTTOM | LEFT | RIGHT;
const DASH = (1 << 5);
const DASHES = DASH | (1 << 6);

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

function setup() {
	createCanvas(800, 800);
	strokeCap(PROJECT);
}

function draw() {
	background(0);
	stroke(255, 255, 255);
	strokeWeight(3);
	// SHAPE_L.draw(width / 2, height / 2, 50, 50);
	draw_shape(~(X), width / 2, height / 2, 50, 50);

	draw_shape(BOTTOM | TOP, width / 2, height / 2, 50, 50, 15);
	// draw_shape(X | LEFT | RIGHT | TOP | BOTTOM, width / 2, height / 2, 50, 50 + 30, 15);

	stroke(255, 0, 0);
	point(width / 2, height / 2);
}
