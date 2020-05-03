function draw() {
  setup();
  console.log("Started");
}

function setup() {
  var canvas = document.getElementById("tetris");
  var context = canvas.getContext("2d");

  canvas.width = window.innerWidth - 2;
  canvas.height = window.innerHeight - 2;


  console.log(canvas.width);
  console.log(canvas.height);
}