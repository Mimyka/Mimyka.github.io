// Compatibility
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {callback();};

// VAR INIT
var mainSections = document.getElementsByClassName('section');
var sections = {
  nodeList: mainSections,
  actual: 0,
  right: -1,
  left: 1,
  forceMoving: false,
  actualise: function() {
    character.sectionTransition();
    document.getElementsByClassName('app')[sections.actual].appendChild(character.target);

    for (var i = 0; i < sections.nodeList.length; i++) {
      if (sections.actual == i) {
        sections.nodeList[i].classList.add('active');
      }else{
        if (sections.nodeList[i].classList.contains('active')) {
          sections.nodeList[i].classList.remove('active');
        }
      }
    }

    character.moving = true;
    setTimeout(character.setTransition, 16);
  },
  move: function(d) {
    if(d === this.right){
      sections.actual = (sections.actual >= sections.nodeList.length-1)? 0 : sections.actual+1;
    }
    else if(d === this.left){
      sections.actual = (sections.actual <= 0)? sections.nodeList.length-1 : sections.actual-1;
    }
    if (sections.forceMoving) {
      setTimeout(function(){
        keyboard.right = false;
        keyboard.left = false;
      },500);
    }
    sections.actualise();
  },
  forceMove: {
    right: function(){
      sections.forceMoving = true;
      keyboard.right = true;
    },
    left: function(){
      sections.forceMoving = true;
      keyboard.left = true;
    },
  },
};

var character = {
  pos: 50.0,
  direction: "left",
  speed: 0.7,
  moving: false,
  jumping: false,
  jumpPotential: 25,
  target: document.getElementsByClassName("character")[0],
  inMoveFrame: false,
  setTransition: function(){
    character.target.style.transition = "0.15s left linear, 0.15s bottom linear";
  },
  sectionTransition: function(){
    character.target.style.transition = "";
  },
  moveFrame: function(){
    if (!character.inMoveFrame) {
      character.inMoveFrame = true;
      character.target.style.backgroundPosition = "-75px 0";
      setTimeout(function() {
        character.target.style.backgroundPosition = "-150px 0";
      }, 150);
      setTimeout(function() {
        character.target.style.backgroundPosition = "0 0";
        character.inMoveFrame = false;
      }, 250);
    }
  },
  paint: function(){
    if (character.moving) {
      character.target.style.transform = (character.direction == "left")? "translateX(-50%)" : "translateX(-50%) rotateY(180deg)";
      character.target.style.left = character.pos + "%";
      character.moveFrame();

      character.moving = false;
    }
  },
  move : {
    right: function(){
      character.moving = true;
      character.direction = "right";
      character.pos += character.speed;
      character.checkPosition();
    },
    left: function(){
      character.moving = true;
      character.direction = "left";
      character.pos += -character.speed;
      character.checkPosition();
    },
  },
  checkPosition: function(){
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
      character.target.style.backgroundPosition = "-225px 0";
      character.target.style.bottom = character.jumpPotential + "%";
      character.jumping = true;

      setTimeout(function() {
        character.target.style.backgroundPosition = "0 0";
        character.target.style.bottom = "0%";
        setTimeout(function(){
          character.jumping = false;
        },200);
      }, 150);
    }
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
    }, 100);
  };

  _.init = function(){
    _.target.style.transition = "0.15s left linear, 0.15s bottom linear";
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
};

var keyboard = {
  up : false,
  left: false,
  right: false,
};

// Init

var slime = new Slime(document.getElementsByClassName("slime")[0]);
slime.init();

character.setTransition();

// Functions

function keyManager(k, b) {
  switch (k) {
      case "ArrowLeft":
      case "KeyQ":
      case "KeyH":
      case "q":
      case "h":
        keyboard.left = b;
      break;
      case "ArrowRight":
      case "KeyD":
      case "KeyL":
      case "d":
      case "l":
        keyboard.right = b;
      break;
      case "ArrowUp":
      case "KeyZ":
      case "Spacebar":
      case "KeyK":
      case "z":
      case " ":
      case "k":
        keyboard.up = b;
      break;
      default:
  }
}

// Event

for (var i = 0; i < document.getElementsByClassName('doorL').length; i++) {
  document.getElementsByClassName('doorL')[i].onclick = function() {
    sections.forceMove.left();
  }
  document.getElementsByClassName('doorR')[i].onclick = function() {
    sections.forceMove.right();
  }
}

// Mapping

window.onkeydown = function(e) {
    e.key = e.key || e.code;
    keyManager(e.key, true);
};

window.onkeyup = function(e) {
    e.key = e.key || e.code;
    keyManager(e.key, false);
};

// Gameloop

function gameloop(){
  if (keyboard.left) {
    character.move.left();
  }

  if (keyboard.up) {
    character.jump();
  }

  if (keyboard.right) {
    character.move.right();
  }

  character.paint();
  slime.paint();

  requestAnimationFrame(gameloop);
}

requestAnimationFrame(gameloop);
