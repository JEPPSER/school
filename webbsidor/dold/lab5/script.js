// JavaScript Document

// Globala variabler
var carImgElem;		// Referens till bild med bil
var msgElem;		// Referens till elementet för meddelanden
var carImgs;		// Array med filnamn för bilderna med bilen
var carDir;			// Riktning för bilen
var xStep, yStep;	// Antal pixlar som bilen ska förflytta sig i x- resp. y-led i varje steg
var timerRef;		// Referens till timern för bilens förflyttning
var timerStep;		// Tid i ms mellan varje steg i förflyttningen
var startBtn;		// Referens till startknappen
var stopBtn;		// Referens till stoppknappen
/* === Tillägg i labben === */
var pigImgElem; // Referens till bild med gris
var pigTimerRef; // Referens till grisens timer
var pigDuration; // Tid för hur länge en gris ska visas
var cSize; // Bilens storlek
var pSize; // Grisens storlek
var pigNr; // Hur många grisar som visats
var hitCounter; // Hur många grisar som blivit påkörda
var pigNrElem; // Referens till pigNr elementet
var hitCounterElem; // Referens till hitCounter elementet
var catchedPig; // Flagga för om grisen blivit påkörd eller inte

// Initiera globala variabler och koppla funktion till knapp
function init() {
	carImgElem = document.getElementById("car");
	msgElem = document.getElementById("message");
	addListener(document, "keydown", checkKey);
	carImgs = ["car_up.png", "car_right.png", "car_down.png", "car_left.png"];
	carDir = 1;
	startBtn = document.getElementById("startBtn");
	stopBtn = document.getElementById("stopBtn");
	addListener(startBtn, "click", startGame);
	addListener(stopBtn, "click", stopGame);
	startBtn.disabled = false;
	stopBtn.disabled = true;
	xStep = 5;
	yStep = 5;
	timerRef = null;
	timerStep = 20;
	/* === Tillägg i labben === */
	pigImgElem = document.getElementById("pig");
	pigTimerRef = null;
	pigDuration = 2000;
	cSize = 80;
	pSize = 40;
	pigNrElem = document.getElementById("pigNr");
	hitCounterElem = document.getElementById("hitCounter");

} // End init
addListener(window, "load", init);

// Kontrollerar vilken tangent som tryckts
function checkKey(e) {
	var k = e.keyCode;
	switch (k) {
		case 37: // Pil vänster
		case 90: // Z
			carDir--;
			if (carDir < 0) carDir = 3;
			carImgElem.src = "pics/" + carImgs[carDir];
			break;
		case 39:  // Pil höger
		case 173: // -
			carDir++;
			if (carDir > 3) carDir = 0;
			carImgElem.src = "pics/" + carImgs[carDir];
			break;
	}
} // End checkKey

// Starta bilens rörelse
function startGame() {
	startBtn.disabled = true;
	stopBtn.disabled = false;
	carImgElem.style.left = "0px";
	carImgElem.style.top = "0px";
	moveCar();
	/* === Tillägg i labben === */
	pigNr = 0;
	hitCounter = 0;
	pigNrElem.innerHTML = "0";
	hitCounterElem.innerHTML = "0";
	catchedPig = true;
	pigTimerRef = setTimeout(newPig, pigDuration);
} // End startGame

// Stoppa bilen
function stopGame() {
	if (timerRef != null) clearTimeout(timerRef);
	/* === Tillägg i labben === */
	clearTimeout(pigTimerRef);
	pigImgElem.style.visibility = "hidden";

	startBtn.disabled = false;
	stopBtn.disabled = true;
} // End stopGame

// Flytta bilen ett steg framåt i bilens riktning
function moveCar() {
	var x;	// x-koordinat (left) för bilen
	var y;	// y-koordinat (top) för bilen
	x = parseInt(carImgElem.style.left);
	y = parseInt(carImgElem.style.top);
	switch (carDir) {
		case 0: // Uppåt
			y -= yStep;
			if (y < 0) y = 0;
			break;
		case 1: // Höger
			x += xStep;
			if (x > 720) x = 720;
			break;
		case 2: // Nedåt
			y += yStep;
			if (y > 420) y = 420;
			break;
		case 3: // Vänster
			x -= xStep;
			if (x < 0) x = 0;
			break;
	}
	carImgElem.style.left = x + "px";
	carImgElem.style.top = y + "px";
	timerRef = setTimeout(moveCar, timerStep);
	/* === Tillägg i labben === */
	checkHit();
} // End moveCar


/* === Tillägg av nya funktioner i labben === */

// Lägg in en ny gris på en slumpmässig position på spelplanen.
function newPig() {
	if (pigNr < 10) {
		var t = Math.floor(440 * Math.random()) + 10; // Slumpvärde för top
		var l = Math.floor(740 * Math.random()) + 10; // Slumpvärde för left
		pigImgElem.style.top = t + "px";
		pigImgElem.style.left = l + "px";
		pigImgElem.src = "pics/pig.png";
		pigImgElem.style.visibility = "visible";
		pigTimerRef = setTimeout(newPig, pigDuration);
		pigNr++;
		pigNrElem.innerHTML = pigNr;
		catchedPig = false;
	} else {
		stopGame();
	}
}

// Kontrollerar om bilen träffat grisen.
function checkHit() {
	if (catchedPig) {
		return;
	}
	var cT = parseInt(carImgElem.style.top); // bilens top värde
	var cL = parseInt(carImgElem.style.left); // bilens left värde
	var pT = parseInt(pigImgElem.style.top); // grisens top värde
	var pL = parseInt(pigImgElem.style.left); // grisens left värde
	if (cL + cSize - 10 >= pL && cL + 10 <= pL + pSize
		&& cT + cSize - 10 >= pT && cT + 10 <= pT + pSize) {
		clearTimeout(pigTimerRef);
		pigImgElem.src = "pics/smack.png";
		pigTimerRef = setTimeout(newPig, pigDuration);
		hitCounter++;
		hitCounterElem.innerHTML = hitCounter;
		catchedPig = true;
	}
}