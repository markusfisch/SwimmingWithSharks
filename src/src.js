"use strict"

const scenes = {
		Stern: {
			setup: function() {
				props.Boat.style.transform = centerScale(230, 24)
				props.Dave.style.transform = centerScale()
				props.Sheryl.style.transform = centerScale(-50)
				props.Googles.style.transform = centerScale(-49, -31, .3)
				show([props.Boat, props.Stern,
					props.Dave,
					props.Sheryl, props.Watch, props.Googles])
				say(props.Dave, "Hello! Hello!")
			}
		},
		Inside: {
			setup: function() {
				props.Boat.style.transform = centerScale(-12, -5)
				props.Sheryl.style.transform = centerScale(-110)
				props.Googles.style.transform = centerScale(-125, 55, .3) +
					"rotateZ(-80deg)"
				props.Dave.style.transform = centerScale(-75, 10)
				props.Skipper.style.transform = centerScale(-18, 20)
				props.Amanda.style.transform = centerScale(45)
				props.Bruce.style.transform = centerScale(85, 5)
				show([props.Boat, props.Inside,
					props.Dave,
					props.Sheryl, props.Watch, props.Googles,
					props.Amanda, props.Bruce,
					props.Skipper])
				say(props.Dave, "What happened?")
			}
		},
		Bow: {
			setup: function() {
				props.Boat.style.transform = centerScale(-230, 64)
				props.Dave.style.transform = centerScale(-30, -2)
				show([props.Boat, props.Bow,
					props.Dave])
				say(props.Dave, "I'm the king of the world!")
			}
		},
		Steer: {
			setup: function() {
				props.Boat.style.transform = centerScale(20, 124)
				props.Dave.style.transform = centerScale()
				props.Sheryl.style.transform = centerScale(-75)
				props.Googles.style.transform = centerScale(-90, 55, .3) +
					"rotateZ(-80deg)"
				show([props.Boat, props.Steer,
					props.Dave,
					props.Sheryl, props.Watch, props.Googles])
				say(props.Dave, "Who's your captain?")
			}
		},
		Storage: {
			setup: function() {
				props.Boat.style.transform = centerScale(-200, -20)
				show([props.Boat, props.Storage])
			}
		},
		Underwater: {
			setup: function() {
				props.Boat.style.transform = centerScale(250, -250)
				props.Dave.style.transform = centerScale()
				props.Shark.style.transform = centerScale(100, -50)
				props.Key.style.transform = centerScale(-40, 130, .5)
				show([props.Boat, props.Underwater,
					props.Dave,
					props.Shark,
					props.Key])
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

function go(name) {
	state.scene = scenes[name]
	state.scene.setup()
}

function centerScale(x, y, ratio) {
	ratio = ratio || 1
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
	;["SternInside", "SternSteer", "SternBow", "SternUnderwater",
		"SteerStern",
		"BowStern",
		"InsideStern", "InsideStorage",
		"StorageInside",
		"UnderwaterStern"
	].forEach(id => document.getElementById(id).onclick = function() {
		go(id.replace(/^[A-Z][a-z]*/, ""))
	})
	window.onresize = resize
	resize()
}
