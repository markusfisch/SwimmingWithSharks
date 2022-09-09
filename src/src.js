"use strict"

const scenes = {
		Stern: function() {
			set(Boat, null, 230, 24)
			set(Dave, function() {
				say([Dave, "That's me!"])
			})
			if (state.discover) {
				set(Sheryl, function() {
					say([Dave, [
						{
							text: () => state.swimming
								? "Did you found something down there?"
								: "Hi, Sheryl, you swimming?",
							action: function() {
								if (state.swimming) {
									say([Sheryl, "Again, none of your business. But no, just fish and sand."])
								} else {
									state.swimming = 1
									say([Sheryl, "None of your business, Dave."])
								}
							}
						},
						{
							text: () => state.inventory.includes(Goggles)
								? null
								: "Can I have your diving goggles?",
							action: function() {
								addInventory(Goggles)
								say([Sheryl, "Sure, here…",
									Dave, "Ouch!",
									Sheryl, "Oh sorry, I scratched you with my watch.",
									Dave, "I'm feeling dizzy…",
								], function() {
									FX.style.background = "#000"
									FX.style.display = "block"
									FX.innerHTML = "You die."
									FX.onclick = function() {
										location.reload()
									}
								})
							}
						},
						{
							text: () => "Nevermind.",
							action: clear
						},
					]])
				}, -50)
				set(Watch, function() {
					say([Dave, "That's a sharp looking diving watch!"])
				}, -39, 14, .17, 10)
				set(Goggles, function() {
					say([Dave, "Diving goggles!"])
				}, -61, 28, .4, -100)
			} else {
				set(Bruce, function() {
					say([Dave, "Did you hear that scream?",
						Bruce, "Yes, it came from the cabin!",
					])
				}, -50)
				say([SternCabin, "AAAAAAAHH!!"])
			}
		},
		Cabin: function() {
			set(Boat, null, -12, -5)
			set(Dave, null, -68, 10)
			set(Skipper, function() {
				say([Dave, "He looks unharmed. Apart from that little scratch on his arm.",
					Bruce, "Death by scratch",
				])
			}, -10, 20)
			set(Mousse, function() {
				say([Mousse, [
					{
						text: () => "Take the salmon mousse.",
						action: function() {
							addInventory(Mousse, function() {
								if (state.scene == "Underwater" &&
										!state.sharkGone) {
									state.sharkGone = 1
									Mousse.used = 1
									removeFromInventory(Mousse)
									Shark.style.visibility = "hidden"
									say([DaveDiving, "That worked!"])
									return 1
								}
							})
							clear()
						}
					},
					{
						text: () => "Taste it.",
						action: function() {
							say([Dave, "Not bad.",
								Bruce, "And you're still alive, kid.",
								Dave, "I think that settles the mousse theory.",
							])
						}
					},
					{
						text: () => "Leave it.",
						action: clear
					},
				]])
			}, -10, -30)
			if (state.discover) {
				set(Bruce, function() {
					say([Dave, "Anything new?",
						Bruce, "He didn't move."
					])
				}, 84)
			} else {
				state.discover = 1
				set(Sheryl, function() {
					say([Dave, "What do you think, Sheryl?",
						Sheryl, "I think it was a heart attack, Dave.",
					])
				}, 50)
				set(Goggles, null, 39, 28, .4, -100)
				set(Watch, function() {
					say([Dave, "That's a sharp looking diving watch!",
						Sheryl, "Thank you."
					])
				}, 61, 14, .17, 10)
				set(Amanda, function() {
					say([Dave, "What do you think, Amanda?",
						Amanda, "It may have something to do with the Triangle…",
						Dave, "What Triangle?",
						Amanda, "We're in the middle of the Bermuda Triangle!",
						Dave, "And?",
						Amanda, "There are mysterious forces…",
					])
				}, 88, -5)
				set(Book, function() {
					say([Book, [
						{
							text: () => "What's that book?",
							action: function() {
								say([Amanda, "It's about the Bermuda Triangle!",
									Amanda, "We are in the Bermuda Triangle - right now!",
									Dave, "And why's that important?",
									Amanda, "Because Aliens?! There may also be a gate to another dimension! Nobody knows what's going on here…",
								])
							}
						},
						{
							text: () => "Can I have the book?",
							action: function() {
								say([Amanda, "No you cannot have it."])
							}
						},
					]])
				}, 98, 21, 1, 20)
				set(Bruce, function() {
					say([Dave, "Did you see anything, Bruce?",
						Bruce, "I saw how he was looking at my wife.",
						Dave, "Yeah, and this is why you killed him?",
						Bruce, "I didn't kill the slacker. Must have been ill or something.",
						Amanda, "Bermuda!",
					])
				}, -110)
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
			set(Dave, null, 30, -2)
			if (!state.discover && !state.bow) {
				state.bow = 1
				say([Dave, "I'm the king of the world!"])
			}
		},
		Bridge: function() {
			set(Boat, null, 20, 124)
			if (state.inventory.includes(Key)) {
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
			} else if (state.discover) {
				set(Dave, null, -75)
				set(Amanda, function() {
					say([Dave, "What are you doing up here?",
						Amanda, "I've checked the steering and the keys are missing!",
						Dave, "So we can't move?",
						Amanda, "Exactly. Very strange."
					])
				})
			} else {
				set(Dave)
			}
		},
		Store: function() {
			set(Boat, null, -200, -20)
			set(DaveLeaning, null, -43, 10)
			say([DaveLeaning, "What's in here?"])
		},
		Underwater: function() {
			Goggles.inScene = 1
			set(Boat, null, 250, -250)
			set(DaveDiving, null, -70, -40)
			set(Goggles, null, -70, -52, .4)
			if (!state.sharkGone) {
				set(Shark, function() {
					say([DaveDiving, "Hi fella…"])
				}, 50, 30, 2)
				say([DaveDiving, "Whoa!!!!!!"])
			}
			set(Key, function() {
				if (state.sharkGone) {
					addInventory(Key)
					say([DaveDiving, "I got the key!"])
				} else {
					say([DaveDiving, "I can't get around the shark!"])
				}
			}, 100, 132, .6, 30)
		},
	},
	visibles = [],
	state = {
		inventory: [],
		scene: "Stern"
	}

let centerX,
	centerY

function removeFromInventory(e) {
	e.style.visibility = "hidden"
	state.inventory = state.inventory.filter((item) => item != e)
}

function updateInventory() {
	let x = 0
	state.inventory.forEach((e) => {
		if (e.inScene) {
			return
		}
		e.style.transformOrigin = "left top"
		e.style.transform = `translate(${x}px, 0px) rotate(0) scale(.5)`
		e.style.visibility = 'visible'
		e.onclick = function() {
			e.use && e.use() || say([Dave, "Can't use that here."])
		}
		x += 30
	})
}

function addInventory(item, f) {
	if (!state.inventory.includes(item)) {
		item.style.visibility = "hidden"
		item.use = f
		state.inventory.push(item)
		updateInventory()
	}
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
	if (Array.isArray(what)) {
		BM.innerText = ""
		const ol = document.createElement('ol')
		what.map(function(option) {
			const text = option.text()
			if (text) {
				const li = document.createElement('li'),
					a = document.createElement('a')
				a.href = "javascript:void(0)"
				a.onclick = option.action
				a.innerHTML = text
				li.appendChild(a)
				ol.appendChild(li)
			}
		})
		BM.appendChild(ol)
		B.next = null
	} else {
		BM.innerHTML = what
		B.talking = 1
		B.time = Date.now()
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
}

function show(name) {
	for (let key in window) {
		const e = window[key]
		if (e && e.tagName == "g") {
			e.inScene = 0
			e.style.visibility = "hidden"
			e.onclick = null
		}
	}
	visibles.length = 0
	const bg = window[name]
	bg && visibles.push(bg)
	state.scene = name
	scenes[name]()
	visibles.forEach((o) => o.style.visibility = "visible")
	updateInventory()
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
	if (e.used || (!e.inScene && state.inventory.includes(e))) {
		return
	}
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

	show(state.scene)
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
