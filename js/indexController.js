/**
 * indexController.js
 *
 * Copyright 2013 Thomas Morrison, all right reserved.
 * @requires - index.html - Learners Road Code
 */

//// SUPPORT
var ie_lt9 = /MSIE \d/.test(navigator.userAgent) && (document.documentMode === null || document.documentMode < 9);

/**
 * @throws - when element not found
 * @return - element - optional
 */
function e(id) {
	'use strict';
	
	var n = document.getElementById(id);
	if (n === undefined) {
		console.error('Unable to secure reference to "' + id + '".');
	} else {
		return n;
	}
}
//Add element string content
function setStrContent(e, str) {
	'use strict';
	//because textcontent will not parse html and add '<br/>' etc
	e.innerHTML = str;
}
// Add styles
function setStyleContent(e, str) {
	'use strict';
	
	if (e.styleSheet) {
		//prefered but not fully supported
		e.styleSheet.cssText = str;
	} else {
		//full back
		e.appendChild(document.createTextNode(str));
	}
}
//remove all but road elements
function removeChildren(n) {
	'use strict';
	
	while (n.hasChildNodes()) {
		// miss main road
		if (n.lastChild === doc.main) {
			return;
		}
		n.removeChild(n.lastChild);
	}
}
/**
 * @return - element
 * @param tag - string
 * @param content - string || array
 */
function cre(tag, content) {
	'use strict';
	//create
	var n = document.createElement(tag), atr, i;
	
	// add contents from array
	if (typeof content === 'string') {
		//string
		n.appendChild(document.createTextNode(content));
	} else if (content && content !== null) {
		//object
		for (i = 0; i < content.length; i += 1) {
			if (typeof content[i] === 'string') {
				//string
				n.appendChild(document.createTextNode(content[i]));
			} else {
				//element
				n.appendChild(content[i]);
			}
		}
	}
	return n;
}
/**
 * @return - same element
 * @param attr - object
 */
function att(n, attr) {
	if (typeof attr === 'object') {
		for (var atr in attr) {
			if (attr.hasOwnProperty(atr)) {
				// This is because IE8 does not like 'n[atr] = attr[atr]' statement.
				switch(atr) {
				case 'class':
					n.className = attr[atr];
					break;
				case 'style':
					n.style.cssText = attr[atr];
					break;
				case 'href':
					n.href = attr[atr];
					break;
				case 'type':
					n.type = attr[atr];
					break;
				case 'target':
					n.target = attr[atr];
					break;
				case 'id':
					n.id = attr[atr];
					break;
				default:
					//other
					if (n.hasOwnProperty(atr)) {
						try {
							n[atr] = attr[atr];
						} catch (e) {
							n.setAttribute(atr, attr[atr]); //last resort
						}
					} else {
						n.setAttribute(atr, attr[atr]); //last resort
					}
				}
			}
		}
	}
	return n;
}

//// GLOBALS

var	total = 5, 				// Number of question in test |>> This is set at 5 but will be 20 (see log)
	cColor = '', 			//car color
	doneClick = false,		// has the user clicked an option before?
	images = (function () {
		'use strict';
		
		// Preload images
		var imgs = [], i = 0, urls = ['cars.png', 'ics.png', 'road-01.png', 'road-02.png', 'blinkerglow-left.gif', 'blinkerglow-right.gif', 'blinkerlight-left.gif', 'blinkerlight-right.gif'];
			for (i; i < urls.length; i += 1) {
				imgs[i] = new Image();
				imgs[i].src = 'images/' + urls[i];
			}
		return imgs;
	}()),
	
