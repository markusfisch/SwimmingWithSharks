"use strict"

const visibles = [],
	state = {
		inventory: [],
		scene: "Stern"
	},
	scenes = {
		Stern: function() {
			set(Boat, null, 230, 24)
			if (state.bodyFound) {
				state.bodyFoundAndCabinLeft = 1
				set(Dave)
				if (state.leftGoggle) {
					setLeftGoggles()
				} else {
					set(Sheryl, function() {
						say([Dave, [
							{
								text: () => state.swimming
									? "So you found something down there?"
									: "Hi, Sheryl, you swimming?",
								action: function() {
									say([Sheryl, state.swimming
										? "No, just fish and sand."
										: "None of your business, Dave."
									])
									state.swimming = 1
								}
							},
							{
								text: () => state.inventory.includes(Goggles)
									? null
									: "Can I have your diving goggles?",
								action: function() {
									say([Sheryl, "No, they are mine and I don't borrow my things."])
								}
							},
							{
								text: () => state.checkKeys
									? "Do you saw the keys for this boat?"
									: null,
								action: function() {
									say([Sheryl, "I didn't even know a boat needs a key.",
										Dave, "Yeah, right, how would you."
									])
								}
							},
							{
								text: () => state.diverWatch
									? "What time is it?"
									: null,
								action: function() {
									say([Sheryl, "I don't know.",
										Dave, "But you have diver watch!",
										Sheryl, "Yes, but it doesn't work.",
									])
								}
							},
							{
								text: () => "Nevermind.",
								action: clear
							},
						]])
					}, -55)
					set(Watch, function() {
						state.diverWatch = 1
						say([Dave, "A sharp looking diving watch!"])
					}, -44, 14, .17, 10)
					set(Goggles, function() {
						say([Dave, "Diving goggles!"])
					}, -66, 28, .3, -100)
				}
			} else {
				set(Dave, function() {
					say([Dave, state.daveFirst
						? "Stop tickling me!"
						: "That's me!"
					])
					state.daveFirst = 1
				}, 20)
				set(Bruce, function() {
					say([Dave, "Should I go first?",
						Bruce, "You're a big boy, aren't you?",
					])
				}, -50)
				if (!state.scream) {
					state.scream = 1
					say([SternCabin, "AAAAAAAHH!!",
						Dave, "Did you hear that scream?",
						Bruce, "Yes, it came from the cabin! Let's take a look!",
					])
				}
			}
		},
		Cabin: function() {
			set(Boat, null, -12, -5)
			set(Dave, null, -68, 10)
			set(Skipper, function() {
				if (state.bodyFoundAndCabinLeft) {
					let m
					if (state.checkKeys && !state.keysChecked) {
						state.keysChecked = 1
						m = "No keys."
					} else {
						m = "Still dead. Got to find out who killed him."
					}
					say([Dave, m])
				} else if (state.knifeFell) {
					say([Dave, "Apart from the knife in the head, he looks unharmed. There is just a little scratch on his arm.",
					])
				} else {
					say([Dave, "No pulse. He looks unharmed. Apart from that little scratch on his arm.",
						Bruce, "Death by scratch",
					])
				}
			}, -10, 22, 1)
			const takePlate = function() {
				addInventory(Plate, function() {
					if (state.mousse && state.scene == "Stern") {
						say([Dave, "Would you like some salmon mousse?",
							Sheryl, "Actually, I would. Thank you."
						], function() {
							consume(Plate)
							Mousse.style.visibility = "hidden"
							say([Sheryl, "Mumf!",
								Sheryl, "I think I need to use the bathroom… excuse me.",
								Sheryl, "And don't touch my goggles!",
							], function() {
								Sheryl.style.visibility = "hidden"
								Watch.style.visibility = "hidden"
								state.leftGoggle = 1
								setLeftGoggles()
							})
						})
					} else {
						noUse()
					}
				})
				say([Dave, "So I have a plate."])
			}
			if (state.knifeFell) {
				set(Plate, takePlate, -33, 0, .5)
				KnifeInHead.style.visibility = "visible"
			} else {
				const takePlateOrKnife = function() {
					if (!state.knifeFell) {
						Knife.style.visibility = "hidden"
						KnifeInHead.style.visibility = "visible"
						set(Plate, takePlate, -33, 0, .5)
						state.knifeFell = 1
						if (Amanda.style.visibility == "visible") {
							say([Amanda, "IIIIIEEEE!!",
								Dave, "Well…",
								Bruce, "Now he's dead for sure.",
								Sheryl, "Good job, Dave",
								Dave, "It was an accident! I'm so sorry, skipper!",
								Bruce, "I don't think he cares.",
								Amanda, "So disgusting!",
							])
						} else if (Bruce.style.visibility == "visible") {
							say([Bruce, "Ouch!",
								Dave, "Oh, I'm so sorry! It was an accident!",
								Bruce, "Now he's dead for sure.",
							])
						} else {
							say([Dave, "Ouch! I'm so sorry, skipper! It was an accident!"
							])
						}
					}
				}
				set(Plate, takePlateOrKnife, -33, 0, .5)
				set(Knife, takePlateOrKnife, -33, 0, .5, 20)
			}
			set(Can, function() {
				say([Can, [
					{
						text: () => "Taste the salmon mousse.",
						action: function() {
							say([Dave, "Not bad.",
								Bruce, "And you're still alive, kid.",
								Dave, "I think that settles the mousse theory.",
							])
						}
					},
					{
						text: () => !state.mousse && state.inventory.includes(Plate)
							? "Put something on the plate."
							: null,
						action: function() {
							state.mousse = 1
							Mousse.style.visibility = "visible"
							say([Dave, "Looks delicious!"])
						}
					},
					{
						text: () => state.sawShark
							? "Take it."
							: null,
						action: function() {
							addInventory(Can, function() {
								if (state.scene == "Underwater" &&
										!state.sharkGone) {
									state.sharkGone = 1
									consume(Can)
									Shark.style.visibility = "hidden"
									say([DaveDiving, "That worked!"])
								} else {
									noUse()
								}
							})
							clear()
						}
					},
					{
						text: () => "Leave it for later.",
						action: clear
					},
				]])
			}, -4, -5, .5)
			set(Bottle, function() {
				addInventory(Bottle)
				say([Dave, "Got a bottle of rum."])
			}, 20, -12, .5)
			if (state.hasKey) {
				set(DeadBruce, function() {
					say([Dave, "Dead. And there's the same scratch! I've got a hunch where it's coming from!"])
				}, 75, 10)
				if (!state.badFeeling) {
					state.badFeeling = 1
					say([Dave, "I've got a bad feeling about this!"])
				}
			} else if (state.bodyFoundAndCabinLeft) {
				set(Bruce, function() {
					let conv
					if (state.sawShark) {
						conv = [Dave, "I know where the keys are!",
							Bruce, "Really?",
							Dave, "They're on the bottom of the ocean! But there's a shark and I can't get them.",
							Bruce, "Hm, you need something to scare it away I guess.",
						]
					} else if (state.checkKeys) {
						conv = [Dave, "Have you seen the keys for the boat?",
							Bruce, "No, I haven't. We should better find them!",
						]
					} else {
						conv = [Dave, "Anything new?",
							Bruce, "He didn't move, son."
						]
					}
					say(conv)
				}, 84)
				set(Book, function() {
					say([Book, [
						{
							text: () => "You believe in this stuff, too?",
							action: function() {
								say([Bruce, "No, I don't think aliens killed the guy. I think it was one of us.",
									Dave, "Who?",
									Bruce, "That's the question, Sherlock.",
								], function() {
									if (state.knifeFell) {
										say([Bruce, "We all know who stabbed him in the eye.",
											Dave, "It was an accident!",
											Bruce, "Just saying.",
										])
									}
								})
							}
						},
						{
							text: () => "Can I have the book?",
							action: function() {
								addInventory(Book, function() {
									if (state.scene == "Underwater") {
										noUse()
									} else {
										say([currentDave(), "Interesting read… many ships and planes vanished here. Hm.",
											Dave, "Oh, even a ship full of gold right in this area!"
										])
										state.knowGoldShip = 1
									}
								})
								say([Bruce, "Sure."])
							}
						},
					]])
				}, 70, 27, .35, 70)
			} else {
				set(Sheryl, function() {
					say([Dave, "What do you think, Sheryl?",
						Sheryl, "I think it was a heart attack, Dave.",
					])
				}, 50)
				set(Goggles, function() {
					say([Dave, "Diving goggles."])
				}, 39, 28, .3, -100)
				set(Watch, function() {
					state.diverWatch = 1
					say([Dave, "A sharp looking diving watch!"])
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
				}, 81, 21, .35, 18)
				set(Bruce, function() {
					say([Dave, "Did you see anything, Bruce?",
						Bruce, "I saw how he was looking at my wife.",
						Dave, "Yeah, and this is why you killed him?",
						Bruce, "I didn't kill the slacker. Must have been ill or something.",
						Amanda, "Bermuda!",
					])
				}, -112, -5)
				if (!state.bodyFound) {
					say([Dave, "What happened?",
						Amanda, "He just collapsed!!",
						Bruce, "Maybe it's the salmon mousse?",
						Amanda, "Don't be ridiculous! We all ate the salmon mousse!",
						Bruce, "Maybe he was allergic?",
						Amanda, "But he served it to us!",
						Sheryl, "Maybe it was a heart attack then?",
						Dave, "I don't know. I'm not a doctor. Let's see…",
					])
					state.bodyFound = 1
				}
			}
		},
		Deck: function() {
			set(Boat, null, -230, 64)
			if (!state.bodyFound && !state.deckFirst) {
				state.deckFirst = 1
				say([Dave, "I'm the king of the world!"])
				set(Dave, null, 30, -2)
			} else {
				set(Dave, null, -28, -2)
				if (state.hasKey) {
					set(Amanda, function() {
						say([Dave, "What are you doing here?",
							Amanda, "I'm looking into Triangle for answers…",
							Dave, "You're looking into the wrong direction. The solution is directly below you: it's gold!",
							Amanda, "What?",
							Dave, "It's Sheryl. She killed the skipper because she found gold and wants to have it all by herself.",
							Amanda, "How?",
							Dave, "That flashy big diving watch of hers is poisoned, and I think she scratched the skipper with it.",
							Amanda, "Oh my god…",
						])
					}, 32, -2)
				}
			}
		},
		Bridge: function() {
			set(Boat, null, 20, 124)
			if (state.hasKey) {
				set(Dave)
				set(Sheryl, null, -75)
				set(Watch, function() {
					say([Dave, "This is dangerous!"])
				}, -64, 14, .17, 10)
				say([Dave, "So it was you!",
					Sheryl, "What do you mean?",
					Dave, "You killed the skipper and Bruce!",
					Sheryl, "Why do you think that?",
					Dave, "Because I know you found the gold, and obviousely you want it all for yourself! You killed the skipper to prevent us from moving away, and threw the keys in the ocean where only you could find them!",
					Dave, "Then you killed Bruce when you were all alone with him. Didn't you?",
					Sheryl, "And how did I kill them? I am a woman.",
					Dave, "With that sharp diving watch of yours! Obviousely it's poisoned!",
					Sheryl, "No, no, no, darling, you got that all wrong.",
					Dave, "Keep your distance! I won't fall for it as easily as the others!",
				])
			} else if (state.bodyFound) {
				set(Dave, null, -75)
				set(Amanda, function() {
					if (state.sawShark) {
						say([Dave, "I found the keys! They're on the bottom of the ocean! But there's a shark and I can't get them.",
							Amanda, "A shark!",
							Dave, "Yes. Do you have any idea how to get rid of the shark?",
							Amanda, "Sorry, I don't know much about sharks. They eat fish. That's all I know.",
						])
					} else if (state.keysChecked) {
						say([Dave, "The skipper had no keys.",
							Amanda, "Then we're dead in the water. And it looks like there's a storm coming…",
							Amanda, "Or something else is hiding in these clouds…",
							Dave, "Yes, ahm, either way, we should find the keys.",
						])
					} else {
						say([Dave, "Looking for aliens?",
							Amanda, "Very funny. I've checked the helm and the keys are missing!",
							Dave, "So we can't move?",
							Amanda, "Exactly. Maybe the skipper still has the keys?",
						], function() {
							state.checkKeys = 1
						})
					}
				})
			} else {
				set(Dave)
				if (!state.bridgeFirst) {
					state.bridgeFirst = 1
					say([Dave, "Nice view."])
				}
			}
		},
		Store: function() {
			set(Boat, null, -200, -20)
			set(DaveLeaning, null, -43, 10)
			set(Aid, function() {
				addInventory(Aid)
				say([DaveLeaning, "A first aid kit. I'm afraid it's too late for that."])
			}, -66, 47, .4, 10)
			set(Bra, function() {
				addInventory(Bra)
				say([DaveLeaning, "A bra? Well maybe the skipper was a ladies' man after all."])
			}, -6, 18, .5, 180)
			set(Flag, function() {
				addInventory(Flag)
				say([DaveLeaning, "A white flag. Hm."])
			}, 20, -5, .75, 20)
			set(DiverKnife, function() {
				addInventory(DiverKnife)
				say([DaveLeaning, "A diver knife! May come in handy."])
			}, -7, -4, .5, 20)
			set(Screwdriver, function() {
				addInventory(Screwdriver)
				say([DaveLeaning, "A screwdriver."])
			}, 41, -16, .5, -40)
			if (!state.storeFirst) {
				state.storeFirst = 1
				say([DaveLeaning, "There's a lot of stuff in here!"])
			}
		},
		Underwater: function() {
			Goggles.inScene = 1
			set(Boat, null, 250, -250)
			set(DaveDiving, null, -70, -40)
			set(Goggles, null, -70, -52, .3)
			set(Gold, function() {
				say([DaveDiving, "Gold! So that's what's it all about! Sheryl found gold!",
				])
			}, -60, 115)
			if (!state.sharkGone) {
				state.sawShark = 1
				set(Shark, function() {
					say([DaveDiving, "Easy big fella… I should better get up…"])
				}, 50, 30, 2)
				say([DaveDiving, "Whoa!!!!!!"])
			}
			set(Key, function() {
				if (state.sharkGone) {
					addInventory(Key, function() {
						if (state.scene == "Bridge" && state.hasKey) {
							consume(Key)
							say([Dave, "We can move again!"])
						} else {
							noUse()
						}
					})
					state.hasKey = 1
					say([DaveDiving, "I got the key!"])
				} else {
					say([DaveDiving, "I can't get around the shark!"])
				}
			}, 100, 125, .5)
		},
	}

