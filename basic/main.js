// The number of alive cells
var nbCells = random(10000, 100000);

// Setup Canvas
var canvas = document.querySelector('canvas');
var nbCellsSpan = document.querySelector('span#nb-cells');
var numCycleSpan = document.querySelector('span#num-cycle');
var ctx = canvas.getContext('2d');
var width = height = 100;
var area = Array(width);

