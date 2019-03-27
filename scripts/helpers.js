/*jshint esversion: 6 */


function clearCanvas() {
  ctx.clearRect(-1, -1, canvas.width+1, canvas.height+1); // offset by 1 px because the whole canvas is offset initially (for better pixel accuracy)
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function generalLoopReset() {
  if (State.myReq !== undefined) {  // reset game loop if already started
    cancelAnimationFrame(State.myReq);
  }
  softReset();
  myGame = new Game(State.simSpeed); // ms per update()
  myGame.init();
  State.myReq = requestAnimationFrame(gameLoop);
}








//// Color Stuff /////////////////////////////////////////////////////
//// Color Stuff /////////////////////////////////////////////////////
//// Color Stuff /////////////////////////////////////////////////////


function randColor(type, alpha = null) { // default alpha = 1
  // more muted colors example
      // return ( "#" + Math.round((getRandomIntInclusive(0,99999999) + 0x77000000)).toString(16) );
  // full spectum below
  let finalAlpha;
  if (type === 'hex') {
    return ( "#" + Math.round((getRandomIntInclusive(0,0xffffff))).toString(16) );
  } else if (type === 'rgba') {
      if (alpha === null) {
        finalAlpha = 1;
      } else if (alpha === 'rand') {
        finalAlpha = getRandomIntInclusive(1,10) / 10;
      } else if ( (typeof alpha) === "number") {
        finalAlpha = alpha;
      } else if ( (typeof alpha) === "string") {
        finalAlpha = parseFloat(alpha);
      } else {
        // nothing
      }
      return ( 'rgba('+ getRandomIntInclusive(0,255) +','+ getRandomIntInclusive(0,255) +','+ getRandomIntInclusive(0,255) +','+finalAlpha+')' );
  } else {
    console.log("Not valid option for randColor()");
    return undefined;
  }
}

function changeAlpha(colorString,newAlpha) {
  let a = colorString.split(",");
  a.pop();
  a.push(newAlpha.toString()+")");
  let finalColor = a.join(",");
  return finalColor;
}

function randGrey() {
  let randVal = getRandomIntInclusive(0,255);
  return ( 'rgba('+ randVal +','+ randVal +','+ randVal +','+1+')' );
}
function randRed() {
  let randVal = getRandomIntInclusive(0,255);
  return ( 'rgba('+ randVal +',0,0,1'+')' );
}
function randGreen() {
  let randVal = getRandomIntInclusive(0,255);
  return ( 'rgba(0,'+ randVal +',0,1'+')' );
}
function randBlue() {
  let randVal = getRandomIntInclusive(0,255);
  return ( 'rgba(0,0,'+ randVal +',1'+')' );
}
function randBlueGreen() {
  let randVal1 = getRandomIntInclusive(0,255);
  let randVal2 = getRandomIntInclusive(0,255);
  return ( 'rgba(0,'+ randVal1 +','+ randVal2 +',1'+')' );
}
function randRedGreen() {
  let randVal1 = getRandomIntInclusive(0,255);
  let randVal2 = getRandomIntInclusive(0,255);
  return ( 'rgba('+ randVal1 +','+ randVal2 +',0,1'+')' );
}
function randRedBlue() {
  let randVal1 = getRandomIntInclusive(0,255);
  let randVal2 = getRandomIntInclusive(0,255);
  return ( 'rgba('+ randVal1 +',0,'+ randVal2 +',1'+')' );
}

function invertRGBAstr(str) {
  let arr1 = str.slice(5,-1); // arr1 = "173,216,230,0.2"
  let arr2 = arr1.split(','); // arr2 = ["173","216","230","0.2"]
  let r = -1 * arr2[0] + 255;
  let g = -1 * arr2[1] + 255;
  let b = -1 * arr2[2] + 255;
  let a = arr2[3]; // alpha doesn't change
  return 'rgba('+r+','+g+','+b+','+a+')';
}
