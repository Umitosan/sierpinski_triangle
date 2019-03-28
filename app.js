/*jshint esversion: 6 */


var CANVAS,
    canH,
    canW,
    ctx,
    myGame;
var myColors = new Colors();

var defaultSimSpeed = 100;

function Colors() {
  this.black = 'rgba(0, 0, 0, 1)';
  this.darkGrey = 'rgba(50, 50, 50, 1)';
  this.lightGreyTrans = 'rgba(50, 50, 50, 0.3)';
  this.greyReset = 'rgb(211,211,211)';
  this.lighterGreyReset = 'rgb(240,240,240)';
  this.lightGreyBox = 'rgba(220, 220, 220, 1)';
  this.white = 'rgba(250, 250, 250, 1)';
  this.red = 'rgba(230, 0, 0, 1)';
  this.cherry = 'rgba(242,47,8,1)';
  this.green = 'rgba(0, 230, 0, 1)';
  this.blue = 'rgba(0, 0, 230, 1)';
  this.electricBlue = 'rgba(20, 30, 230, 1)';
  this.boxColorOn = 'rgba(127, 255, 212,1)';
  this.boxColorOff = 'rgba(126, 126, 126, 1)';
}

var State = {
  myReq: undefined,
  loopRunning: false,
  gameStarted: false,
  lastFrameTimeMs: 0, // The last time the loop was run
  maxFPS: 60, // The maximum FPS allowed
  simSpeed: defaultSimSpeed, // speed of simulation loop
  playTime: 0,
  frameCounter: 0,
  lastKey: 'none',
  mouseX: 0,
  mouseY: 0,
  mouseLeftDown: false,
  mouseRightDown: false,
  totalKeysDown: 0,
  keysDown: {
              w: false,
              s: false,
              a: false,
              d: false,
              up: false,
              down: false,
              left: false,
              right: false,
              space: false
            }
};

function softReset() {
  console.log('soft reset!');
  myGame = undefined;
  tris = undefined;
  totalRecursions = 0;
  fill = false;
  randomize = false;
  State = {
    myReq: undefined,
    loopRunning: false,
    gameStarted: false,
    lastFrameTimeMs: 0, // The last time the loop was run
    maxFPS: 60, // The maximum FPS allowed
    simSpeed: defaultSimSpeed, // speed of simulation loop
    playTime: 0,
    frameCounter: 0,
    lastKey: 'none',
    mouseX: 0,
    mouseY: 0,
    mouseLeftDown: false,
    mouseRightDown: false,
    totalKeysDown: 0,
    keysDown: {
                w: false,
                s: false,
                a: false,
                d: false,
                up: false,
                down: false,
                left: false,
                right: false,
                space: false
              }
  };
}

function updateKeysTotal() {
  let total = 0;
  for (let k in State.keysDown) {
    if (State.keysDown[k] === true) {
      total += 1;
    }
  }
  State.totalKeysDown = total;
}

//////////////////////////////////////////////////////////////////////////////////
// KEYBOARD INPUT
//////////////////////////////////////////////////////////////////////////////////
function keyDown(event) {
    event.preventDefault(); // prevents page from scrolling within window frame
    State.lastKey = event.code;
    State.keyPressed = true;
    let code = event.keyCode;
    let keyWhich = event.which;
    // console.log('event = ', event);
    // console.log('event.which = ', event.which);
    switch (keyWhich) {
        case 37: // Left arrow key
          State.keysDown.left = true;
          document.getElementById("key-left").style.backgroundColor = "pink";
          if (myGame.paused === false) { State.lastkey = 'left'; }
          break;
        case 39: //Right arrow key
          State.keysDown.right = true;
          document.getElementById("key-right").style.backgroundColor = "pink";
          if (myGame.paused === false) { State.lastkey = 'right'; }
          break;
        case 38: // Up arrow key
          State.keysDown.up = true;
          document.getElementById("key-up").style.backgroundColor = "pink";
          if (myGame.paused === false) { State.lastkey = 'up'; }
          break;
        case 40: //Down arrow key
          State.keysDown.down = true;
          document.getElementById("key-down").style.backgroundColor = "pink";
          if (myGame.paused === false) { State.lastkey = 'down'; }
          break;
        case 65: // A key
          State.keysDown.a = true;
          document.getElementById("key-A").style.backgroundColor = "pink";
          if (myGame.paused === false) { State.lastkey = 'left'; }
          break;
        case 68: // D key
          State.keysDown.d = true;
          document.getElementById("key-D").style.backgroundColor = "pink";
          if (myGame.paused === false) { State.lastkey = 'right'; }
          break;
        case 87: // W key
          State.keysDown.w = true;
          document.getElementById("key-W").style.backgroundColor = "pink";
          if (myGame.paused === false) { State.lastkey = 'up'; }
          break;
        case 83: // S key
          State.keysDown.s = true;
          document.getElementById("key-S").style.backgroundColor = "pink";
          if (myGame.paused === false) { State.lastkey = 'down'; }
          break;
        case 90: // Z key
          if (State.gameStarted === true) {  State.lastkey = 'Z'; }
          break;
        case 191: // Slash key
          if (State.gameStarted === true) { State.lastkey = '/'; }
          break;
        case 32: // spacebar
          if (State.gameStarted === true) {
            if (myGame.paused === true) {
              myGame.unpauseIt();
            } else if (myGame.paused === false) {
              myGame.pauseIt();
            } else {
              //nothin
            }
            console.log('Game pause state = ', myGame.paused);
          }
          break;
        default: // Everything else
          // nothin
          break;
    } // switch
    updateKeysTotal();
    $("#lastkey-name").text("'"+event.code+"'");
    $("#lastkey-code").text(event.keyCode);
}