//// GLOBAL OBJECT LITERALS
		
	data = {
		q : {}, //current data object
		xn : [],
		xc : 0,
		
		/**
		 * @return - new random unused number from total
		 * @return - 'end' as string if reached total
		 * @desc - Uses xn and xc to track used numbers and
		 * count total questions thus far.
		 */
		getNumber : function () {
			'use strict';
			
			for (;;) {
				// Random number
				var nu = Math.floor((Math.random() * total) + 1);
				
				if (this.xc >= total) {
					// When completed total questions reset
					this.xn = [];
					this.xc = 0;
					
					return 'end';
				} else if (!data.xn[nu]) {
					// If found an unused number, set n to the new number and exit the loop
					this.xn[nu] = true;
					this.xc += 1;
					return nu;
				}
				// Loop forever til new number found
			}
		},
		
		// reset q object based on n value
		getData : function (n) {
			'use strict';
			var c1 = cColor, c2 = cColor === 'blue' ? 'green' : 'blue', r1 = /\$1\$/g, r2 = /\$2\$/g;
			
			switch (n) {
			case 1:
				this.q = {
					question: 'At a T intersection, you are the $1$ car turning right, the $2$ car is turning right.<br/><br/>Do you give way?'.replace(r1, c1).replace(r2, c2),
					info: 'Cars at the top of a T intersection have right of way.',
					options: {
						go: '',
						giveway: 'Give way to the $2$ car.'.replace(r2, c2),
						stop: '',
						turntopleft: '',
						turntopright: 'Turn. I have the right of way.',
						turnbotleft: '',
						turnbotright: ''
					},
					optionCoords: [], // this will be filled out later by the cleaner.
					sideroad: true,
					roadtype: 'whitedashed',
					cars: {
						first: {
							display: true,
							x: 150,
							y: 150,
							orient: 'left',
							blink: 'right'
						},
						second: {
							display: true,
							x: 20,
							y: 250,
							orient: 'up',
							blink: 'right'
						},
						explode: {
							x: 0,
							y: 0
						}
					},
					section: 'Overtaking and<br/>Give Way',
					correct: 1,
					link: 'http://www.nzta.govt.nz/resources/roadcode/about-driving/the-give-way-rules.html'
				};
				break;
			case 2:
				this.q = {
					question: 'You, the $1$ car, are overtaking the $2$ car.<br/><br/>What does the dashed yellow line mean?'.replace(r1, c1).replace(r2, c2),
					info: "You can only cross the dashed yellow line to finish passing.",
					options: {
						go: 'I am comming to a solid yellow line.',
						stop: "Its dangerous to cross, no-matter what.",
						giveway: 'I can only cross back to the left.'
					},
					optionCoords: [],
					sideroad: false,
					roadtype: 'yellowdashed',
					cars: {
						first: {
							display: true,
							x: 65,
							y: 240,
							orient: '',
							blink: ''
						},
						second: {
							display: true,
							x: 0,
							y: 300,
							orient: '',
							blink: ''
						},
						explode: {
							x: -60,
							y: 120
						}
					},
					section: 'Road Markings',
					correct: 3,
					link: 'http://www.nzta.govt.nz/resources/roadcode/about-driving/passing.html'
				};
				break;
			case 3:
				this.q = {
					question: 'Both you (the $1$ car) and the $2$ car are turning into a side road.<br/><br/>Who gives way?'.replace(r2, c2).replace(r1,c1),
					info: 'Vehicles turning right give way to those turning left.',
					options: {
						go:'Whoever gets there last gives way.',
						giveway: 'I have to give way to the $2$ car.'.replace(r2,c2),
						turntopright: 'The $2$ car gives way to me.'.replace(r2,c2)
					},
					optionCoords: [],
					sideroad: true,
					roadtype: 'whitedashed',
					cars: {
						first: {
							display: true,
							x: 20,
							y: 240,
							orient: '',
							blink: 'right'
						},
						second: {
							display: true,
							x: 65,
							y: 20,
							orient:'down',
							blink: 'left'
						},
						explode: {
							x: -60,
							y: 120
						}
					},
					section: 'Overtaking and<br/>Give Way',
					correct: 2,
					link: 'http://www.nzta.govt.nz/resources/roadcode/about-driving/the-give-way-rules.html'
				};
				break;
			case 4:
				this.q = {
					question: 'You are driving along an empty road and need to make a U-turn.<br/><br/>Can you legally make a U-turn on this road?',
					info: 'As long as there is no "No U-turn" sign, and its safe, you can make a U-turn.',
					options: {
						turntopright: 'Yes, I can make a U-turn.',
						stop: 'No, I can only U-turn in a dead end street.'
					},
					optionCoords: [],
					sideroad: false,
					roadtype: 'whitedashed',
					cars: {
						first: {
							display: true,
							x: 0,
							y: 240,
							orient: '',
							blink: ''
						},
						second: {
							display: false,
							x: 0,
							y: 0,
							orient: '',
							blink: ''
						},
						explode: {
							x: -60,
							y: 120
						}
					},
					section: 'Signs and<br/>Parking',
					correct: 1,
					link: 'http://www.nzta.govt.nz/resources/roadcode/about-driving/turning.html'
				};
				break;
			case 5:
				this.q = {
					question: 'You are overtaking the $2$ car, in your $1$ car, through an intersection.<br/><br/>Is this legal?'.replace(r2,c2).replace(r1,c1),
					info: 'Only if passing the $2$ car means you cross the center line its illegal.'.replace(r2,c2),
					options: {
						go: 'Yes, its legal to overtake here.',
						giveway: "Yes, as long as I don't pass the center line.",
						stop: 'No, its illegal.'
					},
					optionCoords: [],
					sideroad: true,
					roadtype: 'whitedashed',
					cars: {
						first: {
							display: true,
							x: 65,
							y: 190,
							orient: '',
							blink: ''
						},
						second: {
							display: true,
							x: 0,
							y: 250,
							orient: '',
							blink: ''
						},
						explode: {
							x: -60,
							y: 120
						}
					},
					section: 'Overtaking and<br/>Give Way',
					correct: 2,
					link: 'http://www.nzta.govt.nz/resources/roadcode/about-driving/passing.html'
				};
				break;
			default:
				// Default if out of range
				this.getData(1);
			}
		},
		
		//works out missing data and disposes of non used
		cleanData : function () {
			'use strict';
			
			// Get options if defined. Else 
			var op = this.q.options, nop = [], f = [], i = 0;
			
			// Add options with content to array
			for (i in op) {
				if (op.hasOwnProperty(i) && op[i] !== '') {
					nop.push(op[i]);
					
					// Find symbol corrds
					switch (i) {
					default:
						console.error('ObjectError: Unable to read object "data.q"');
					case 'go':
						f.push('60% 100%');
						break;
					case 'giveway':
						f.push('60% 0%');
						break;
					case 'stop':
						f.push('40% 100%');
						break;
					case 'turntopleft':
						f.push('100% 0%');
						break;
					case 'turntopright':
						f.push('80% 0%');
						break;
					case 'turnbotleft':
						f.push('100% 100%');
						break;
					case 'turnbotright':
						f.push('80% 100%');
						break;
					}
				}
			}
			
			// Set the origonal object
			this.q.options = nop;
			this.q.optionCoords = f;
		}
	},
	animate = { //animations
		/**
		 * @param - bc & gc - elements
		 * @endfunc - function - called on ending
		 */
		zoom : function (bc, gc, endfunc) {
			'use strict';
			
			// Set styles to prevent attributes becoming unreadable (bug fix)
			bc.top = gc.bottom = '100px';
			
			// Create interval
			var cont = 0,
				fade = 1,
				n = setInterval(function () {
					
					// Change styles about amounts
					gc.bottom = parseInt(gc.bottom, 10) + 12 + 'px';
					bc.top = parseInt(bc.top, 10) + -12 + 'px';
					
					// Fade - not supported in IE < 9
					gc.opacity = bc.opacity = fade -= 0.02;
					
					// Track frame rate and fade
					cont += 1;
					
					// When complete
					if (cont >= 50) {
						
						// End the interval
						clearInterval(n);
						
						// Execute ending function
						if (typeof endfunc === 'function') {
							(endfunc());
						}
					}
				// One frame per 20 ms
				}, 20);
		},
		
		/**
		 * @param - r - element
		 * @endfunc - function - called on ending
		 */
		slide : function (r, endfunc) {
			'use strict';
		
			var cont = 0,
				dir = (parseInt(r.width, 10) === 240) ? 5.25 : -5,
				n = setInterval(function () {
					
					// Change style about amounts
					r.width = parseInt(r.width, 10) + dir + 'px';
					
					// Track frame rate
					cont += 1;
					
					// When complete
					if (cont >= 40) {
						
						// End the interval
						clearInterval(n);
						
						// Execute ending function
						if (typeof endfunc === 'function') {
							(endfunc());
						}
					}
				}, 20);
		}
	},
	explode = { //explode gif
		explode : '',
		now : function (e) { // Set the explode gif at coords
			'use strict';
			
			this.explode.style.top = e.y + 'px';
			this.explode.style.left = e.x + 'px';
			this.explode.style.backgroundImage = 'url(images/explode-01.gif)';
			this.explode.style.zIndex = 100;
		},
		clear : function () { // Hide the explode gif
			'use strict';
			
			this.explode.style.top = 'auto';
			this.explode.style.left = 'auto';
			this.explode.style.backgroundImage = '';
			this.explode.style.zIndex = '';
		}
	},
	prog = { // Progress bar
		number : '',
		bar : '',
		count : 0,
		add : function () { // Incriment by one
			'use strict';
			
			this.count += 1;
			setStrContent(this.number, this.count);
			var m = (this.count / total) * 100;
			this.bar.style.width = m < 99 ? m + '%' : '99%';
		},
		hide : function () {
			'use strict';
			
			this.bar.style.display = 'none';
		},
		show : function () {
			'use strict';
			
			this.bar.style.display = '';
		}
	},
	car = { // Green and blue cars
		b : '',
		g : '',
		cut : function () { // remove links from cars
			'use strict';
			
			this.b.removeAttribute('onclick');
			this.g.removeAttribute('onclick');
			this.b.removeAttribute('href');
			this.g.removeAttribute('href');
		},
		loadPositions : function () { // load car position from data object
			'use strict';
			
			var b = cColor === 'blue' ? data.q.cars.first : data.q.cars.second,
				g = cColor === 'green' ? data.q.cars.first : data.q.cars.second,
				bc = this.b,
				gc = this.g;
			
			// If we are showing the BLUE car.
			if (b.display === true) {
				
				// Make visible.
				bc.style.display = '';
				bc.style.opacity = 1;
				
				// Position
				bc.style.top = b.y + 'px';
				bc.style.left = b.x + 'px';
				
				if (!ie_lt9) {
					// Rotation
					bc.className = (b.orient !== '') ? 'rotatetoface' + b.orient : '';
					
					// Blinkers
					bc.style.backgroundImage = (b.blink !== '') ? 'url(images/blinkerlight-' + b.blink + '.gif), url(images/cars.png), url(images/blinkerglow-' + b.blink + '.gif)' : bc.style.backgroundImage = 'url(images/cars.png)';
				} else {
					if (b.orient === 'right' || b.orient === 'left') {
						//if sideways
						bc.style.backgroundImage = 'url(images/ieOnly/cars-tf' + b.orient[0] + '.png)';
						bc.style.marginTop = '30px';
						bc.style.marginLeft = '-30px';
						bc.style.width = '110px';
						bc.style.height = '60px';
						bc.style.backgroundPositionY = '100%';
					} else {
						//if longways
						bc.style.marginTop = '';
						bc.style.marginLeft = '';
						bc.style.width = '60px';
						bc.style.height = '110px';
						bc.style.backgroundPositionY = '0%';
						bc.style.backgroundImage = 'url(images/cars.png)';
					}
				}
			}
			else {
				bc.style.display = 'none';
			}
			
			// If we are showing the GREEN car.
			if (g.display === true) {
				
				// Make visible.
				gc.style.display = '';
				gc.style.opacity = 1;
				
				// Position
				gc.style.top = g.y + 'px';
				gc.style.left = g.x + 'px';
				gc.style.bottom = 'auto';
				
				if (!ie_lt9) {
					// Rotation
					gc.className = (g.orient !== '') ? 'rotatetoface' + g.orient : '';
				
					// Blink
					gc.style.backgroundImage = (g.blink !== '') ? 'url(images/blinkerlight-' + g.blink + '.gif), url(images/cars.png), url(images/blinkerglow-' + g.blink + '.gif)' : gc.style.backgroundImage = 'url(images/cars.png)';
				} else {
					if (g.orient === 'right' || g.orient === 'left') {
						//if sideays
						gc.style.backgroundImage = 'url(images/ieOnly/cars-tf' + g.orient[0] + '.png)';
						gc.style.marginTop = '30px';
						gc.style.marginLeft = '-30px';
						gc.style.width = '110px';
						gc.style.height = '60px';
					} else {
						//if longways
						gc.style.marginTop = '';
						gc.style.marginLeft = '';
						gc.style.width = '60px';
						gc.style.height = '110px';
						gc.style.backgroundImage = 'url(images/cars.png)';
						gc.style.backgroundPositionX = '';
						if (g.orient === 'down') { //swap sides when down
							gc.style.backgroundImage = 'url(images/ieOnly/cars-tfd.png)';
							gc.style.backgroundPositionX =  '0%';
						}
					}
				}
			}
			else {
				gc.style.display = 'none';
			}
		},
		loadDefaults : function () { // set cars to defult apareance
			'use strict';
			
			var bc = this.b.style,
				gc = this.g.style;
			
			//default styles
			bc.display = gc.display = '';
			bc.opacity = gc.opacity = 1;
			gc.marginTop = bc.marginTop = '';
			gc.marginLeft = bc.marginLeft = '';
			gc.width = bc.width = '60px';
			gc.height = bc.height = '110px';
			bc.backgroundPositionY = '0%';
			gc.backgroundPositionX = '';
			
			//positions
			bc.left = '0';
			bc.right = 'auto';
			bc.top = '100px';
			
			gc.right = 'auto';
			gc.left = '65px';
			gc.bottom = '100px';
			gc.top = 'auto';
			
			//classes and images
			this.b.className = this.g.className = '';
			bc.backgroundImage = gc.backgroundImage = 'url(images/cars.png)';
		}
	},
	doc = { // Elements namespace so we don't polution the global scope
		l : '',
		r : '',
		heading : '',
		midheadings : '',
		subheading : '',
		question : '',
		road : '',
		main : '',
		notsure : '',
		prmpt : '',
		answers : '',
		qmark : '',
		final : '',
		finalText : '',
		opt : {
			one : '',
			two : '',
			three : ''
		},
		pic : {
			one : '',
			two : '',
			three : ''
		}
	},
	//css to be added later
	css = {
		answers : 'section ul {height:128px;margin:0; padding:0; background-color:#79db75; position:relative;top:0;bottom:0;float:right;} section ul li { list-style:none; width:32px; height:32px; margin:8px; padding:0; } section ul li div { position:absolute; margin-left:-248px; width:240px; height:120px; background-color:#f2f2f2; display:none; font-size:24px; } section ul li div span, section ul li div p{ display:table-cell; vertical-align:middle; padding:10px; padding-left:20px; } section ul li a:hover ~ div { display:table; }section ul li section {margin-top:-84px; position:absolute; margin-left:-248px; width:240px; height:120px; background-color:#f2f2f2; font-size:24px; display:table;z-index:-1;} section ul li section span {display:table-cell; vertical-align:middle; padding:10px; padding-left:20px; color:silver;} #final{display:none}',
		results : '#table div,#table-head{margin:5px;padding:7px;background-color:#f2f2f2}#table-head{background-color:#79db75;font-weight:700;margin-bottom:10px;font-size:18px}#table div a{float:right;width:32px;height:32px;line-height:32px;text-align:center;margin:-7px;text-decoration:none;color:#000;font-size:20px;font-family:monospace "courier"}#table div span{margin-right:10px}#restart{color:#000}#restart:hover{color:#fff}'
	},
	
	page = { // Page munipulation
		record : [],
		enterData : function () { // Enter data from data.q object
			'use strict';
			setStrContent(doc.subheading, data.q.section);
			setStrContent(doc.question, data.q.question);
			setStrContent(doc.opt.one.children[0], data.q.options[0]);
			setStrContent(doc.opt.two.children[0], data.q.options[1]);
			doc.pic.one.style.backgroundPosition = data.q.optionCoords[0];
			doc.pic.two.style.backgroundPosition = data.q.optionCoords[1];
			if (data.q.options[2] !== undefined) { // optional third option
				setStrContent(doc.opt.three.children[0], data.q.options[2]);
				doc.pic.three.style.backgroundPosition = data.q.optionCoords[2];
				doc.pic.three.style.display = 'block';
			} else {
				doc.pic.three.style.display = 'none';
			}
			doc.road.className = (data.q.sideroad === true) ? 'rd' : ''; // optional road
			doc.main.style.backgroundImage = (data.q.roadtype === 'whitedashed') ? 'url("images/road-01.png")' : 'url("images/road_yellow.png")'; // road type
			
			// Reset
			doc.qmark.style.backgroundPosition = '20% 100%';
			doc.final.style.display = '';
			doc.opt.one.style.display = doc.opt.two.style.display = doc.opt.three.style.display = '';
			doc.opt.one.style.zIndex = doc.opt.two.style.zIndex = doc.opt.three.style.zIndex = '';
		},
		
		clearForResults : function () { // clear left and right sides
			'use strict';
			
			removeChildren(doc.l);
			removeChildren(doc.r);
			
			doc.main.style.backgroundImage =  'url("images/road-01.png")'; //reset back to whitedashed
		},
		loadResults : function () { // Build elements and input results from page.record object for the results
			'use strict';
			// Create DOM elements
			var style = cre('style', null),
				quest = cre('span', 'Question'),
				head = cre('div', [
					quest,
					cre('span', 'Result')
				]),
				table = cre('div', null),
				i = 0,
				j = 0,
				correct = (function () { //how many out of the total correct
					// Count the score
					
					var count = 0;
					for (j; j < page.record.length; j += 1) {
						if (page.record[j].answerType === 'correct') {
							count += 1;
						}
					}
					return count;
				})(),
				lbSpan = cre('span', (correct + '/' + page.record.length)),
				resrt = cre('a', 'Again?'),
				pusher = cre('div', null),
				label = cre('h1', [
					lbSpan,
					resrt
				]),
				bottom = cre('div', [
					pusher,
					label
				]);
				
			// For each row appended to table element
			for (i; i < page.record.length; i += 1) {
				
				var color = page.record[i].answerType === 'correct' ? '#79db75' : (page.record[i].answerType === 'incorrect' ? 'red' : 'silver'),
					question = (page.record[i].question.length > 36) ? page.record[i].question.substr(0, 36) + '..' : page.record[i].question,
					row = cre('div', null),
					lnk = cre('a', 'i');
				
				setStrContent(row, "<em style='margin-right:20px;'>" + page.record[i].answerType + '</em>');
				
				var firstl = cre('span', (i + 1).toString()),
					secondl = cre('span', question);
			
				row.appendChild(firstl);
				row.appendChild(secondl);
				row.appendChild(lnk);
				
				// Append to table
				table.appendChild(row);
				att(firstl, {'style':'float:left; border-right:solid 1px ' + color + '; width:20px; padding-right:5px;'});
				att(secondl, {'style':'float:left; color:silver;'});
				att(lnk, {'style':'background-color:' + color,'href': (page.record[i].link !== undefined) ? (page.record[i].link) : 'resources.html','target': '_blank'});
			}
			// Append all elements to leftside
			doc.l.appendChild(style);
			doc.l.appendChild(head);
			doc.l.appendChild(table);
			doc.l.appendChild(bottom);
			doc.l.style.width = null;//'510px'; I changed this to null so that it can be changed in print-results.css
			// Fix IE (must be asigned after appending)
			att(style, {'type': 'text/css'});
			att(head, {'id': 'table-head'});
			att(table, {'id': 'table'});
			att(quest, {'style': 'float:left'});
			att(label, {'class': 'botleftlabel mainheading _botlabel1','style': 'margin:0;'});
			att(lbSpan, {'style': 'float:left;margin:0;padding:0;margin-left:16px;'});
			att(resrt, {'id': 'restart','style': 'text-decoration:none;','href': 'index.html'});
			att(bottom, {'style': 'height:148px;', 'id': 'bottomLine'});
			att(pusher, {'style': 'height:50%; background-color:transparent;'});
			
			setStyleContent(style, css.results);
		}
	};

