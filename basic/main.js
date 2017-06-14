// The number of alive cells
var nbCells;

// Setup Canvas
var canvas = document.querySelector('canvas');
var nbCellsSpan = document.querySelector('span#nb-cells');
var numCycleSpan = document.querySelector('span#num-cycle');
var ctx = canvas.getContext('2d');
var width = height = 100;
var area = Array(width);


// function to generate random number
function random(min, max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}


// Init our Game Of Life
function init() {
  // Init empty array
  for (i=0; i<width; i++) {
    area[i] = Array(height);
    for (j=0; j<height; j++) {
      area[i][j] = 0;
    }
  }

  /*
  // Pulsar
  nbCells = 5;
  area[50][49] = 1;
  area[49][50] = 1;
  area[50][50] = 1;
  area[51][50] = 1;
  area[50][51] = 1;
  drawCell(50, 49, 1);
  drawCell(49, 50, 1);
  drawCell(50, 50, 1);
  drawCell(51, 50, 1);
  drawCell(50, 51, 1);
  */

  /*
  // Blinker
  nbCells = 3;
  area[49][50] = 1;
  area[50][50] = 1;
  area[51][50] = 1;
  drawCell(49, 50, 1);
  drawCell(50, 50, 1);
  drawCell(51, 50, 1);
  */


  // Init random alive cells
  nbCells = random(1000, 10000);
  for (i=0; i<nbCells; i++) {
    x = random(0, width-1);
    y = random(0, height-1);
    if (area[x][y] == 1) {
      nbCells--;
    } else {
      area[x][y] = 1;
      drawCell(x, y, 1);
    }
  }
  nbCellsSpan.textContent = nbCells;
}


// Draw a cell
function drawCell(x, y, state) {
  ctx.beginPath();
  if (state == 1) {
    ctx.fillStyle="#000000";
  } else {
    ctx.fillStyle="#FFFFFF";
  }
  ctx.fillRect(x, y, 1, 1);
  ctx.stroke();
}

// Count number of neighbours for a given cell
function countNeighbours(x, y) {
  var nbNeighbours = 0;
  var minX = Math.max(x-1, 0);
  var minY = Math.max(y-1, 0);
  var maxX = Math.min(x+1, width-1);
  var maxY = Math.min(y+1, height-1);
  for (i = minX; i<= maxX; i++) {
    for (j = minY; j<= maxY; j++) {
      nbNeighbours = nbNeighbours + area[i][j];
    }
  }
  nbNeighbours = nbNeighbours - area[x][y];
  return nbNeighbours;
}

// Update all the cells
function updateCells() {
  var nextGen = [];
  for (var x=0; x<width; x++) {
    nextGen[x] = [];
    for (var y=0; y<height; y++) {
      var nbNeighbours = countNeighbours(x, y);
      if (nbNeighbours == 3) {
        nextGen[x][y] = 1;
        if (area[x][y] == 0) {
          drawCell(x, y, 1);
          nbCells++;
        }
      } else if (nbNeighbours < 2 || nbNeighbours > 3) {
        nextGen[x][y] = 0;
        if (area[x][y] == 1) {
          drawCell(x, y, 0);
          nbCells--;
        }
      } else {
        nextGen[x][y] = area[x][y];
      }
      nbCellsSpan.textContent = nbCells;
    }
  }
  return nextGen;
}

// ************************************
// Let's go for the conway game of life
// ************************************

// Init the Game
init();

// Add life to cells
var cycle = 0;
function loop() {
  area = updateCells();
  // stop the the animation if it runs out-of-canvas
  if (cycle++ >= 1000) {
    clearInterval(myTimer);
  }
  numCycleSpan.textContent = cycle;
}
var myTimer=setInterval(loop, 200);
