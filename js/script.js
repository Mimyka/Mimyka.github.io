// Compatibility
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {callback();};

// VAR INIT
var mainSections = document.getElementsByClassName('section');
var sections = {
  nodeList: mainSections,
  actual: 0,
  right: -1,
  left: 1,
  timeout: [],
  actualise: function() {
    for (var i = 0; i < sections.nodeList.length; i++) {
      if (sections.actual == i) {
        sections.nodeList[i].classList.add('active');
      }else{
        if (sections.nodeList[i].classList.contains('active')) {
          sections.nodeList[i].classList.remove('active');
        }
      }
    }
  },
  move: function(d) {
    if(d === this.right){
      sections.actual = (sections.actual >= sections.nodeList.length-1)? 0 : sections.actual+1;
    }
    else if(d === this.left){
      sections.actual = (sections.actual <= 0)? sections.nodeList.length-1 : sections.actual-1;
    }
    document.getElementsByClassName('app')[sections.actual].appendChild(character.target);

    sections.actualise();
  },
  forceMove: function(d, w) {
    w = (d < 0)? character.speed : -character.speed;
    sections.clearAllEvent();
    for (var i = 0; i < (100/character.speed); i++) {
      sections.timeout.push(setTimeout(function() {
        character.move(w);
      }, i*cfg.keyDelay));
    }
  },
  clearAllEvent: function() {
    for (var i = 0; i < sections.timeout.length; i++) {
      window.clearTimeout(sections.timeout[i]);
    }
  }
};

var cfg = {
  keyDelay: 100
};

var character = {
  pos: 50,
  direction: "left",
  speed: 4,
  moving: false,
  jumping: false,
  jumpPotential: 25,
  target: document.getElementsByClassName("character")[0],
  inMoveFrame: false,
  moveFrame: function(){
    if (!character.inMoveFrame) {
      character.inMoveFrame = true;
      character.target.src = "./img/characterMove1.png";
      setTimeout(function() {
        character.target.src = "./img/characterMove2.png";
      }, (cfg.keyDelay));
      setTimeout(function() {
        character.target.src = "./img/character.png";
        character.inMoveFrame = false;
      }, (cfg.keyDelay*2));
    }
  },
  paint: function(){
    if (character.moving) {
      character.target.style.transform = (character.direction == "right")? "translateX(-50%)" : "translateX(-50%) rotateY(180deg)";
      character.target.style.left = character.pos + "%";
      character.moveFrame();

      character.moving = false;
    }
  },
  move: function(speed) {
    character.moving = true;
    character.direction = (speed < 0)? "right" : "left";
    character.pos += speed;
    if(character.pos >= 100){
      sections.move(sections.right);
      character.pos = character.speed;
    }else if(character.pos <= 0){
      sections.move(sections.left);
      character.pos = 100-character.speed;
    }
  },
  jump: function() {
    if (!character.jumping) {
      character.target.src = "./img/characterJump.png";
      character.target.style.bottom = character.jumpPotential + "%";
      character.jumping = true;

      setTimeout(function() {
        character.target.src = "./img/character.png";
        character.target.style.bottom = "0%";
        setTimeout(function(){
          character.jumping = false;
        },100);
      }, 150);
    }
  },
  grow: function() {
    character.target.style.height = "150px";
    character.speed = 2;
    character.jumpPotential = 5;
  },
  shrink: function() {
    character.target.style.height = "50px";
    character.speed = 6;
    character.jumpPotential = 55;
  },
  normal: function() {
    character.target.style.height = "100px";
    character.speed = 4;
    character.jumpPotential = 25;
  }
};

function Slime(target, pos) {
  var _ = this; // scope
  _.pos = pos || 10+Math.random()*80;
  _.speed = 10;
  _.moving = false;
  _.jumpPotential = 50;
  _.target = target;

  _.paint = function(){
    if (_.moving) {
      _.target.style.left = _.pos + "%";
      _.moving = false;
    }
  };

  _.move = function(speed) {
    _.moving = true;
    _.pos += speed;
    if(_.pos >= 100){
      _.pos = 100;
    }else if(_.pos <= 0){
      _.pos = 0;
    }
  };

  _.jump = function() {
    _.target.style.bottom = _.jumpPotential + "%";
    setTimeout(function() {
      _.target.style.bottom = "0%";
    }, (cfg.keyDelay/2));
  };

  _.init = function(){
    _.target.style.transition = ".15s left linear, .15s bottom linear";
    _.target.style.height  = (32+16*Math.random())+"px";
    _.target.onclick = function() {
      _.target.style.filter = "hue-rotate("+Math.random()*360+"deg)"
    }
    _.ai();
  };

  _.ai = function(){
    _.move(_.speed * (Math.random()-Math.random()));
    _.jump();

    setTimeout(_.ai,750+(Math.random()*500));
  };
}

var slime = new Slime(document.getElementsByClassName("slime")[0]);
slime.init();

sections.actualise();
character.target.style.transition = (cfg.keyDelay/1000) + "s left linear, " + (cfg.keyDelay/1000) + "s bottom linear";

// FUNCTIONS

function throttle(callback, delay) {
    var last;
    return function () {
        var now = Date.now();
        if (now >= last + delay || !last) {
          last = now;
          callback.apply(this, arguments);
        }
    };
}

// Event

for (var i = 0; i < document.getElementsByClassName('doorL').length; i++) {
  document.getElementsByClassName('doorL')[i].onclick = function() {
    sections.forceMove(90);
  }
  document.getElementsByClassName('doorR')[i].onclick = function() {
    sections.forceMove(-90);
  }
}

// Mapping

window.onkeydown = throttle(function(e) {
    switch (e.key) {
        case "ArrowLeft":
        case "q":
        case "h":
          character.move(-character.speed);
        break;
        case "ArrowRight":
        case "d":
        case "l":
          character.move(character.speed);
        break;
        case "ArrowUp":
        case "z":
        case " ":
        case "k":
          character.jump();
        break;
        case "+":
          character.grow();
        break;
        case "-":
          character.shrink();
        break;
        case "=":
          character.normal();
        break;
        default:
    }
},cfg.keyDelay);

// Limit rate 60 fps (16ms =~ 1 frame)

function gameloop(){
  character.paint();
  slime.paint();

  requestAnimationFrame(gameloop);
}

requestAnimationFrame(gameloop);
