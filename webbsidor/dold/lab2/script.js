// JavaScript

// Globala variabler
var inputElem; // Array som håller alla textfält.
var msgElem; // Element som visar meddelanden.
var fruitNames; // Array som håller namnen på alla frukter.
var fruitNr; // Numret på vald frukt.
var selFruitsElem; // Element för valda frukter.

// Funktion som körs då hela webbsidan är inladdad, dvs då all HTML-kod är utförd.
// Initiering av globala variabler samt koppling avfunktioner till knapparna.
function init() {
	inputElem = [];
    inputElem[1] = document.getElementById("input1");
    inputElem[2] = document.getElementById("input2");
    inputElem[3] = document.getElementById("input3");
    msgElem = document.getElementById("message");
    selFruitsElem = document.getElementById("selectedFruits");

    fruitNames = ["ingen frukt", "äpple", "banan", "citron", "apelsin", "päron"];
    fruitNr = 0;

    document.getElementById("btn1").onclick = showFruit;
    document.getElementById("btn2").onclick = checkName;
    document.getElementById("btn3").onclick = addFruits;
} // End init
window.onload = init; // Se till att init aktiveras då sidan är inladdad

// Uppdaterar bilden på sidan till användarens input i det första textfältet.
function showFruit() {
    let nr = getNr(1, 5); // Talet från första textfältet.
    if (nr != null) {
        let fruitUrl = "pics/fruit" + nr + ".jpg"; // URL till den nya bilden som ska visas.
        document.getElementById("fruitImg").src = fruitUrl;
        fruitNr = nr; 
    }
}

// Kontrollerar om det angiva namnet i andra textfältet stämmer med den valda frukten.
function checkName() {
    let name = inputElem[2].value; // Texten från det andra textfältet.
    if (fruitNr === 0) {
        msgElem.innerHTML = "Du måste välja en frukt först.";
        return;
    }
    if (name === fruitNames[fruitNr]) {
        msgElem.innerHTML = "Rätt namn";
    } else {
        msgElem.innerHTML = "Fel namn";
    }
}

// Kontrollerar input och returnerar ett korrekt heltal från textfält med index elemNr.
function getNr(elemNr, high) {
    let nr = inputElem[elemNr].value; // Talet från textfältet.
    if (isNaN(nr)) {
        msgElem.innerHTML = "Du måste skriva ett tal med siffror.";
        return null;
    }
    if (nr < 1 || nr > high) {
        msgElem.innerHTML = "Talet måste vara mellan 1-" + high + ".";
        return null;
    }
    nr = parseInt(nr);
    inputElem[elemNr].value = nr;
    return nr;
}

// Lägger till ett antal bilder av den valda frukten. Antalet bestäms av användarens input i textfält 3.
function addFruits() {
    let amount; // Antalet frukter användaren valt.
    let imgList; // HTML string som ska läggas till i selectedFruits elementet.
    if (fruitNr === 0) {
        msgElem.innerHTML = "Du måste välja en frukt först.";
        return;
    }
    amount = getNr(3, 9);
    if (amount != null) {
        imgList = "";
        for (let i = 0; i < amount; i++) {
            imgList += "<img src='pics/fruit" + fruitNr + ".jpg' alt='frukt'>";
        }
        selFruitsElem.innerHTML += imgList;
    }
}