var input1, input2, result;

function init() {
    input1 = document.getElementById("input1");
    input2 = document.getElementById("input2");
    result = document.getElementById("result");
    document.getElementById("runBtn").onclick = doCalculations;
}
window.onload = init;

function doCalculations() {
    var length;
    var width;
    var area;
    var distance;
    var unit = ["steg", "fot", "tum"];
    var conv = [90, 30.48, 2.54];


    length = Number(input1.value);
    width = Number(input2.value);

    area = length * width;
    result.innerHTML = "<p>Rektangelns area blir " + area + " m<sup>2</sup>. </p>";

    area = 3.14159 * length * width / 4;
    result.innerHTML += "<p>Ellipsens area blir " + area + " m<sup>2</sup>. </p>";

    area = (length + 5) * width;
    result.innerHTML += "<p>Då längden ökas med 5 meter blir rektangelns area " + area + " m<sup>2</sup>. </p>";

    result.innerHTML += "<p>Längden " + length + " meter blir:</p>";
    distance = length / conv[0] * 100;
    result.innerHTML += "<p>" + distance + " " + unit[0] + "</p>";
    distance = length / conv[1] * 100;
    result.innerHTML += "<p>" + distance + " " + unit[1] + "</p>";
    distance = length / conv[2] * 100;
    result.innerHTML += "<p>" + distance + " " + unit[2] + "</p>";

    area = (length * 1.5) * (width + 3);
    result.innerHTML += "<p>Då längden ökas med 50% och bredden med 3 meter blir rektangelns area " + area + " m<sup>2</sup>. </p>";

    area = ((length / conv[1] * 100) * (width / conv[1] * 100)) / 2 ;
    result.innerHTML += "<p>Triangelns area blir " + area + " Kvadratfot";
}