// JavaScript

// Variabler med referenser till input-taggarna och div-elementet för resultat
var input1Elem, input2Elem, resultElem;

// Funktion som körs då hela webbsidan är inladdad, dvs då all HTML-kod är utförd
// Här tas det fram referenser till textfälten för input och div-elementet för resultat
// Knappen för att köra programmet kopplas till funktionen testScript
function init() {
	input1Elem = document.getElementById("input1");
	input2Elem = document.getElementById("input2");
	resultElem = document.getElementById("result");
	document.getElementById("runBtn").onclick = doCalculations;
} // End init
window.onload = init; // Se till att init aktiveras då sidan är inladdad

// Kod för beräkningarna av area
function doCalculations() {
	// Deklaration av variabler
	var length;		// Längd i meter
	var width;		// bredd i meter
	var area;		// Yta i kvadratmeter
	
	length = Number(input1Elem.value);
	width = Number(input2Elem.value);

	area = length * width;
	resultElem.innerHTML = "<p>Rektangelns area: " + area + "</p>";
	
	area = length * width / 2;
	resultElem.innerHTML += "<p>Triangelns area: " + area + "</p>";
	
	area = 3.14159 * length * width / 4;
	resultElem.innerHTML += "<p>Ellipsens area: " + area + "</p>";
	
} // End doCalculations
