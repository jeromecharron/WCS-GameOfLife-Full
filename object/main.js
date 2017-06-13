var GameOfLife = function(params) {

  // Paramètres utilisateur
  var nbCellsY = params["initCells"].length;
  var nbCellsX = params["initCells"][0].length;
  var cellHeight = params["cellHeight"] || 10;
  var cellWidth = params["cellWidth"] || 10;
  var initCells  = params["initCells"]  || [];
  var canvasId   = params["canvasId"]   || "life";
  var colourful   = params["colourful"] || params["colorful"] || false;

  var cellsArray = [];
  var display    = new GameDisplay(nbCellsX, nbCellsY, cellWidth, cellHeight, canvasId, colourful);
  var interval   = null;


  // Initialisation du jeu
  var init = function() {
    // Création des objets Cell à partir du tableau initCells
    var lengthY = initCells.length,
        lengthX,
        y, x;
    // Pour chaque ligne
    for (y=0; y<lengthY; y++) {
      lengthX = initCells[y].length;
      // POur chaque colonne
      for (x=0; x<lengthX; x++) {
        var state = (initCells[y][x] == 1) ? 'alive' : 'dead';
        initCells[y][x] = new Cell(x, y, state);
      }
    }
    cellsArray = initCells;
    display.update(cellsArray);
  };

  
  // Fonction pour calculer les cellules de la génération suivante
  // à partir des règles du Jeu de la Vie de Conway
  var nextGenCells = function() {
    // Implémentation des règles du Jeu de la Vie
    // Algorithme simplifié :
    //   - Pour chaque cellule :
    //     - Vérifie chacune de ses voisines
    //     - À partir des règles fixe l'état de la cellule
    //       de prochaine génération à vivant (alive) ou mort (dead)
    var currentGen = cellsArray,
        nextGen = [],  // Nouveau tableau pour stocker la prochaine génération
        lengthY = cellsArray.length,
        lengthW,
        y, x;
    // Pour chaque ligne
    for (y=0; y<lengthY; y++) {
      lengthX = currentGen[y].length;
      nextGen[y] = []; // Initilise la nouvelle ligne
      // Pour chaque colonne
      for (x=0; x<lengthX; x++) {
        // Calcule les coordonnées des cellules "voisines"
        var cell = currentGen[y][x];
        // Si la cellule courante est sur la première ligne,
        // alors ses voisines du dessus se trouvent sur la dernière ligne
        var rowAbove = (y-1 >= 0) ? y-1 : lengthY-1;
        // Si la cellule courante est sur la dernière ligne,
        // alors ses voisines du dessous se trouvent sur la première ligne
        var rowBelow = (y+1 <= lengthY-1) ? y+1 : 0;
        // Si la cellule courante est sur la première colonne
        // alors ses voisines de gauche se trouvent sur la dernière colonne
        var columnLeft = (x-1 >= 0) ? x-1 : lengthX - 1; 
        // Si la cellule courante se trouve sur la dernière colonne
        // alors ses voisines de droite se trouvent sur la première colonne
        var columnRight = (x+1 <= lengthX-1) ? x+1 : 0;

        // La liste des des cellules voisines
        var neighbours = {
          topLeft: currentGen[rowAbove][columnLeft].clone(),
          topCenter: currentGen[rowAbove][x].clone(),
          topRight: currentGen[rowAbove][columnRight].clone(),
          left: currentGen[y][columnLeft].clone(),
          right: currentGen[y][columnRight].clone(),
          bottomLeft: currentGen[rowBelow][columnLeft].clone(),
          bottomCenter: currentGen[rowBelow][x].clone(),
          bottomRight: currentGen[rowBelow][columnRight].clone()
        };

        // Le nombre de voisines vivantes
        var aliveCount = 0;
        // Le nombre de voisines mortes
        var deadCount = 0;
        for (var neighbour in neighbours) {
          if (neighbours[neighbour].getState() == "dead") {
            deadCount++;
          } else {
            aliveCount++;
          }
        }

        // Calcule le nouvelle état de la cellule courante
        // en fonction de l'état de ses voisines
        var newState = cell.getState();
        if (cell.getState() == "alive") {
          if (aliveCount < 2 || aliveCount > 3) {
            // Nouvel état : cellule morte : trop ou pas assez de voisines vivantes
            newState = "dead";
          } else if (aliveCount === 2 || aliveCount === 3) {
            // Reste vivante à la prochaine génération
            newState = "alive";
          }
        } else {
          if (aliveCount === 3) {
            // Nouvel état : cellule vivante : reproduction
            newState = "alive";
          }
        }

        //console.log("Cell at x,y: " + x + "," + y + " has deadCount: " + deadCount + "and aliveCount: " + aliveCount);

        // Stocke l'état de la cellule courante
        //console.log(nextGen[y][x]);
        nextGen[y][x] = new Cell(x, y, newState);
      }
    }
    // Retourne l'état du monde à la prochaine génération
    //console.log(nextGen);
    return nextGen;
  };

  init();
  return {
    // Retourne le tableau contenant la prochaine génération de cellules
    step: function() {
      var nextGen = nextGenCells();
      // Affecte la prochaine génération à la génération courante
      cellsArray = nextGen;
      //console.log(nextGen);
      // Mise à jour de l'affichage du monde
      display.update(cellsArray);
    },
    // Retourne le tableau de cellules de la génération actuelle
    getCurrentGenCells: function() {
      return cellsArray;
    },
    setTheInterval: function(theInterval) {
      interval = theInterval;
    },
    getInterval: function() {
      return interval;
    }
  };
};