function keyUp(event) {
  event.preventDefault(); // prevents page from scrolling within window frame
  if (State.keysDown.total === 0) { State.keyPressed = false; }
  let code = event.keyCode;
  switch (code) {
      case 37: // Left key
        State.keysDown.left = false;
        document.getElementById("key-left").style.backgroundColor = "lightblue";
        if (myGame.paused === false) { /*something*/ }
        break;
      case 39: //Right key
        State.keysDown.right = false;
        document.getElementById("key-right").style.backgroundColor = "lightblue";
        if (myGame.paused === false) { /*something*/ }
        break;
      case 38: // Up key
        State.keysDown.up = false;
        document.getElementById("key-up").style.backgroundColor = "lightblue";
        if (myGame.paused === false) { /*something*/ }
        break;
      case 40: //Down key
        State.keysDown.down = false;
        document.getElementById("key-down").style.backgroundColor = "lightblue";
        if (myGame.paused === false) { /*something*/ }
        break;
      case 65: // A key
        State.keysDown.a = false;
        document.getElementById("key-A").style.backgroundColor = "lightblue";
        if (myGame.paused === false) { /*something*/ }
        break;
      case 68: // D key
        State.keysDown.d = false;
        document.getElementById("key-D").style.backgroundColor = "lightblue";
        if (myGame.paused === false) { /*something*/ }
        break;
      case 87: // W key
        State.keysDown.w = false;
        document.getElementById("key-W").style.backgroundColor = "lightblue";
        if (myGame.paused === false) { /*something*/ }
        break;
      case 83: // S key
        State.keysDown.s = false;
        document.getElementById("key-S").style.backgroundColor = "lightblue";
        if (myGame.paused === false) { /*something*/ }
        break;
      case 90: // Z key
        if (State.gameStarted === true) { /*something*/ }
        break;
      case 191: // Slash key
        if (State.gameStarted === true) { /*something*/ }
        break;
      case 32: // spacebar
        // nothin
        break;
      default: // Everything else
        // nothin
        break;
  } // switch
  updateKeysTotal();
  // for (let k in State.keysDown) { // after letting go of a key, check and update direction if there's only one key still down
  //   if (State.keysDown[k] === true) {
  //     if (k === 'a') {
  //       myGame.updateLastDirKeyX('left');
  //     } else if (k === 'd') {
  //       myGame.updateLastDirKeyX('right');
  //     } else if (k === 'w') {
  //       myGame.updateLastDirKeyY('up');
  //     } else if (k === 's') {
  //       myGame.updateLastDirKeyY('down');
  //     } else { // for up left right down strings
  //       // notin
  //     }
  //   }
  // } // for
} // keyUp

//////////////////////////////////////////////////////////////////////////////////
// MOUSE INPUT
//////////////////////////////////////////////////////////////////////////////////
function mDown(evt) {
    if (evt.button === 0) {  // left-click
      // console.log('MOUSE: left down');
      if (State.mouseRightDown === false) { State.mouseLeftDown = true; } // only allow one mouse button down at a time, ignore change if both are down
    } else if (evt.button === 2) { // right-click
      // console.log('MOUSE: right down');
      if (State.mouseLeftDown === false) { State.mouseRightDown = true; }
    }
}

function mUp(evt) {
    if (evt.button === 0) {  // left-click
      // console.log('MOUSE: left up');
      State.mouseLeftDown = false;
    } else if (evt.button === 2) { // right-click
      // console.log('MOUSE: left up');
      State.mouseRightDown = false;
    }
}

