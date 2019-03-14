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
  keyDelay: 125
};

var character = {
  pos: 50,
  speed: 4,
  jumpPotential: 25,
  target: document.getElementsByClassName("character")[0],
  frameState: true,
  frame: function(){
    if (character.frameState) {
      character.target.src = "./img/characterMove1.png";
      character.frameState = !character.frameState;
    }else{
      character.target.src = "./img/characterMove2.png";
      character.frameState = !character.frameState;
    }
    setTimeout(function() {
      character.target.src = "./img/character.png";
    }, (cfg.keyDelay/2));
  },
  move: function(speed) {
    character.target.style.transform = (speed < 0)? "translateX(-50%)" : "translateX(-50%) rotateY(180deg)";
    character.pos += speed;
    if(character.pos >= 100){
      sections.move(sections.right);
      character.pos = character.speed;
    }else if(character.pos <= 0){
      sections.move(sections.left);
      character.pos = 100-character.speed;
    }
    character.target.style.left = character.pos + "%";

    character.frame();
  },
  jump: function() {
    character.target.src = "./img/characterJump.png";
    character.target.style.bottom = character.jumpPotential + "%";
    setTimeout(function() {
      character.target.src = "./img/character.png";
      character.target.style.bottom = "0%";
    }, (cfg.keyDelay/2));
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

// TODO : Slimes and other cool things + apply constructor function to character
// TODO : 60 FPS limitation
// TODO : Optimisation for ooooold "navigator"

function Slime(target) {
  this.target = target;

  // this.init();
}

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

// EVENT(s)
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

for (var i = 0; i < document.getElementsByClassName('doorL').length; i++) {
  document.getElementsByClassName('doorL')[i].onclick = function() {
    sections.forceMove(90);
  }
  document.getElementsByClassName('doorR')[i].onclick = function() {
    sections.forceMove(-90);
  }
}
