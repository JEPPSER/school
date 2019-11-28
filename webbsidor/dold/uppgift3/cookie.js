// JavaScript Document

// ----- Generella cookiefunktioner -----

// Spara en cookie
function saveCookie(cookieName,cookieValue) {
	document.cookie = cookieName + "=" + cookieValue + ";expires=" + expireDate(100);
} // End saveCookie

// Beräkna upphörandedatum - d dagar från dagens datum
function expireDate(d) {
	var theDate = new Date();
	theDate.setTime(theDate.getTime()+(d*86400000)); // Omräknat till millisekunder, 86400000 = 1000*60*60*24
	return theDate.toGMTString(); // GMT-time, form för tiden som ska sparas i cookien
} // End expireDate

// Hämta cookien (om den finns)
function getCookie(cookieName) {
	var start, end, valueStr;
	// Cookien består av namn=värde;upphörandedatum;
	// Hela cookiesträngen (document.ccokie) består av cookies tillgängliga i domänen. Det är textsträngar på ovanstående form
	// sammansatta till en sträng, dvs namn=värde;upphörandedatum;namn=värde;upphörandedatum;namn=värde;upphörandedatum;...
	start = document.cookie.indexOf(cookieName); // Sök efter cookiens namn i hela den tillgängliga cookie-strängen
	if (start > -1) { // Cookien hittades
		start += cookieName.length + 1; // Start-position för cookiens värde
		end = document.cookie.indexOf(";",start); // Sök slutet av cookiens värde
		if (end < start) end = document.cookie.length; // ; hittades inte, så ta resten av cookie-strängen
		valueStr = document.cookie.substring(start,end); // Cookiens värde som en sträng
		return valueStr; // Returnera cookiens värde
	}
	else return null; // Cookien hittades inte, så returnera null
} // End getCookie