//////////////////////////////////////////////////////////////////////////////////
// GAME LOOP
//////////////////////////////////////////////////////////////////////////////////
function gameLoop(timestamp) {
  // timestamp is automatically returnd from requestAnimationFrame
  // timestamp uses performance.now() to compute the time
  State.myReq = requestAnimationFrame(gameLoop);

  if ( (State.loopRunning === true) && (State.gameStarted === true) ) { myGame.update(); }

  clearCanvas();
  if (State.gameStarted === false) {
    myGame.drawBG();
  } else {
    myGame.draw();
  }

}




function resetRandState() {
  $('#random-btn').css("background-color","lightgreen");
  $('#random-btn').css("border-color","green");
  $('#fill-btn').css("background-color","lightgreen");
  $('#fill-btn').css("border-color","green");
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {

  CANVAS =  $('#canvas')[0];
  ctx =  CANVAS.getContext('2d');
  canH = CANVAS.height;
  canW = CANVAS.width;
  CANVAS.addEventListener("keydown",keyDown);
  CANVAS.addEventListener("keyup",keyUp);
  CANVAS.addEventListener("mousedown", mDown);
  CANVAS.addEventListener("mouseup", mUp);
  $('body').on('contextmenu', '#canvas', function(e){ return false; }); // prevent right click context menu default action
  // CANVAS.addEventListener('mousemove', function(evt) {
  //     let rect = CANVAS.getBoundingClientRect();
  //     State.mouseX = evt.clientX - rect.left + -0.5;
  //     State.mouseY = evt.clientY - rect.top;
  //     $("#coords-x").text(State.mouseX);
  //     $("#coords-y").text(State.mouseY);
  // }, false);

  //INPUT
  var leftMouseDown = false;

  // this is to correct for canvas blurryness on single pixel wide lines etc
  // important when animating to reduce rendering artifacts and other oddities
  // ctx.translate(0.5, 0.5);

  // start things up!
  myGame = new Game(State.simSpeed); // ms per update()
  myGame.init();
  State.myReq = requestAnimationFrame(gameLoop);
  State.loopRunning = true;
  State.gameStarted = false;
  myGame.mode = 'draw';

  myGame.mode = 'sim';
  console.log('mode now sim');
  State.gameStarted = true;
  // $('#mode-current-status')[0].innerText = 'simulate';

  $('#start-btn').click(function() {
    console.log("reset button clicked");
    generalLoopReset();
    State.loopRunning = true;
    State.gameStarted = true;
    myGame.mode = 'sim';
    $('#pause-btn')[0].innerText = 'PAUSE';
    resetRandState();
  });

  $('#reset-btn').click(function() {
    console.log("reset button clicked");
    generalLoopReset();
    State.loopRunning = true;
    State.gameStarted = true;
    myGame.mode = 'sim';
    $('#pause-btn')[0].innerText = 'PAUSE';
    resetRandState();
  });

  $('#pause-btn').click(function() {
    console.log("pause button clicked");
    if (myGame.paused === false) {
      myGame.pauseIt();
      $('#pause-btn')[0].innerText = 'UN-PAUSE';
    } else if (myGame.paused === true) {
      myGame.unpauseIt();
      $('#pause-btn')[0].innerText = 'PAUSE';
    }
  });

  let randomBtnDown = false;
  $('#random-btn').click(function() {
    if (randomBtnDown) {
      resetRandState();
      fill = false;
      randomize = false;
      randomBtnDown = false;
    } else {
      resetRandState();
      fill = false;
      randomize = true;
      $('#random-btn').css("background-color","pink");
      $('#random-btn').css("order-color","pink");
      for (let i = 0; i < tris.length; i++) {
        tris[i].lineColor = randColor('rgba');
        tris[i].fillColor = randColor('rgba');
      }
      randomBtnDown = true;
      fillBtnDown = false;
    }
  });

  let fillBtnDown = false;
  $('#fill-btn').click(function() {
    if (fillBtnDown) {
      resetRandState();
      fill = false;
      randomize = false;
      fillBtnDown = false;
    } else {
      resetRandState();
      fill = true;
      randomize = true;
      $('#fill-btn').css("background-color","pink");
      $('#fill-btn').css("border-color","pink");
      fillBtnDown = true;
      randomBtnDown = false;
    }
  });

  $('#depth').on('change', function(e) {
    let newDepth = parseInt($("#depth").val());
    DEPTH = newDepth;
    generalLoopReset();
    State.loopRunning = true;
    State.gameStarted = true;
    myGame.mode = 'sim';
    $('#pause-btn')[0].innerText = 'PAUSE';
    resetRandState();
  });

});
