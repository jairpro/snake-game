class Sound {
  constructor(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    this.sound.volume = 0.0;
    return this.sound;
  }

  play() {
    this.sound.play().then(r => r.play());
  }
}

// const coinSound = new Sound("src/audios/collect_coin.wav");
const coinSound = new Sound("src/audios/win.wav");
const winSound = new Sound("src/audios/win.wav");
const deathSound = new Sound("src/audios/death.wav");
//const deathSound = new Sound("src/audios/death_2.wav");
const finishSound = new Sound("src/audios/finish_game.wav");
finishSound.volume = 0.5;

window.onload = function() {

  var recordLabel = document.querySelector('#record');
  var recordSpan = document.querySelector('#record span');
  var previousLabel = document.querySelector('#previous');
  var previousSpan = document.querySelector('#previous span');
  var scoreLabel = document.querySelector('#score');
  var scoreSpan = document.querySelector('#score span');
  var debug = document.querySelector('#debug');
  
  var container = document.getElementById('container');
  var status = document.getElementById('status');
  var stage = document.getElementById('stage');
  var ctx = stage.getContext('2d');
  
  var joypad = new GameJoypad();
  var touchpad = new MyTouchpad(container, null, {
    onPan: function(ev) {
      //if (ev.eventType==4 && ev.direction==2) {
      if (ev.additionalEvent==='panleft') {
        pause = false;
        moveLeft();
      }
      
      // if (ev.eventType==8 && ev.direction==8) {
        if (ev.additionalEvent==='panup') {
          pause = false;
          moveUp();
        }
        
      // if (ev.eventType==4 && ev.direction==4) {
      if (ev.additionalEvent==='panright') {
        pause = false;
        moveRight();
      }
      
      // if (ev.eventType==8 && ev.direction==2) {
      if (ev.additionalEvent==='pandown') {
        pause = false;
        moveDown();
      }
    },

    onTap: function(ev) {
      // if (ev.tapCount>=2) {
        togglePause();
      // }
    },
  });

  /*
  joypad.beforeUpdate = function(sender, e, eventType) {
    // if (eventType==="axis_move") {
    //   if (e.detail.gamepad.buttons[0].pressed) {
    //     arrows.up = true;
    //   }
    //   else if (e.detail.gamepad.axes[1]!==-1) {
    //     arrows.up = false;
    //   }
    // }
  }
  */

  joypad.afterUpdate = function(sender, e, eventType) {
    if (eventType==="button_press") {
      const { buttonName } = e.detail;
  
      // SELECT
      if (buttonName === 'button_8') {
      }
      // START
      if (buttonName === 'button_9') {
        togglePause();
      }
      // A
      if (buttonName === 'button_0') {
      }
      // O
      if (buttonName === 'button_1') {
      }
      // X
      if (buttonName === 'button_2') {
      }
      // []
      if (buttonName === 'button_3') {
      }
      // L1
      if (buttonName === 'button_4') {
      }
      // R1
      if (buttonName === 'button_5') {
      }
      // L2
      if (buttonName === 'button_6') {
      }
      // R2
      if (buttonName === 'button_7') {
      }
    }
    else if (eventType==='axis_move') {
      const { directionOfMovement, stickMoved } = e.detail;

      if (stickMoved === 'left_stick') {
        switch (directionOfMovement) {
          case 'left':
            moveLeft()
            break;

          case 'top':
            moveUp()
            break;

          case 'right':
            moveRight();
            break;

          case 'bottom':
            moveDown();
            break;
        }
      }
      else {
        switch (directionOfMovement) {
          case 'left':
            // sender.sendCustomKeyCode(37);
            // sender.press.left = true;
            moveLeft();
            break;

          case 'top':
            // sender.sendCustomKeyCode(38);
            // sender.press.up = true;
            moveUp();
            break;

          case 'right':
            // sender.sendCustomKeyCode(39);
            // sender.press.right = true;
            moveRight();
            break;

          case 'down':
            // sender.sendCustomKeyCode(39);
            // sender.press.right = true;
            moveDown();
            break;
        }
      }
      /*
      if (this.press.left && e.detail.gamepad.axes[0]!==-1) {
        sender.sendCustomKeyCode(37, "keyup");
        sender.press.left = false;
      }
      if (sender.press.up && e.detail.gamepad.axes[1]!==-1) {
        sender.sendCustomKeyCode(38, "keyup");
        sender.press.up = false;
      }
      if (sender.press.right && e.detail.gamepad.axes[0]!==1) {
        sender.sendCustomKeyCode(39, "keyup");
        sender.press.right = false;
      }
      */
    }
  }

  document.addEventListener('keydown', keyPush);



  // const intervalInicial = 1000/15;
  // const intervalInicial = 60;
  // const intervalInicial = 80;
  // const intervalInicial = 120;
  const intervalInicial = 175;

  var interval = intervalInicial;

  var handleInterval = null;

  function updateInterval() {
    if (handleInterval) {
      clearInterval(handleInterval);
    }
    handleInterval = setInterval(game, interval);
    // debug.innerText = "INTERVALO "+interval;
  }

  updateInterval();

  //const ts = 600;
  

  window.addEventListener("orientationchange", function() {
    updateScreen();
  });

  var ts;
  var tpFixa;
  var tp;
  var qp;
  updateScreen();

  function updateScreen() {
    //ts = window.innerHeight < window.innerWidth ? (window.innerHeight - (18+5+15)) : window.innerWidth - 20;
    ts = document.body.clientHeight < document.body.clientWidth ? (document.body.clientHeight - (18+5+25)) : document.body.clientWidth - 25;
    const ds = 20;

    stage.width = ts;
    stage.height = ts;

    tpFixa = false;
    tp = tpFixa ? ds : Math.floor(ts / ds);
    qp = tpFixa ? Math.floor(ts / tp) : ds;
  }
  
  const vel = 1;

  var vx = 0;
  var vy = 0;
  var px = 10;
  var py = 15;
  var ax = 15;
  var ay = 15;
  var colorSnakeLive;
  var colorSnake2Live;
  var colorSnakeDeath;
  var colorSnake2Death;
  
  const snakeStyles = [
    {
      colorLive1:  '#0f0', colorLive2:  '#0f0',
      colorDeath1: 'gray', colorDeath2: 'gray',
      colorAppe: '#f00',
      colorBackgroud: '#00f',
      sep: 1
    },
    {
      colorLive1:  '#0f0', colorLive2:  '#080',
      colorDeath1: '#999', colorDeath2: '#666',
      colorAppe: '#f00',
      colorBackgroud: '#00f',
      sep: 0
    },
    {
      colorLive1:  '#f00', colorLive2:  '#333',
      colorDeath1: '#999', colorDeath2: '#666',
      colorAppe: '#0f0',
      colorBackgroud: '#00f',
      sep: 0
    },
  ]
  
  var snakeStyle = 0;
  var colorSnake;
  var colorSnake2;
  var sepSnake;
  
  var death = false;
  
  var trail = [];
  // const tailInitial = 5;
  const tailInitial = 4;
  var tail = tailInitial;
  const freeHead = 4;

  var pause = false;
  var secondScoreType = 'record';
  var secondScoreCount = 10;

  var record = JSON.parse(localStorage.getItem('record')) || 0;
  recordSpan.innerText = record;
  var previous = JSON.parse(localStorage.getItem('previous')) || 0;
  previousSpan.innerText = previous;
  var score = 0;
  var recordIsBreak = false;
  setScore(score);

  var restartCount = 0;
  var start = false;

  function game() {
    if (pause) {
      return;
    }

    colorSnakeLive = snakeStyles[snakeStyle].colorLive1;
    colorSnake2Live = snakeStyles[snakeStyle].colorLive2;
    colorSnakeDeath = snakeStyles[snakeStyle].colorDeath1;
    colorSnake2Death = snakeStyles[snakeStyle].colorDeath2;
    sepSnake = snakeStyles[snakeStyle].sep;

    px += vx;
    py += vy;
    if (px < 0) {
      px = qp - 1;
    }
    if (px > qp - 1) {
      px = 0;
    }
    if (py < 0) {
      py = qp - 1;
    }
    if (py > qp - 1) {
      py = 0;
    }

    if (!death) {
      trail.push({
        x: px,
        y: py
      });
    }
    else if (tail > tailInitial) {
      tail--;
    }
    while (trail.length > tail) {
      trail.shift();
    }

    if (ax == px && ay == py) {
      coinSound.cloneNode(true).play();
      tail++;
      setScore(score + 1);
      if (score % 10 == 0) {
      //if (score > 5) {
        interval = interval - 7;
        updateInterval();
      }
      var appeInTrail;
      do {
        var appeInTrail = false;
        ax = Math.floor(Math.random() * qp);
        ay = Math.floor(Math.random() * qp);

        for (var i=0; i<trail.length; i++) {
          if (ax == trail[i].x && ay == trail[i].y) {
            appeInTrail = true;
            break;
          }
        }
      } 
      while (appeInTrail);
    }

    for (var i = 0; i < trail.length; i++) {
      if (i<=trail.length-freeHead && start && trail[i].x == px && trail[i].y == py) {
        death = true;
        deathSound.cloneNode(true).play();
        restartCount = 10;
        start = false;
        interval = intervalInicial;
        updateInterval();
      }
    }

    if (death) {
      vx = vy = 0;
      // tail = tailInitial;
      pause = false;
      colorSnake = colorSnakeDeath;
      colorSnake2 = colorSnake2Death;
    }
    else {
      colorSnake = colorSnakeLive;
      colorSnake2 = colorSnake2Live;
    }

    if (restartCount>0) {
      restartCount--;
    }

    /*
    if (secondScoreCount>0) {
        secondScoreCount--;
    } else {
      secondScoreType = secondScoreType === 'record' ? 'previous' : 'record';
      switch (secondScoreType) {
        case 'record':
          recordLabel.display = 'inline';
          previousLabel.display = 'none';
          break;

        case 'previous':
          recordLabel.display = 'none';
          previousLabel.display = 'inline';
          break;
          
        default:
          break;
      } 
    }
    */

    // DRAW
    // ------------------------
    // ctx.fillStyle = 'black';
    // ctx.fillStyle = 'yellow';
    ctx.fillStyle = snakeStyles[snakeStyle].colorBackgroud;
    ctx.fillRect(0, 0, stage.width, stage.height);

    ctx.fillStyle = snakeStyles[snakeStyle].colorAppe;
    ctx.fillRect(ax * tp, ay * tp, tp, tp);

    for (var i = 0; i < trail.length; i++) {
      // ctx.fillStyle = i>=trail.length-freeHead ? colorSnake2 : colorSnake;
      ctx.fillStyle = (trail.length-1-i) % 2 == 0 ? colorSnake : colorSnake2;
      ctx.fillRect(
        trail[i].x * tp,
        trail[i].y * tp,
        tp - sepSnake, tp - sepSnake
      );
    }
  }

  function setScore(s) {
    if (s == 0) {
      if (score>0) {
        previous = score;
        previousSpan.innerText = previous;
        recordIsBreak = false;
      }
      if (score>record) {
        record = score;
        recordSpan.innerText = record;
      }
    }
    else {
      localStorage.setItem('previous', JSON.stringify(s));
    }
    score = s;
    scoreSpan.innerText = score;
    if (score>record) {
      localStorage.setItem('record', JSON.stringify(score));          
      if (!recordIsBreak) {
        finishSound.cloneNode(true).play();
      }
      recordIsBreak = true;
    }

    var scoreColor = '#FFF';
    if (score < previous) {
      scoreColor = 'gray';
    } else if (score > record){
      scoreColor = 'lime';
    }
    scoreLabel.style.color = scoreColor;

    var previousColor = '#FFF';
    if (previous < score && previous < record) {
      previousColor = 'gray';
    } else if (previous > record && previous > score) {
      previousColor = 'lime'
    }
    previousLabel.style.color = previousColor;

    var recordColor = 'lime';
    if (score >= record) {
      recordColor = '#FFF';
    }
    recordLabel.style.color = recordColor;
  }

  function randomInt(min, max) {
    return min + Math.floor((max - min) * Math.random());
  }

  function resume() {
    if (death) {
      setScore(0);
      death = false;
      tail = tailInitial;
    }
    if (!start) {
      start = true;
      snakeStyle = randomInt(0, snakeStyles.length);
    }
  }

  function moveLeft() {
    if (restartCount>0) {
      return;
    }

    if (vx == vel && vy == 0) {
      return;
    }

    resume();

    vx = -vel;
    vy = 0;
  }

  function moveUp() {
    if (restartCount>0) {
      return;
    }

    if (vx == 0 && vy == vel) {
      return;
    }

    resume();

    vx = 0;
    vy = -vel;
  }

  function moveRight() {
    if (restartCount>0) {
      return;
    }


    if (vx == -vel && vy == 0) {
      return;
    }

    resume();

    vx = vel;
    vy = 0;
  }

  function moveDown() {
    if (restartCount>0) {
      return;
    }

    if (vx == 0 && vy == -vel) {
      return;
    }

    resume();

    vx = 0;
    vy = vel;
  }

  function togglePause() {
    pause = !pause;
  }

  function keyPush(event) {
    switch (event.keyCode) {
      case 37: // left
        event.preventDefault();
        moveLeft();
        break;

      case 38: // up
        event.preventDefault();
        moveUp();
        break;

      case 39: // right
        event.preventDefault();
        moveRight();
        break;

      case 40: // down
        event.preventDefault();
        moveDown();
        break;

      case 32: // space
        event.preventDefault();
        togglePause();

      default:
        break;
    }
  }

}
