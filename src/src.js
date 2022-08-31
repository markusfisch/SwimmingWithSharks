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
	centerY

function say(who, what) {
	if (!who.bubble) {
		const e = document.createElement("div")
		e.className = "B"
		document.body.appendChild(e)
		who.bubble = e
	}
	const b = who.bubble
	// Set this for getBoundingClientRect() to work as expected.
	b.style.left = "0px"
	b.style.top = "0px"
	b.style.display = "block"
	b.innerHTML = what
	const rw = who.getBoundingClientRect(),
		rb = b.getBoundingClientRect()
	b.style.left = (rw.x || rw.left) + "px"
	b.style.top = ((rw.y || rw.top) - rb.height -
		parseFloat(getComputedStyle(b).fontSize) * 1.5
	) + "px"
}

function setup(name) {
	state.scene = scenes[name]
	state.scene.setup()
}

function show(list) {
	for (let key in props) {
		const p = props[key]
		p.style.visibility = "hidden"
		if (p.bubble) {
			p.bubble.style.display = "none"
		}
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
	stage = document.getElementById("Stage");
	[...stage.getElementsByTagName("g")].forEach(e => props[e.id] = e)
	window.onresize = resize
	resize()
}
