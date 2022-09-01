"use strict"

const setBackground = (color) => document.documentElement.style.background = color,
	scenes = {
		opening: {
			setup: function() {
				setBackground("#d9b069")
				props.Test.style.transform = centerScale(1)
				show([props.Test])
				say(props.Test, "Hello!")
			}
		},
	},
	props = {},
	state = {
		inventory: [],
		scene: scenes.opening
	}

let stage,
	stageWidth,
	stageHeight,
	centerX,
	centerY,
	bubble

function say(who, what) {
	// Set this for getBoundingClientRect() to work as expected.
	bubble.style.left = "0px"
	bubble.style.top = "0px"
	bubble.style.display = "block"
	bubble.innerHTML = what
	const rw = who.getBoundingClientRect(),
		rb = bubble.getBoundingClientRect()
	bubble.style.left = (rw.x || rw.left) + "px"
	bubble.style.top = ((rw.y || rw.top) - rb.height -
		parseFloat(getComputedStyle(bubble).fontSize) * 1.5
	) + "px"
}

function setup(name) {
	state.scene = scenes[name]
	state.scene.setup()
}

function show(list) {
	bubble.style.display = "none"
	for (let key in props) {
		props[key].style.visibility = "hidden"
	}
	list.forEach((o) => o.style.visibility = "visible")
}

function centerScale(ratio, x, y) {
	const f = 50 * ratio
	return `translate(${
		x || centerX - f}px, ${
		y || centerY - f}px) scale(${ratio})`
}

function resize() {
	const windowWidth = window.innerWidth,
		windowHeight = window.innerHeight,
		min = Math.min(windowWidth, windowHeight),
		ratio = min / 300

	stageWidth = windowWidth / ratio
	stageHeight = windowHeight / ratio
	centerX = stageWidth * .5
	centerY = stageHeight * .5

	const style = stage.style
	style.width = stageWidth + "px"
	style.height = stageHeight + "px"
	style.transformOrigin = "top left"
	style.transform = `scale(${ratio})`
	style.display = "block"

	state.scene.setup()
}

window.onload = function() {
	stage = document.getElementById("S");
	bubble = document.getElementById("B");
	[...stage.getElementsByTagName("g")].forEach(e => props[e.id] = e)
	window.onresize = resize
	resize()
}
