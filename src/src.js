"use strict"

const scenes = {
		Stern: {
			setup: function() {
				props.Boat.style.transform = centerScale(230, 24)
				props.Dave.style.transform = centerScale()
				props.Sheryl.style.transform = centerScale(-50)
				props.Googles.style.transform = centerScale(-65, 55, .3) +
					"rotateZ(-80deg)"
				show([props.Boat, props.Stern,
					props.Dave,
					props.Sheryl, props.Watch, props.Googles
				])
				props.Googles.onclick = function() {
					sayLater(props.Dave, "Diving googles!")
				}
				props.Watch.onclick = function() {
					sayLater(props.Dave, "That's a sharp looking diving watch!")
				}
				props.Sheryl.onclick = function() {
					sayLater([props.Dave, "Hi, Sheryl, you swimming?",
						props.Sheryl, "None of your business, Dave.",
					])
				}
				if (!state.greet) {
					state.greet = 1
					say(props.Dave, "Hello! Hello!")
				}
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
					props.Skipper
				])
				props.Sheryl.onclick = function() {
					sayLater([props.Dave, "What do you think, Sheryl?",
						props.Sheryl, "I think it was a heart attack, Dave.",
					])
				}
				props.Amanda.onclick = function() {
					sayLater([props.Dave, "What do you think, Amanda?",
						props.Amanda, "It may have something to do with the Triangle…",
						props.Dave, "What Triangle?",
						props.Amanda, "We're in the middle of the Bermuda Triangle!",
						props.Dave, "And?",
						props.Amanda, "There are mysterious forces…",
					])
				}
				props.Bruce.onclick = function() {
					sayLater([props.Dave, "Did you see anything, Bruce?",
						props.Bruce, "I saw how he was looking at my wife.",
						props.Dave, "Yeah, and this is why you killed him?",
						props.Bruce, "I didn't kill the slacker. Must have been ill or something.",
						props.Amanda, "Bermuda!",
					])
				}
				props.Skipper.onclick = function() {
					sayLater([props.Dave, "He looks unharmed. Apart from that little scratch on his arm.",
						props.Bruce, "Death by scratch",
					])
				}
				if (!state.discover) {
					state.discover = 1
					say([props.Dave, "What happened?",
						props.Amanda, "Oh my god, he just collapsed!",
						props.Bruce, "Maybe it's the salmon mousse?",
						props.Amanda, "Don't be ridiculous! We all ate the salmon mousse!",
						props.Bruce, "Maybe he was allergic?",
						props.Amanda, "But he served it to us!",
						props.Sheryl, "Maybe it was a heart attack then?",
						props.Dave, "I don't know. I'm not a doctor. Let's see…",
					])
				}
			}
		},
		Bow: {
			setup: function() {
				props.Boat.style.transform = centerScale(-230, 64)
				props.Dave.style.transform = centerScale(-30, -2)
				show([props.Boat, props.Bow,
					props.Dave
				])
				if (!state.bow) {
					state.bow = 1
					say(props.Dave, "I'm the king of the world!")
				}
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
					props.Sheryl, props.Watch, props.Googles
				])
				say([props.Dave, "Now who's your captain?",
					props.Sheryl, "Not you."
				])
			}
		},
		Storage: {
			setup: function() {
				props.Boat.style.transform = centerScale(-200, -20)
				props.DaveLeaning.style.transform = centerScale(-43, 10)
				show([props.Boat, props.Storage,
					props.DaveLeaning
				])
				say(props.DaveLeaning, "Hm, what do we have here?")
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
					props.Key
				])
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

function clear() {
	clearTimeout(bubble.tid)
	bubble.time = Date.now()
	bubble.style.display = "none"
}

function skip() {
	if (Date.now() - bubble.time > 300) {
		clear()
		bubble.next()
	}
}

function sayLater(who, what) {
	bubble.talking || say(who, what)
}

function say(who, what) {
	const a = Array.isArray(who) ? who : [who, what]
	who = a.shift()
	what = a.shift()
	clear()
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
	bubble.time = Date.now()
	bubble.talking = 1
	bubble.next = function() {
		if (a.length > 0) {
			say(a)
		} else {
			clear()
			bubble.talking = 0
		}
	}
	bubble.tid = setTimeout(bubble.next,
		1000 + 200 * what.split(' ').length)
}

function show(list) {
	clear()
	for (let key in props) {
		const prop = props[key]
		prop.style.visibility = "hidden"
		prop.onclick = null
	}
	list.forEach((o) => o.style.visibility = "visible")
}

function go(name) {
	clear()
	bubble.next = function() {}
	bubble.talking = 0
	if (name == "Underwater" && !state.inventory.includes("Googles")) {
		sayLater(props.Dave, "First I need diving googles.")
		return
	}
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
	document.onclick = skip
	window.onresize = resize
	resize()
}
