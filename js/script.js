// Compatibility

document.getElementsByClassName = document.getElementsByClassName || function(c){return document.querySelectorAll('.'+c)}
var requestAnimationFramePolyfill = window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(callback){setTimeout(callback, 17);};

function onload(callback) {
  if (document.readyState != 'loading'){
    callback();
  } else if (typeof document.addEventListener === "function") {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    document.attachEvent('onreadystatechange', function() {
      if (document.readyState != 'loading')
        callback();
    });
  }
}

// Thanks to https://github.com/Financial-Times/polyfill-library/tree/master/polyfills/Element/prototype/dataset

var datasetSupport = (function(){
	if (!document.documentElement.dataset) {
		return false;
	}
	var el = document.createElement('div');
	el.setAttribute("data-a-b", "c");
	return el.dataset && el.dataset.aB == "c";
}());

if (!datasetSupport) {
  Object.defineProperty(Element.prototype, 'dataset', {
  	get: function() {
  		var element = this;
  		var attributes = this.attributes;
  		var map = {};

  		for (var i = 0; i < attributes.length; i++) {
  			var attribute = attributes[i];

  			if (attribute && attribute.name && (/^data-\w[\w\-]*$/).test(attribute.name)) {
  				var name = attribute.name;
  				var value = attribute.value;

  				var propName = name.substr(5).replace(/-./g, function (prop) {
  					return prop.charAt(1).toUpperCase();
  				});

  				Object.defineProperty(map, propName, {
  					enumerable: true,
  					get: function() {
  						return this.value;
  					}.bind({value: value || ''}),
  					set: function setter(name, value) {
  						if (typeof value !== 'undefined') {
  							this.setAttribute(name, value);
  						} else {
  							this.removeAttribute(name);
  						}
  					}.bind(element, name)
  				});
  			}
  		}

  		return map;
  	}
  });
}

// Thanks to http://detectmobilebrowsers.com/
var isMobileDevice = (function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
})();

if (isMobileDevice) {
  document.body.classList.add('mobile');
}

// VAR INIT
var app = document.getElementsByClassName('app')[0];

function defer(func, wait) {
  var args = Array.prototype.slice.call(arguments, 2);
  return setTimeout(function(){ return func.apply(null, args); }, wait);
}

var sections = {
  nodeList: document.getElementsByClassName('section'),
  lazy: document.getElementsByTagName('img'),
  actual: 0,
  right: 'right',
  left: 'left',
  forceMoving: false,
  actualise: function() {
    character.sectionTransition();

    for (var i = 0; i < sections.lazy.length; i++) {
      if (sections.lazy[i].dataset.load == sections.actual) {
        sections.lazy[i].src = sections.lazy[i].dataset.lazy;
        sections.lazy[i].dataset.load = 'loaded';
      }
    }

    for (var i = 0; i < sections.nodeList.length; i++) {
      if (sections.actual == i) {
        sections.nodeList[i].classList.add('active');
      }else{
        if (sections.nodeList[i].classList.contains('active')) {
          sections.nodeList[i].classList.remove('active');
        }
      }
    }

    if (typeof window.scrollTo === 'function') {
      window.scrollTo(0, 0);
    }

    character.moving = true;
    setTimeout(character.setTransition, 32);
  },
  move: function(d) {
    if(d === sections.right){
      sections.actual = (sections.actual >= sections.nodeList.length-1)? 0 : sections.actual+1;
    }
    else if(d === sections.left){
      sections.actual = (sections.actual <= 0)? sections.nodeList.length-1 : sections.actual-1;
    }
    if (sections.forceMoving) {
      setTimeout(sections.forceMove.reset, 500);
    }
    sections.actualise();
  },
  forceMove: {
    right: function(){
      sections.forceMoving = true;
      control.right = true;
    },
    left: function(){
      sections.forceMoving = true;
      control.left = true;
    },
    reset: function(){
      if (sections.forceMoving) {
        control.reset();
        sections.forceMoving = false;
      }
    },
  }
};

