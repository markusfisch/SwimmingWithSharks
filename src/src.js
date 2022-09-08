"use strict"

const scenes = {
		Stern: function() {
			set(Boat, 230, 24)
			set(Dave)
			set(Sheryl, -50)
			set(Googles, -62, 26, .3, -80)
			show([Boat, Stern,
				Dave,
				Sheryl, Watch, Googles
			])
			Dave.onclick = function() {
				sayLater(Dave, "That's me!")
			}
			Sheryl.onclick = function() {
				sayLater([Dave, "Hi, Sheryl, you swimming?",
					Sheryl, "None of your business, Dave.",
				])
			}
			Watch.onclick = function() {
				sayLater(Dave, "That's a sharp looking diving watch!")
			}
			Googles.onclick = function() {
				sayLater(Dave, "Diving googles!")
			}
		},
		Cabin: function() {
			set(Boat, -12, -5)
			set(Sheryl, -110)
			set(Googles, -122, 26, .3, -80)
			set(Dave, -75, 10)
			set(Skipper, -18, 20)
			set(Amanda, 45)
			set(Book, 35, 28, 1, -32)
			set(Bruce, 85, 5)
			show([Boat, Cabin,
				Dave,
				Sheryl, Watch, Googles,
				Amanda, Book,
				Bruce,
				Skipper
			])
			Sheryl.onclick = function() {
				sayLater([Dave, "What do you think, Sheryl?",
					Sheryl, "I think it was a heart attack, Dave.",
				])
			}
			Amanda.onclick = function() {
				sayLater([Dave, "What do you think, Amanda?",
					Amanda, "It may have something to do with the Triangle…",
					Dave, "What Triangle?",
					Amanda, "We're in the middle of the Bermuda Triangle!",
					Dave, "And?",
					Amanda, "There are mysterious forces…",
				])
			}
			Book.onclick = function() {
				sayLater([Dave, "What's this book?",
					Amanda, "It's about the Bermuda Triangle!",
				])
			}
			Bruce.onclick = function() {
				sayLater([Dave, "Did you see anything, Bruce?",
					Bruce, "I saw how he was looking at my wife.",
					Dave, "Yeah, and this is why you killed him?",
					Bruce, "I didn't kill the slacker. Must have been ill or something.",
					Amanda, "Bermuda!",
				])
			}
			Skipper.onclick = function() {
				sayLater([Dave, "He looks unharmed. Apart from that little scratch on his arm.",
					Bruce, "Death by scratch",
				])
			}
			if (!state.discover) {
				state.discover = 1
				say([Dave, "What happened?",
					Amanda, "Oh my god, he just collapsed!",
					Bruce, "Maybe it's the salmon mousse?",
					Amanda, "Don't be ridiculous! We all ate the salmon mousse!",
					Bruce, "Maybe he was allergic?",
					Amanda, "But he served it to us!",
					Sheryl, "Maybe it was a heart attack then?",
					Dave, "I don't know. I'm not a doctor. Let's see…",
				])
			}
		},
		Deck: function() {
			set(Boat, -230, 64)
			set(Dave, -30, -2)
			show([Boat, Deck,
				Dave
			])
			if (!state.bow) {
				state.bow = 1
				say(Dave, "I'm the king of the world!")
			}
		},
		Bridge: function() {
			set(Boat, 20, 124)
			set(Dave)
			set(Sheryl, -75)
			set(Googles, -87, 26, .3, -80)
			show([Boat, Bridge,
				Dave,
				Sheryl, Watch, Googles
			])
			say([Dave, "Now who's your captain?",
				Sheryl, "Not you."
			])
		},
		Store: function() {
			set(Boat, -200, -20)
			set(DaveLeaning, -43, 10)
			show([Boat, Store,
				DaveLeaning
			])
			say(DaveLeaning, "Hm, what's in here?")
		},
		Underwater: function() {
			set(Boat, 250, -250)
			set(Dave)
			set(Shark, 100, -50)
			set(Key, -40, 130, .5)
			show([Boat, Underwater,
				Dave,
				Shark,
				Key
			])
			say(Dave, "Under the sea…")
		},
	},
	state = {
		inventory: [],
		scene: scenes.Stern
	}

let centerX,
	centerY

function clear() {
	clearTimeout(B.tid)
	B.time = Date.now()
	B.style.display = "none"
}

function skip() {
	if (B.next && Date.now() - B.time > 300) {
		clear()
		B.next()
	}
}

function sayLater(who, what) {
	B.talking || say(who, what)
}

function say(who, what) {
	const a = Array.isArray(who) ? who : [who, what]
	who = a.shift()
	what = a.shift()
	clear()
	// Set this for getBoundingClientRect() to work as expected.
	B.style.left = "0px"
	B.style.top = "0px"
	B.style.display = "block"
	BM.innerHTML = what
	const whoRect = who.getBoundingClientRect(),
		bubbleRect = B.getBoundingClientRect(),
		margin = parseFloat(getComputedStyle(B).fontSize),
		whoRectHalfWidth = whoRect.width / 2,
		ww = window.innerWidth
	let x = whoRect.x || whoRect.left,
		cx = x + whoRectHalfWidth
	if (x + bubbleRect.width >= ww) {
		x = Math.min(ww - bubbleRect.width - margin,
			Math.max(margin, x + whoRectHalfWidth - bubbleRect.width / 2))
	}
	B.style.left = x + "px"
	B.style.top = ((whoRect.y || whoRect.top) -
		bubbleRect.height - margin * 1.5) + "px"
	BP.style.left = (cx - x) + "px"
	B.time = Date.now()
	B.talking = 1
	B.next = function() {
		if (a.length > 0) {
			say(a)
		} else {
			clear()
			B.talking = 0
		}
	}
	B.tid = setTimeout(B.next,
		1000 + 200 * what.split(' ').length)
}

function show(list) {
	clear()
	for (let key in window) {
		const e = window[key]
		if (e && e.tagName == "g") {
			e.style.visibility = "hidden"
			e.onclick = null
		}
	}
	list.forEach((o) => o.style.visibility = "visible")
}

function go(name) {
	clear()
	B.next = function() {}
	B.talking = 0
	if (name == "Underwater" && !state.inventory.includes("Googles")) {
		sayLater(Dave, "I need diving googles to see anything.")
		return
	}
	state.scene = scenes[name]
	state.scene()
}

function set(e, x, y, size, deg) {
	e.style.transformOrigin = `50px 50px`
	e.style.transform = `translate(${
		centerX - 50 + (x || 0)}px, ${
		centerY - 50 + (y || 0)}px) rotateZ(${
		deg || 0}deg) scale(${size || 1})`
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

	state.scene()
}

window.onload = function() {
	;[...document.getElementsByTagName("g")].forEach(e => window[e.id] = e)
	;["B", "BM", "BP"].forEach(id => window[id] = document.getElementById(id))
	;["SternCabin", "SternBridge", "SternDeck", "SternUnderwater",
		"BridgeStern",
		"DeckStern",
		"CabinStern", "CabinStore",
		"StoreCabin",
		"UnderwaterStern"
	].forEach(id => document.getElementById(id).onclick = function() {
		go(id.replace(/^[A-Z][a-z]*/, ""))
	})
	document.onclick = skip
	window.onresize = resize
	resize()
}
