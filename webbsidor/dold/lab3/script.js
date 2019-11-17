// JavaScript

// Globala variabler
var wordList;
var selectedWord;
var letterBoxes;
var hangmanImg;
var hangmanImgNr;
var msgElem;

// Funktion som körs då hela webbsidan är inladdad, dvs då all HTML-kod är utförd
// Initiering av globala variabler samt koppling av funktioner till knapparna.
function init() {
	
	wordList = ["BLOMMA","LASTBIL","SOPTUNNA","KÖKSBORD","RADIOAPPARAT","VINTER","SOMMAR","DATORMUS","LEJON","ELEFANTÖRA","JULTOMTE",
				"SKOGSHYDDA","BILNUMMER","BLYERTSPENNA","SUDDGUMMI","KLÄDSKÅP","VEDSPIS","LJUSSTAKE","SKRIVBORD","ELDGAFFEL","STEKPANNA",
				"KASTRULL","KAFFEBRYGGARE","TALLRIK","SOFFBORD","TRASMATTA","FLYGPLAN","FLYGPLATS","TANGENTBORD"];

	let startGameBtn = document.getElementById("startGameBtn");
	startGameBtn.onclick = startGame;
	
	let letterButtons = document.getElementById("letterButtons").getElementsByTagName("button");
	for (let i = 0; i < letterButtons.length; i++) {
		letterButtons[i].onclick = guessLetter;
	}

	hangmanImg = document.getElementById("hangman");
	msgElem = document.getElementById("message");
} // End init
window.onload = init; // Se till att init aktiveras då sidan är inladdad

function startGame() {
	randomWord();
	showLetterBoxes();
	hangmanImg.src = "pics/h0.png";
	hangmanImgNr = 0;
}

function randomWord() {
	let wordIndex = Math.floor(Math.random() * wordList.length);
	selectedWord = wordList[wordIndex];
}

function showLetterBoxes() {
	let newCode = "";
	for (let i = 0; i < selectedWord.length; i++) {
		newCode += "<span>&nbsp;</span>";
	}
	document.getElementById("letterBoxes").innerHTML = newCode;
	letterBoxes = document.getElementById("letterBoxes").getElementsByTagName("span");
}

function guessLetter() {
	this.disabled = true;
	let letter = this.value;
	let letterFound = false;
	let correctLettersCount = 0;

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

function endGame(manHanged) {
	if (manHanged) {
		msgElem.innerHTML = "Du blev hängd! Rätt ord var " + selectedWord;
	} else {
		msgElem.innerHTML = "Grattis! Du kom fram till rätt ord.";
	}
}