// L'objet GameDisplay a pour charge toutes les fonctionnalités relatives à l'affichage.
var GameDisplay = function(nbCellsX, nbCellsY, cellWidth, cellHeight, canvasId, colourful) {
  var canvas = document.getElementById(canvasId);
  var ctx = canvas.getContext && canvas.getContext('2d');
  var widthPixels = nbCellsX * cellWidth;
  var heightPixels = nbCellsY * cellHeight;
  var drawGridLines = function() {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(255, 0, 0, 1)";
    ctx.beginPath();
    // Pour chaque colonne
    for (var i = 0; i <= nbCellsX; i++) {
      ctx.moveTo(i*cellWidth, 0);
      ctx.lineTo(i*cellWidth, heightPixels);
    }
    // Pour chaque ligne
    for (var j = 0; j <= nbCellsY; j++) {
      ctx.moveTo(0, j*cellHeight);
      ctx.lineTo(widthPixels, j*cellHeight);
    }
    ctx.stroke();
  };
  
  // Méthode de mise à jour de l'affichage 
  // de l'ensemble du "monde" du jeu de la vie
  var updateCells = function(cellsArray) {
    var lengthY = cellsArray.length;
    var lengthX;
    var y;
    var x;
    // Pour chaque ligne
    for (y = 0; y < lengthY; y++) {
      lengthX = cellsArray[y].length;
      // Pour chaque cellule de la ligne
      for (x = 0; x < lengthX; x++) {
        // Draw Cell on Canvas
        drawCell(cellsArray[y][x]);
      }
    }
  };
  
  // Méthode de mise à jour de l'affichage d'une cellule
  var drawCell = function(cell) {
    // Calcul le pixel de "départ" de la cellule (en haut à gauche)
    var startX = cell.getXPos() * cellWidth;
    var startY = cell.getYPos() * cellHeight;
    // Dessine un rectancle à partir de ce pixel jusqu'au pixel en bas à droite
    // en ajoutant la hauteur et la largeur des cellules
    if (cell.getState() == "alive") {
      //console.log("it's alive!");
      if (colourful === true) {
        var r=Math.floor(Math.random()*256);
        var g=Math.floor(Math.random()*256);
        var b=Math.floor(Math.random()*256);
        // Transparence aléatoire entre 0,5 et 1
        var a=(Math.floor(Math.random()*6)+5)/10;
        ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
      }
      ctx.fillRect(startX, startY, cellWidth, cellHeight);
    } else {
      ctx.clearRect(startX, startY, cellWidth, cellHeight);
    }
  };
  var init = function() {
    //console.log("widthPixels: " + widthPixels);
    //console.log("heightPixels: " + heightPixels);
    // Initialise le Canvas à la bonne taille
    canvas.width = widthPixels;
    canvas.height = heightPixels;
  };
  init();
  return {
    update: function(cellsArray) {
      updateCells(cellsArray);
    }
  };
};

var Cell = function(xPos, yPos, state) {
  //console.log("Creating cell at " + xPos + "," + yPos + ", and cell state is: " + state);
  return {
    xPos: xPos,
    yPos: yPos,
    state: state,
    getXPos: function() {
      return xPos;
    },
    getYPos: function() {
      return yPos;
    },
    getState: function() {
      return state;
    },
    setState: function(newState) {
      state = newState;
    },
    clone: function() {
      return new Cell(xPos, yPos, state);
    }
  };
};