var character = {
  node: document.getElementsByClassName('character')[0],
  pos: {x: 50, y: 0},
  speed: {x: 0.7, y: 25},
  direction: "left",
  moving: false,
  jumping: false,
  inFrame: false,
  jumpDelay: 150,
  setTransition: function(){
    character.node.classList.add('transition');
  },
  sectionTransition: function(){
    if (character.node.classList.contains('transition')) {
      character.node.classList.remove('transition');
    }
  },
  frame: function(params){
    if (!params.hasOwnProperty('classname') || !params.hasOwnProperty('delay')) {
      throw new Error('Frame property is missing some required parameters.');
    }
    if (!params.hasOwnProperty('iteration')) {
      params.iteration = 0;
    }
    if (!params.hasOwnProperty('separator')) {
      params.separator = '-';
    }

    if (!character.inFrame) {
      character.inFrame = true;
      for (var i = 0; i <= params.iteration; i++) {

        var formatted_classname = params.classname+((i !== 0)? (params.separator+i) : '');

        defer(function(formatted_classname, _i, iteration){
          character.node.classList.add(formatted_classname);

          defer(function(formatted_classname, _i, iteration){
            if (character.node.classList.contains(formatted_classname)) {
              character.node.classList.remove(formatted_classname);
            }
            if (_i===iteration) {
              character.inFrame = false;
            }
          }, params.delay, formatted_classname, _i, iteration);

        }, params.delay*i, formatted_classname, i, params.iteration);
      }
    }

  },
  moveFrame: function(){
    character.frame({
      classname: 'walk',
      iteration: 8,
      delay: 50
    });
  },
  jumpFrame: function(){
    character.frame({
      classname: 'walk',
      iteration: 2,
      delay: character.jumpDelay/2
    });
  },
  paint: function(){
    if (character.moving) {
      character.node.style.left = character.pos.x + "%";
      if (!character.jumping) {
        character.moveFrame();
      }
      character.moving = false;
    }

    if (character.jumping) {
      character.node.style.bottom = character.pos.y + "%";
      character.jumpFrame();
    }
  },
  orientation : function(d){
    if (d !== "left" && d !== "right") {
      return;
    }
    if (character.direction !== d) {
      character.direction = d;
      var oppositeDirection = (d == "left")? "right" : "left";
      if (character.node.classList.contains('direction--'+oppositeDirection)) {
        character.node.classList.remove('direction--'+oppositeDirection);
      }
      character.node.classList.add('direction--'+character.direction);
    }
  },
  move : {
    right: function(){
      character.moving = true;
      character.orientation("right");
      character.pos.x += character.speed.x;
      character.checkPosition();
    },
    left: function(){
      character.moving = true;
      character.orientation("left");
      character.pos.x -= character.speed.x;
      character.checkPosition();
    },
    up: function(){
      if (!character.jumping) {
        character.jumping = true;
        character.pos.y += character.speed.y;
        setTimeout(function(){
          character.pos.y -= character.speed.y;
          setTimeout(function(){
            character.jumping = false;
          },character.jumpDelay);
        },character.jumpDelay);
      }
    }
  },
  checkPosition: function(){
    if(character.pos.x > 97.5){
      sections.move(sections.right);
      character.pos.x = 2.5;
    }else if(character.pos.x < 2.5){
      sections.move(sections.left);
      character.pos.x = 97.5;
    }
  }
};

var control = {
  up : false,
  left: false,
  down: false,
  right: false,
  reset: function(){
    control.up = false;
    control.left = false;
    control.down = false;
    control.right = false;
  }
};

// Init

if (isMobileDevice) {
  var requestFrame = function(callback){
    setTimeout(callback, 160);
  };
  character.speed.x = 5;
}else{
  var requestFrame = requestAnimationFramePolyfill;
}

character.setTransition();

// Functions

function keyboardManager(k, b) {
  switch (k) {
      case "ArrowLeft":
      case "KeyA":
      case "KeyH":
      case "q":
      case "h":
        control.left = b;
      break;
      case "ArrowRight":
      case "KeyD":
      case "KeyL":
      case "d":
      case "l":
        control.right = b;
      break;
      case "ArrowUp":
      case "KeyW":
      case "Spacebar":
      case "KeyK":
      case "z":
      case " ":
      case "k":
        control.up = b;
      break;
      case "ArrowDown":
      case "KeyS":
      case "KeyJ":
      case "s":
      case "j":
        control.down = b;
      break;
      default:
  }
}

