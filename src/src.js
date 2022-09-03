"use strict"

const setBackground = (color) => document.documentElement.style.background = color,
	scenes = {
		opening: {
			setup: function() {
				setBackground("#d9b069")
				props.Test.style.transform = centerScale(1, 50, 50)
				show([props.Test])
				//say(props.Test, "Hello!")
				say(props.Test, "Hello! Hello!")
				//say(props.Test, "Hello! Hello!<br/>I don't know why you say<br/>Good Bye<br/>I say Hello!")
				//say(props.Test, "Hello! Hello!<br/>I don't know why you say Good Bye, I say Hello! Hellooooo! You say yes, I say no, oh nooo. You say Good Bye, I say Hello!")
			}
		},
	},
	props = {},
	state = {
		inventory: [],
		scene: scenes.opening
	}

let centerX,
	centerY,
	bubble

function say(who, what) {
	// Set this for getBoundingClientRect() to work as expected.
	bubble.style.left = "0px"
	bubble.style.top = "0px"
	bubble.style.display = "block"
	bubble.m.innerHTML = what
	const whoRect = who.getBoundingClientRect(),
		bubbleRect = bubble.getBoundingClientRect(),
		margin = parseFloat(getComputedStyle(bubble).fontSize),
		whoRectHalfWidth = whoRect.width / 2,
		ww = window.innerWidth
	let x = whoRect.x || whoRect.left,
		cx = x + whoRectHalfWidth
	if (x + bubbleRect.width >= ww) {
		x = Math.min(ww - bubbleRect.width - margin,
			Math.max(margin, x + whoRectHalfWidth - bubbleRect.width / 2))
	}
	bubble.style.left = x + "px"
	bubble.style.top = ((whoRect.y || whoRect.top) -
		bubbleRect.height - margin * 1.5) + "px"
	bubble.p.style.left = (cx - x) + "px"
}

function clear() {
	bubble.style.display = "none"
}

function show(list) {
	clear()
	for (let key in props) {
		props[key].style.visibility = "hidden"
	}
	list.forEach((o) => o.style.visibility = "visible")
}

function setup(name) {
	state.scene = scenes[name]
	state.scene.setup()
}

function centerScale(ratio, x, y) {
	const f = 50 * ratio
	return `translate(${
		centerX - f + (x || 0)}px, ${
		centerY - f + (y || 0)}px) scale(${ratio})`
}

function resize() {
	const windowWidth = window.innerWidth,
		windowHeight = window.innerHeight,
		min = Math.min(windowWidth, windowHeight),
		ratio = min / 300,
		stageWidth = windowWidth / ratio,
		stageHeight = windowHeight / ratio

	centerX = stageWidth * .5
	centerY = stageHeight * .5

	const style = document.getElementById("S").style
	style.width = stageWidth + "px"
	style.height = stageHeight + "px"
	style.transformOrigin = "top left"
	style.transform = `scale(${ratio})`
	style.display = "block"

	state.scene.setup()
}

window.onload = function() {
	bubble = document.getElementById("B")
	bubble.m = document.getElementById("BM")
	bubble.p = document.getElementById("BP")
	;[...document.getElementsByTagName("g")].forEach(e => props[e.id] = e)
	window.onresize = resize
	resize()
}
