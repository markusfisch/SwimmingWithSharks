"use strict"

const scenes = {
		Stern: {
			setup: function() {
				props.Boat.style.transform = centerScale(1, 230, 22)
				props.Dave.style.transform = centerScale(1)
				props.Sheryl.style.transform = centerScale(1, -50)
				show([props.Boat, props.Stern, props.Dave, props.Sheryl])
				document.getElementById("GoInside").onclick = function() {
					setup("Inside")
				}
				document.getElementById("GoSteer").onclick = function() {
					setup("Steer")
				}
				document.getElementById("GoUnderwater").onclick = function() {
					setup("Underwater")
				}
				say(props.Dave, "Hello! Hello!")
			}
		},
		Inside: {
			setup: function() {
				props.Boat.style.transform = centerScale(1, -12, -5)
				props.Sheryl.style.transform = centerScale(1, -110)
				props.Dave.style.transform = centerScale(1, -75, 10)
				props.Skipper.style.transform = centerScale(1, -18, 20)
				props.Amanda.style.transform = centerScale(1, 45)
				props.Bruce.style.transform = centerScale(1, 85, 5)
				show([props.Boat, props.Inside,
					props.Dave, props.Sheryl, props.Amanda, props.Bruce,
					props.Skipper])
				say(props.Dave, "What happened?")
			}
		},
		Bow: {
			setup: function() {
				props.Boat.style.transform = centerScale(1, -230, 62)
				props.Dave.style.transform = centerScale(1)
				show([props.Boat, props.Bow, props.Dave])
				say(props.Dave, "I'm the king of the world!")
			}
		},
		Steer: {
			setup: function() {
				props.Boat.style.transform = centerScale(1, 20, 122)
				props.Dave.style.transform = centerScale(1)
				show([props.Boat, props.Steer, props.Dave])
				say(props.Dave, "Who's your captain?")
			}
		},
		Storage: {
			setup: function() {
				props.Boat.style.transform = centerScale(1, -200, -20)
				show([props.Boat, props.Storage])
			}
		},
		Underwater: {
			setup: function() {
				props.Boat.style.transform = centerScale(1, 250, -250)
				props.Dave.style.transform = centerScale(1)
				show([props.Boat, props.Dave])
				say(props.Dave, "Under the sea…")
			}
		},
	},
	props = {},
	state = {
		inventory: [],
		scene: scenes.Stern
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