// Event

document.getElementsByClassName('doorL')[0].onclick = function() {
  sections.forceMove.left();
};
document.getElementsByClassName('doorR')[0].onclick = function() {
  sections.forceMove.right();
};

window.onscroll = function(e){
  if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
    app.classList.add('shrink');
  } else {
    if (app.classList.contains('shrink')) {
      app.classList.remove('shrink');
    }
  }
}

// Mapping

window.onkeydown = function(e) {
    e.key = e.key || e.code;
    keyboardManager(e.key, true);
};

window.onkeyup = function(e) {
    e.key = e.key || e.code;
    keyboardManager(e.key, false);
};

// Gameloop

function gameloop(){
  if (control.left && control.right) {
    control.reset();
  }

  if (control.left) {
    character.move.left();
  }

  if (control.up) {
    character.move.up();
  }

  if (control.right) {
    character.move.right();
  }

  if (control.down) {
    // character.move.down();
  }

  character.paint();

  requestFrame(gameloop);
}

gameloop();

// Miscellaneous

function fade(type, target, duration) {
  duration = duration || 400;
  if (typeof duration !== 'number') {
    throw new Error("Third parameter type of fade() must be a number. '" + duration + "' received.");
  }
	if (type !== 'in' && type !== 'out') {
    throw new Error("First parameter of fade() must be 'in' or 'out'. '" + type + "' received.");
	}
  var opacity = (type === 'in')? 0 : 1;
  var goal = (type === 'in')? 1 : 0;

  if(type === 'in'){
    target.style.display = '';
  }

  target.style.opacity = opacity;
  target.style.filter = '';

  var last = new Date();
  var now = last;
  function frame() {
    now = new Date();
    if (type === 'in') {
      opacity += (now - last) / duration;
    }else{
      opacity -= (now - last) / duration;
    }

    target.style.opacity = opacity;
    target.style.filter = 'alpha(opacity=' + (100 * opacity)|0 + ')';

    last = now;

    if ((type === 'in' && opacity < goal) || (type === 'out' && opacity > goal)) {
      requestAnimationFramePolyfill(frame);
    }else if (type === 'out') {
        target.style.display = 'none';
    }
  };

  frame();
}

var subtitle = document.getElementById('dynamic-subtitle');
var actualSubtitles;
var subtitles = [
  [
    'a web developper',
    'a mad scientist    !',
    'not afraid of challenges',
    'let\'s be authentic',
    'Keep It Simple & Stupid',
  ],
  [
    'don\'t forget you can move',
    'i took an arrow in the knee',
    'little sis, stops playing',
    'todo: put a subtitle',
  ]
];

var last, actual;

function randomKeyFromIterable(a) {
  return Math.floor(Math.random()*a.length);
}

function changeSubtitles(index){
  if (typeof index !== 'number') {
    index = randomKeyFromIterable(subtitles);
  }
  actualSubtitles = subtitles[index];
  subtitles.splice(index, 1);
  if (subtitles.length > 0) {
    setTimeout(changeSubtitles, 120000);
  }
}

function changeSubtitle(index) {
  if (typeof actualSubtitles === 'undefined') {
    changeSubtitles(0);
  }
  if (typeof index !== 'number') {
    do {
      actual = randomKeyFromIterable(actualSubtitles);
    } while (last === actual);
  }else{
    actual = index;
  }
  wrote(subtitle, actualSubtitles[actual], changeSubtitle);
  last = actual;
}

function wrote(target, text, callback, i){
  i = i || 1;
  if (i <= text.length) {
   target.innerHTML = text.substring(0, i);
    setTimeout(function() {
      wrote(target, text, callback, i + 1)
    }, 50+150*Math.random());
  }else if (typeof callback === 'function') {
    setTimeout(callback, 2500);
  }
}

changeSubtitle(0);

// On load

var start = Date.now();

onload(function(){
  var elapsed_time = Date.now() - start;
  var delay = elapsed_time >= 300 ? 0 : 300 - elapsed_time;

  setTimeout(function(){
    fade('out',document.getElementById('preloader'));
  }, delay);
});

setTimeout(function () {
  fade('out',document.getElementById('preloader')); // max time to show loader
}, 1000);
