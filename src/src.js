"use strict"

const scenes = {
		Stern: function() {
			set(Boat, null, 230, 24)
			set(Dave, function() {
				say([Dave, "That's me!"])
			})
			/*if (!state.scream) {
				state.scream = 1
				say([SternCabin, "AAAAAAHHHHH!!",
					Dave, "What was that?",
				])
			} else {*/
				const talkToSheryl = function() {
					if (state.goggles && !state.inventory.includes(Goggles)) {
						say([Dave, "Can I have your diving goggles, Sheryl?",
							Sheryl, "Sure, here…",
							Dave, "Ouch!",
							Sheryl, "Oh, sorry, I scratched you, that damn watch!",
						], function() {
							Dave.hasGoggles = 1
							state.inventory.push(Goggles)
							Goggles.style.visibility = "hidden"
							say([Dave, "I'm feeling dizzy…"])
							flashTo("Death", fadeOut)
						})
					} else {
						say([Dave, "Hi, Sheryl, you swimming?",
							Sheryl, "None of your business, Dave.",
						])
					}
				}
				set(Sheryl, talkToSheryl, -50)
				set(Watch, function() {
					say([Dave, "That's a sharp looking diving watch!"])
				}, -39, 14, .17, 10)
				if (!Dave.hasGoggles) {
					set(Goggles, function() {
						if (!state.goggles) {
							state.goggles = 1
							say([Dave, "Diving goggles!"])
						} else if (!state.inventory.includes(Goggles)) {
							talkToSheryl()
						}
					}, -61, 28, .4, -100)
				}
			//}
		},
		Cabin: function() {
			set(Boat, null, -12, -5)
			set(Sheryl, function() {
				say([Dave, "What do you think, Sheryl?",
					Sheryl, "I think it was a heart attack, Dave.",
				])
			}, -110)
			set(Goggles, function() {
				say([Dave, "Diving goggles!"])
			}, -121, 28, .4, -100)
			set(Watch, function() {
				say([Dave, "That's a sharp looking diving watch!"])
			}, -99, 14, .17, 10)
			set(Dave, null, -75, 10)
			set(Skipper, function() {
				say([Dave, "He looks unharmed. Apart from that little scratch on his arm.",
					Bruce, "Death by scratch",
				])
			}, -18, 20)
			set(Amanda, function() {
				say([Dave, "What do you think, Amanda?",
					Amanda, "It may have something to do with the Triangle…",
					Dave, "What Triangle?",
					Amanda, "We're in the middle of the Bermuda Triangle!",
					Dave, "And?",
					Amanda, "There are mysterious forces…",
				])
			}, 45, -5)
			set(Book, function() {
				say([Dave, "What's that book?",
					Amanda, "It's about the Bermuda Triangle!",
					Amanda, "We are in the Bermuda Triangle - right now!",
					Dave, "And why's that important?",
					Amanda, "Because Aliens?! There may also be a gate to another dimension! Nobody knows what's going on here…",
				])
			}, 35, 21, 1, -20)
			set(Bruce, function() {
				say([Dave, "Did you see anything, Bruce?",
					Bruce, "I saw how he was looking at my wife.",
					Dave, "Yeah, and this is why you killed him?",
					Bruce, "I didn't kill the slacker. Must have been ill or something.",
					Amanda, "Bermuda!",
				])
			}, 84)
			set(Mousse, function() {
				say([Dave, "The salmon mousse"])
			}, -10, -30)
			if (!state.discover) {
				state.discover = 1
				say([Dave, "What happened?",
					Amanda, "He just collapsed!!",
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
			set(Boat, null, -230, 64)
			set(Dave, null, -30, -2)
			if (!state.bow) {
				state.bow = 1
				say([Dave, "I'm the king of the world!"])
			}
		},
		Bridge: function() {
			set(Boat, null, 20, 124)
			set(Dave)
			set(Sheryl, null, -75)
			set(Goggles, function() {
				say([Dave, "Diving goggles!"])
			}, -86, 28, .4, -100)
			set(Watch, function() {
				say([Dave, "That's a sharp looking diving watch!"])
			}, -64, 14, .17, 10)
			say([Dave, "Now who's your captain?",
				Sheryl, "Not you.",
			])
		},
		Store: function() {
			set(Boat, null, -200, -20)
			set(DaveLeaning, null, -43, 10)
			say([DaveLeaning, "What's in here?"])
		},
		Underwater: function() {
			set(Boat, null, 250, -250)
			set(DaveDiving, null, -70, -40)
			set(Goggles, null, -70, -52, .4)
			set(Shark, null, 50, 30, 2)
			set(Key, null, 100, 132, .6, 30)
			say([DaveDiving, "Whoa!!!!!!"])
		},
		Death: function() {
			FX.innerHTML = 'You are dead.<br/>Press <a href="#" onclick="location.reload()">here</a> to try again.'
			FX.style.display = 'block'
		},
	},
	fadeOut = ['#0002', '#0004', '#0008', '#000a', '#000'],
	visibles = [],
	state = {
		inventory: [],
	}

let centerX,
	centerY

function flashTo(name, colors, index) {
	index = index || 0
	FX.style.background = colors[index]
	FX.style.display = 'block'
	FX.flashing = 1
	setTimeout(function() {
		++index
		if (index >= colors.length) {
			FX.style.display = 'none'
			FX.flashing = 0
			show(name)
		} else {
			flashTo(name, colors, index)
		}
	}, 100)
}

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

function say(a, f, cont) {
	if (!cont && B.talking) {
		return
	}
	clear()
	const who = a.shift(),
		what = a.shift()
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
			say(a, f, 1)
		} else {
			clear()
			B.talking = 0
			B.next = null
			f && f()
		}
	}
	B.tid = setTimeout(B.next, 1000 + 200 * what.split(' ').length)
}

function show(name) {
	for (let key in window) {
		const e = window[key]
		if (e && e.tagName == "g") {
			e.style.visibility = "hidden"
			e.onclick = null
		}
	}
	visibles.length = 0
	const bg = window[name]
	bg && visibles.push(bg)
	state.scene = scenes[name]
	state.scene()
	visibles.forEach((o) => o.style.visibility = "visible")
}

function go(name) {
	if (B.talking) {
		return
	} else if (name == "Underwater" && !state.inventory.includes(Goggles)) {
		say([Dave, "I need diving goggles to see anything."])
		return
	}
	clear()
	show(name)
}

function set(e, f, x, y, size, deg) {
	e.style.transformOrigin = `50px 50px`
	e.style.transform = `translate(${
		centerX - 50 + (x || 0)}px, ${
		centerY - 50 + (y || 0)}px) rotateZ(${
		deg || 0}deg) scale(${size || 1})`
	e.onclick = f ? function() {
		B.talking || f()
	} : null
	visibles.push(e)
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

	show("Stern")
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
	document.onkeyup = skip
	// Prevent pinch/zoom on iOS 11.
	if ('ontouchstart' in document) {
		document.addEventListener('gesturestart', function(event) {
			event.preventDefault()
		}, false)
		document.addEventListener('gesturechange', function(event) {
			event.preventDefault()
		}, false)
		document.addEventListener('gestureend', function(event) {
			event.preventDefault()
		}, false)
	}
	window.onresize = resize
	resize()
}
