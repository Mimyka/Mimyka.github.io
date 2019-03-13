var sections = {
  nodeList: document.getElementsByClassName('section'),
  actual: 0,
  rz: [],
  timeout: [],
  tz: Math.round((window.innerWidth/2)/Math.tan(Math.PI/document.querySelectorAll('.section').length)),
  actualise: function() {
    for (var i = 0; i < sections.nodeList.length; i++) {
      sections.nodeList[i].style.transform = "rotateY(" + sections.rz[i] + "deg) translateZ("+sections.tz+"px)";
    }
  },
  // TODO:40 : Dry the section.move() function
  move: function(d) {
    for (var i = 0; i < sections.nodeList.length; i++) {
      sections.rz[i] += d;
    }
    sections.actualise();
    if(d === -90){
      sections.actual = (sections.actual >= sections.nodeList.length-1)? 0 : sections.actual+1;
    }
    else{
      sections.actual = (sections.actual <= 0)? sections.nodeList.length-1 : sections.actual-1;
    }
    document.querySelectorAll('.app')[sections.actual].appendChild(character.target);
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
  keyDelay: 150
};


// IDEA : Constructor function to instance some character

var character = {
  pos: 50,
  speed: 4,
  jumpPotential: 25,
  target: document.querySelector(".character"),
  frameState: true,
  move: function(speed) {
    character.target.style.transform = (speed < 0)? "translateX(-50%)" : "translateX(-50%) rotateY(180deg)";
    character.pos += speed;
    if(character.pos >= 100){
      sections.move(-90);
      character.pos = character.speed;
    }else if(character.pos <= 0){
      sections.move(90);
      character.pos = 100-character.speed;
    }
    character.target.style.left = character.pos + "%";

    // TODO:30 : Dry the frame code and separate it from the move function

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
}

for (var i = 0; i < sections.nodeList.length; i++) {
  sections.rz.push(90*i);
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

window.onresize = function() {
  sections.tz = Math.round((window.innerWidth/2)/Math.tan(Math.PI/document.querySelectorAll('main section').length));
  sections.actualise();
}

for (var i = 0; i < document.querySelectorAll('.doorA').length; i++) {
  document.querySelectorAll('.doorA')[i].onclick = function() {
    sections.forceMove(90);
  }
  document.querySelectorAll('.doorB')[i].onclick = function() {
    sections.forceMove(-90);
  }
}
