var startGameBtn; // HTML element för start knappen.
var brickElems; // Lista av alla brickbilder.
var nextBtn; // HTML element för nästa knappen.
var turnNr; // HTML element för antal vändningar.
var userTotPoints; // HTML element för totala poängen för användaren.
var nrOfBricksMenu; // HTML element för menyn där man väljer antalet brickor.

var bricks; // Array för vilka bilder som ska kopplas till vilka brickor.
var turnedBricks; // Array med de 2 vända brickorna.
var turnCounter; // Räknare för antal vändningar.
var pairCounter; // Räknare för antal par funna.
var started; // Boolean för om spelet är startat eller inte.

// Init
function init() {
    startGameBtn = document.getElementById("startGameBtn");
    nextBtn = document.getElementById("nextBtn");
    turnNr = document.getElementById("turnNr");
    userTotPoints = document.getElementById("userTotPoints");
    nrOfBricksMenu = document.getElementById("nrOfBricksMenu");
    nextBtn.disabled = true;
    started = false;
    turnedBricks = [null, null];
    if (window.localStorage.points == null) {
        window.localStorage.setItem("points", 0);
    }
    userTotPoints.innerHTML = window.localStorage.points;

    // Listeners
    addListener(startGameBtn, "click", startGame);
    addListener(nextBtn, "click", checkMatch);
}
addListener(window, "load", init);

// Startar en omgång och initialiserar alla brickor och variabler.
function startGame() {
    addBrickListeners();
    initBricks();
    turnCounter = 0;
    pairCounter = 0;
    turnedBricks = [null, null];
    started = true;
    startGameBtn.disabled = true;
    nrOfBricksMenu.disabled = true;
    turnNr.innerHTML = "0";
}

// Lägger till listeners för alla brickor.
function addBrickListeners() {
    brickElems = document.getElementById("bricks").getElementsByTagName("img");
    for (var i = 0; i < brickElems.length; i++) {
        addListener(brickElems[i], "click", turnBrick);
    }
}

// Funktion för att vända en bricka i spelet.
function turnBrick() {
    if (turnedBricks[1] == null && started) {
        var index = [].slice.call(brickElems).indexOf(this); // Index of the brick that was clicked.

        // Om första brickan är samma som den som blev klickad, return.
        if (turnedBricks[0] == index) {
            return;
        }

        this.className = "brickFront";
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

// Kontrollerar om de två vända brickorna matchar varandra.
function checkMatch() {
    if (bricks[turnedBricks[0]] == bricks[turnedBricks[1]]) {
        brickElems[turnedBricks[0]].src = "pics/empty.png";
        brickElems[turnedBricks[1]].src = "pics/empty.png";
        brickElems[turnedBricks[0]].className = "brickEmpty";
        brickElems[turnedBricks[1]].className = "brickEmpty";
        removeListener(brickElems[turnedBricks[0]], "click", turnBrick);
        removeListener(brickElems[turnedBricks[1]], "click", turnBrick);
        pairCounter++;
    } else {
        brickElems[turnedBricks[0]].src = "pics/backside.png";
        brickElems[turnedBricks[1]].src = "pics/backside.png";
        brickElems[turnedBricks[0]].className = "brickBack";
        brickElems[turnedBricks[1]].className = "brickBack";
    }
    turnedBricks = [null, null];
    nextBtn.disabled = true;
    if (pairCounter == 8) {
        endGame();
    }
}

// Funktion för att avsluta ett spel. Denna funktionen anropas när alla par blivit funna.
function endGame() {
    var points = 20 - (turnCounter - pairCounter) * 1.2; // Uträknade poäng.
    if (points < 0) {
        points = 0;
    }
    turnNr.innerHTML += "<br>Du hittade alla par! Poäng: " + Math.round(points);
    window.localStorage.points = Number(window.localStorage.points) + Math.round(points);
    userTotPoints.innerHTML = window.localStorage.points;
    startGameBtn.disabled = false;
    nrOfBricksMenu.disabled = false;
    started = false;
}

// Initialiserar logiken för alla brickor. Här bestäms vilka bilder som blir kopplade till vilka brickor.
function initBricks() {
    bricks = [];
    var indexes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]; // Index för alla brickor.
    var images = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]; // Alla bilder som kan användas.

    for (var i = 0; i < brickElems.length; i++) {
        brickElems[i].src = "pics/backside.png";
        brickElems[i].className = "brickBack";
    }

    for (var i = 0; i < 8; i++) {
        var imgIndex = Math.floor(Math.random() * images.length); // Index för vilken bild som ska användas.
        var imgNum = images[imgIndex]; // Bilden som ska användas.
        images.splice(imgIndex, 1);
        
        // Koppla bilden till två bricks.
        for (var j = 0; j < 2; j++) {
            var index = Math.floor(Math.random() * indexes.length); // Vilken brick som ska kopplas till bilden.
            bricks[indexes[index]] = imgNum;
            indexes.splice(index, 1);
        } 
    }
}