////	EVENT MANAGMENT
// triggered from index.html

window.onload = function () { //load elements
	'use strict';
	
	car.b = e('blue_car');
	car.g = e('green_car');
	doc.l = e('left_side');
	doc.r = e('road_side');
	doc.heading = e('h');
	doc.midheadings = e('midleftlabels');
	doc.subheading = e('botleftlabel');
	doc.question = e('q');
	doc.main = e('road_01');
	doc.road = e('road_02');
	doc.notsure = e('notSure');
	doc.prmpt = e('prompt');
	doc.answers = e('insert_answers');
	doc.qmark = e('qmark');
	doc.final = e('final');
	doc.finalText = e('final-text');
	explode.explode = e('explode');
	doc.opt.one = e('a_one');
	doc.opt.two = e('a_two');
	doc.opt.three = e('a_three');
	doc.pic.one = e('pic_one');
	doc.pic.two = e('pic_two');
	doc.pic.three = e('pic_three');
	prog.number = e('progval');
	prog.bar = e('prog');
	prog.hide();
};
function onStartTest(colour) { //on first clicking a car
	'use strict';
	
	// Set the car colour based on input
	cColor = 'blue' === colour ? 'blue' : 'green';
	car.cut();
	
	// 1. Move cars to zoom away
	animate.zoom(car.b.style, car.g.style, function () {
		// On end of animation
		
		// Reset and make invidable the car elements
		car.b.style.top = car.g.style.bottom = '100px';
		car.g.style.display = car.b.style.display = doc.l.style.display = 'none';
		
		// 2. Slide road to middle
		animate.slide(doc.r.style, function () {
			
			// Set width and make appear
			doc.l.style.width = '300px';
			doc.l.style.display = '';
			
			// Set left side of page
			doc.subheading.className = 'subheading _botlabel2';
			doc.subheading.innerHTML = 'title';
			doc.question.className = '_q';
			doc.midheadings.style.display = 'none';
			
			// We need this to still hold space.
			doc.heading.style.visibility = 'hidden';
			
			// Set right side of page
			doc.notsure.innerHTML = 'Not sure&#63;';
			doc.prmpt.innerHTML = 'Click a symbol to answer.';
			if (data.q.sideroad === true) {
				doc.road.className = 'rd';
			}
			
			setStyleContent(doc.answers, css.answers);
			car.loadPositions();
			page.enterData();
		});
	});
	
	// Get data - this happens before the code above.
	data.getData(data.getNumber());
	data.cleanData();
	prog.show();
	prog.add();
}
function onOptionClick(n) { //when option or next arrow is clicked
	'use strict';
	
	// Don't change your answer
	if (doneClick && n !== 0) {
		return;
	} else if (doneClick) {
		//if moving to next
		doneClick = false;
		
		var a = data.getNumber(); //this tells us if we ar eon the last question or not and finds us a new number
		
		if (a === 'end') {
			// That was the last question, load results
			prog.hide();
			page.clearForResults();
			car.loadDefaults();
			explode.clear();
			animate.slide(doc.r.style, function () {
				page.loadResults();
			});
		} else {
			// Load new question
			data.getData(a);
			data.cleanData();
			page.enterData();
			car.loadPositions();
			prog.add();
			explode.clear();
		}
		return;
	} else {
		//else wwe have selected an option or are unsure
		doneClick = true;
	}
	
	// Display answer is correct
	
	var opt,c = n === data.q.correct;
	
	// Show answer
	doc.final.style.display = 'table';
	setStrContent(doc.finalText, c ? '<em style="color:#589f55">Correct!</em> ' + data.q.info : (n === 0 ? 'Remember. ' + data.q.info : '<em style="color:red">Oops!</em> ' + data.q.info));
	
	// Show correct option
	if (n === 1) {
		opt = doc.opt.one;
	} else if (n === 2) {
		opt = doc.opt.two;
	} else if (n === 3) {
		opt = doc.opt.three;
	} else {
		if (data.q.correct === 1) {
			opt = doc.opt.one;
		} else if (data.q.correct === 2) {
			opt = doc.opt.two;
		} else {
			opt = doc.opt.three;
		}
	}
	opt.style.display = 'table';
	opt.style.zIndex = '1';
	
	// Explode if incorrect
	if (!c && n !== 0) {
		explode.now(data.q.cars.explode);
	}
	
	// Chnage to arrow
	doc.qmark.style.backgroundPosition = '0% 100%';
	
	// Record Answer
	page.record.push({
		answerType : n === 0 ? 'unsure' : (c ? 'correct' : 'incorrect'),
		question : data.q.question,
		link : data.q.link
	});
}