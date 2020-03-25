var svg = document.getElementById("disastersMap");

fetch('')
  .then(response => response.text())
  .then(text => console.log(text))
