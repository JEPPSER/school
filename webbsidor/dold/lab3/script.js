// JavaScript

// Globala variabler
var wordList; // Lista med ord.
var selectedWord; // Nuvarande ordet som spelaren ska försöka hitta.
var letterBoxes; // Lista av span element för de bokstäver spelaren gissat rätt.
var hangmanImg; // Bild som visar hur nära spelaren är att förlora.
var hangmanImgNr; // Index för bilden som ska visas i hangmanImg.
var msgElem; // HTML element för att visa meddelanden angående spelet.
var letterButtons; // Lista av alla bokstavsknappar spelaren kan trycka på.
var startGameBtn; // Referens till start knappen.
var startTime; // Håller tiden då nuvarande spelet startades.

// Funktion som körs då hela webbsidan är inladdad, dvs då all HTML-kod är utförd
// Initiering av globala variabler samt koppling av funktioner till knapparna.
function init() {
	
	wordList = ["BLOMMA","LASTBIL","SOPTUNNA","KÖKSBORD","RADIOAPPARAT","VINTER","SOMMAR","DATORMUS","LEJON","ELEFANTÖRA","JULTOMTE",
				"SKOGSHYDDA","BILNUMMER","BLYERTSPENNA","SUDDGUMMI","KLÄDSKÅP","VEDSPIS","LJUSSTAKE","SKRIVBORD","ELDGAFFEL","STEKPANNA",
				"KASTRULL","KAFFEBRYGGARE","TALLRIK","SOFFBORD","TRASMATTA","FLYGPLAN","FLYGPLATS","TANGENTBORD"];

	startGameBtn = document.getElementById("startGameBtn");
	startGameBtn.onclick = startGame;
	
	letterButtons = document.getElementById("letterButtons").getElementsByTagName("button");
	for (let i = 0; i < letterButtons.length; i++) {
		letterButtons[i].onclick = guessLetter;
	}

	hangmanImg = document.getElementById("hangman");
	msgElem = document.getElementById("message");
	changeButtonActivation(true);
} // End init
window.onload = init; // Se till att init aktiveras då sidan är inladdad

// Ärdrar disabled värdet på startGame knappen och alla letterButtons beroende på status parametern.
function changeButtonActivation(status) {
	startGameBtn.disabled = !status;
	for (let i = 0; i < letterButtons.length; i++) {
		letterButtons[i].disabled = status;
	}
}

// Startar ett spel och återställer alla html element.
function startGame() {
	randomWord();
	showLetterBoxes();
	hangmanImg.src = "pics/h0.png";
	hangmanImgNr = 0;
	changeButtonActivation(false);
	msgElem.innerHTML = "";
	startTime = new Date().getTime();
}

// Hämtar ett slumpmässigt ord från wordList. Samma ord kan inte väljas två gånger i rad.
function randomWord() {
	let oldWord = selectedWord; // Ordet från det förra spelet.
	while (oldWord === selectedWord) {
		let wordIndex = Math.floor(Math.random() * wordList.length); // Ett slumptal mellan 0 och längden på wordList.
		selectedWord = wordList[wordIndex];	
	}	
}

// Skapar en span i letterBoxes för varje bokstav i selectedWord.
function showLetterBoxes() {
	let newCode = ""; // HTML string som ska sättas som letterBoxes innerHTML.
	for (let i = 0; i < selectedWord.length; i++) {
		newCode += "<span>&nbsp;</span>";
	}
	document.getElementById("letterBoxes").innerHTML = newCode;
	letterBoxes = document.getElementById("letterBoxes").getElementsByTagName("span");
}

// Callas när spelaren vill gissa en bokstav. Om gissningen var rätt så visas bokstaven
// på alla platser den förekommer i ordet i letterBoxes. Här kollar vi även om spelet är slut.
function guessLetter() {
	this.disabled = true;
	let letter = this.value; // Vilken bokstav som gissades av spelaren.
	let letterFound = false; // Boolean som visar om bokstaven finns i ordet.
	let correctLettersCount = 0; // Räknar hur många bokstäver som har hittats.

	for (let i = 0; i < selectedWord.length; i++) {
		if (selectedWord.charAt(i) === letter) {
			letterBoxes[i].innerHTML = letter;
			letterFound = true;
		}
		if (letterBoxes[i].innerHTML !== "&nbsp;") {
			correctLettersCount++;
		}
	}

	if (!letterFound) {
		hangmanImgNr++;
		hangmanImg.src = "pics/h" + hangmanImgNr + ".png";
		if (hangmanImgNr === 6) {
			endGame(true);
		}
	} else if (correctLettersCount === selectedWord.length) {
		endGame(false);
	}
}


// Avslutar spelet och skriver ut ett passande meddelande beroende på om spelaren blev hängd eller inte.
function endGame(manHanged) {
	let runTime = (new Date().getTime() - startTime) / 1000; // Tiden hela spelet tog att spela.
	if (manHanged) {
		msgElem.innerHTML = "Du blev hängd! Rätt ord var " + selectedWord;
	} else {
		msgElem.innerHTML = "Grattis! Du kom fram till rätt ord.<br>Det tog " + runTime.toFixed(1) + " sekunder.";
	}
	changeButtonActivation(true);
}