let centerX,
	centerY

function setLeftGoggles() {
	set(Goggles, function() {
		addInventory(Goggles)
		say([Dave, "Finally!"])
	}, -60, 42, .3, -10)
}

function removeFromInventory(e) {
	e.style.visibility = "hidden"
	state.inventory = state.inventory.filter(item => item != e)
}

function consume(e) {
	removeFromInventory(e)
	e.used = 1
}

function currentDave() {
	return [Dave, DaveLeaning, DaveDiving].find(dave =>
		dave.style.visibility == "visible")
}

function noUse() {
	say([currentDave(), "That has no use here."])
}

function updateInventory() {
	let x = 0
	state.inventory.forEach(e => {
		if (e.inScene) {
			return
		}
		e.style.transformOrigin = "left top"
		e.style.transform = `translate(${x}px, 0px) rotate(0) scale(.5)`
		e.style.visibility = "visible"
		e.onclick = function() {
			if (B.talking) {
				return
			} else if (e.use) {
				e.use()
			} else {
				noUse()
			}
		}
		e.onmousemove = e.ontouchmove = function(event) {
			if (!(event instanceof MouseEvent) || event.buttons) {
				say([currentDave(), "Don't drag, just click. I will know what to do."])
			}
		}
		x += 30
	})
	if (state.inventory.includes(Plate) && state.mousse) {
		Mousse.style.visibility = "visible"
	}
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
		B.talking = (a.length > 0 || f != null) ? 1 : 0
		B.time = Date.now()
		B.next = function() {
			if (a.length > 0) {
				say(a, f, 1)
			} else {
				clear()
				B.next = null
				B.talking = 0
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
	visibles.forEach(o => o.style.visibility = "visible")
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

	const style = S.style
	style.width = stageWidth + "px"
	style.height = stageHeight + "px"
	style.transformOrigin = "top left"
	style.transform = `scale(${ratio})`
	style.display = "block"

	show(state.scene)
}

window.onload = function() {
	;[...document.getElementsByTagName("g")].forEach(e => window[e.id] = e)
	;["S", "B", "BM", "BP"].forEach(id => window[id] = document.getElementById(id))
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
