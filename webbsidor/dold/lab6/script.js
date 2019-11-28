// JavaScript Document

// Globala variabler
var formElem;		// Referens till elementet med hela formuläret
var totalCostElem;	// Referens till elementet för totalpris
var re; // Regex för postnummer och telefonnummer
var errMsg; // Felmeddelande för postnummer och telefonnummer

// Initiera globala variabler och koppla funktion till knapp
function init() {
	var i;		// Loopvariabel
	formElem = document.getElementById("booking");
	totalCostElem = document.getElementById("totalCost");

	// Listeners
	for (i = 0; i < formElem.roomType.length; i++) {
		addListener(formElem.roomType[i], "click", checkIfFamilyRoom);
		addListener(formElem.roomType[i], "click", calculateCost);
	}
	for (i = 0; i < formElem.addition.length; i++) {
		addListener(formElem.addition[i], "click", calculateCost);
	}
	addListener(formElem.nights, "change", calculateCost);
	addListener(formElem.city, "blur", checkCity);
	addListener(formElem.zipcode, "blur", checkZipcode);
	addListener(formElem.telephone, "blur", checkTelephone);
	addListener(formElem.campaigncode, "focus", startCheckCampaign);
	addListener(formElem.campaigncode, "keyup", checkCampaign);
	addListener(formElem.campaigncode, "blur", endCheckCampaign);

	// Regex
	re = [
		/^\d{3} ?\d{2}$/,						// Postnummer
		/^0\d{1,3}[-/ ]?\d{5,8}$/				// Telefonnummer
	];
	errMsg = [
		"Postnumret måste bestå av fem siffror.",
		"Telnr måste börja med en 0:a och sedan 6-11 siffror."
	];

	checkIfFamilyRoom();
	calculateCost();
} // End init
addListener(window,"load",init);

// Kontrollerar om familjerum är valt och ändrar disabled attributet för de element som det påverkar.
function checkIfFamilyRoom() {
	if (formElem.roomType[2].checked) {
		formElem.persons.disabled = false;
		formElem.persons.parentNode.style.color = "#000";
		formElem.addition[2].disabled = true;
		formElem.addition[2].parentNode.style.color = "#999";
	} else {
		formElem.persons.disabled = true;
		formElem.persons.parentNode.style.color = "#999";
		formElem.addition[2].disabled = false;
		formElem.addition[2].parentNode.style.color = "#000";
	}
}

// Räknar ut totalkostnaden genom att addera värdet för rummet och tillägg och multiplicera det med antal nätter.
function calculateCost() {
	var i; // Loopvariabel
	var elemValue; // Värdet i ett element (pris)
	var roomPrice; // Totalpriset för ett rum
	var nightsIndex; // Index för valda antalet nätter
	var nrOfNights; // Antalet nätter

	for (i = 0; i < formElem.roomType.length; i++) {
		if (formElem.roomType[i].checked) {
			elemValue = formElem.roomType[i].value;
			roomPrice = Number(elemValue.split(",")[1]);
			break;
		}
	}

	for (i = 0; i < formElem.addition.length; i++) {
		if (formElem.addition[i].checked && !formElem.addition[i].disabled) {
			elemValue = formElem.addition[i].value;
			roomPrice += Number(elemValue.split(",")[1]);
		}
	}

	nightsIndex = formElem.nights.selectedIndex;
	nrOfNights = Number(formElem.nights.options[nightsIndex].value);
	totalCostElem.innerHTML = nrOfNights * roomPrice;
}

// Konverterar city texten till versaler.
function checkCity() {
	var city = formElem.city.value;
	city = city.toUpperCase();
	formElem.city.value = city;
}

// Kontrollerar att postnummer är korrekt format.
function checkZipcode() {
	checkField(formElem.zipcode, 0);
}

// Kontrollerar att telefonummer är korrekt format.
function checkTelephone() {
	checkField(formElem.telephone, 1);
}

// Kontrollera innehållet i theField. index används till reguljärt uttryck och felmeddelande.
function checkField(theField,index) {
	var errMsgElem; // Referens till andra span-elementet
	errMsgElem = theField.parentNode.parentNode.getElementsByTagName("span")[1];
	errMsgElem.innerHTML = "";
	if (!re[index].test(theField.value)) {
		errMsgElem.innerHTML = errMsg[index];
		return false;
	}
	else return true;
} // checkField

// Sätter kampanjkod textfältets färg till röd när användaren börjar mata in värdet.
function startCheckCampaign() {
	this.style.backgroundColor = "#F99";
	this.select();
}

// Återställer färgen på kampanjkod textfältet och konverterar texten till versaler. När användaren är färdig med inmatningen.
function endCheckCampaign() {
	this.style.backgroundColor = "";
	var campaign = formElem.campaigncode.value;
	campaign = campaign.toUpperCase();
	formElem.campaigncode.value = campaign;
}

// Kontrollerar att kampanjkoden är korrekt format.
function checkCampaign() {
	var re = /^[a-zA-Z]{3}[-]\d{2}[-][a-zA-Z]\d$/; // Regex för kampanjkoden.
	if (re.test(this.value)) {
		this.style.backgroundColor = "#6F9";
	} else {
		this.style.backgroundColor = "#F99";
	}
}