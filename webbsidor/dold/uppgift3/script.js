var startGameBtn;
var brickElems;
var nextBtn;
var turnNr;
var userTotPoints;

var bricks;
var turnedBricks;
var turnCounter;
var pairCounter;

// Init
function init() {
    startGameBtn = document.getElementById("startGameBtn");
    nextBtn = document.getElementById("nextBtn");
    turnNr = document.getElementById("turnNr");
    userTotPoints = document.getElementById("userTotPoints");
    nextBtn.disabled = true;

    // Listeners
    addListener(startGameBtn, "click", startGame);
    addListener(nextBtn, "click", checkMatch);
    addBrickListeners();
}
addListener(window, "load", init);

function startGame() {
    initBricks();
    turnCounter = 0;
    pairCounter = 0;
    turnedBricks = [null, null];
}

function addBrickListeners() {
    brickElems = document.getElementsByClassName("brickBack");
    for (var i = 0; i < brickElems.length; i++) {
        addListener(brickElems[i], "click", turnBrick);
    }
}

function turnBrick() {
    if (turnedBricks[1] == null) {
        var index = [].slice.call(brickElems).indexOf(this);
        this.src = "pics/" + bricks[index] + ".png";

        if (turnedBricks[0] == null && turnedBricks[1] == null) {
            turnedBricks[0] = index;
        } else if (turnedBricks[1] == null) {
            turnedBricks[1] = index;
            nextBtn.disabled = false;
            turnCounter++;
            turnNr.innerHTML = turnCounter;
        }
    }
}

function checkMatch() {
    if (bricks[turnedBricks[0]] == bricks[turnedBricks[1]]) {
        brickElems[turnedBricks[0]].src = "pics/empty.png";
        brickElems[turnedBricks[1]].src = "pics/empty.png";
        removeListener(brickElems[turnedBricks[0]], "click", turnBrick);
        removeListener(brickElems[turnedBricks[1]], "click", turnBrick);
        pairCounter++;
    } else {
        brickElems[turnedBricks[0]].src = "pics/backside.png";
        brickElems[turnedBricks[1]].src = "pics/backside.png";
    }
    turnedBricks = [null, null];
    nextBtn.disabled = true;
    if (pairCounter == 8) {
        endGame();
    }
}

function endGame() {
    var points = 20 - (turnCounter - pairCounter) * 1.2;
    if (points < 0) {
        points = 0;
    }
    userTotPoints.innerHTML = Math.round(points);
}

function initBricks() {
    bricks = [];
    var indexes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    var images = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

    for (var i = 0; i < 8; i++) {
        var imgIndex = Math.floor(Math.random() * images.length);
        var imgNum = images[imgIndex];
        images.splice(imgIndex, 1);
        
        for (var j = 0; j < 2; j++) {
            var index = Math.floor(Math.random() * indexes.length);
            bricks[indexes[index]] = imgNum;
            indexes.splice(index, 1);
        } 
    }
}