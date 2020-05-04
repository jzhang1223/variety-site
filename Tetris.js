

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

  game = new TetrisGame(10, 24, canvas);

  game.draw_board();
}

class TetrisGame {

  constructor(width, height, canvas) {
    this.width = width;
    // Add 2 invisible rows for spawning tetromino
    this.height = height + 2;
    this.board = new Array(this.width);
    for(var i = 0; i < this.height; i++) {
      this.board[i] = new Array(height);
    }

    this.block_size = canvas.height / this.height;
  }

  print_board() {
    for(var i = 0; i < this.width; i++) {
      for(var j = 0; j < this.height; j++) {
        console.log(this.board[i][j]);
      }
    }
  }

  draw_board() {
    for(var i = 0; i < this.width; i++) {
      for(var j = 2; j < this.height; j++) {
        this.draw_block({x: i, y: j, value: this.board[i][j]});
      }
    }
  }

  draw_block(block) {
    var canvas = document.getElementById("tetris");
    var context = canvas.getContext("2d");

    let offset = (canvas.width - (this.block_size * this.width)) / 2;

    if(block.value === undefined) {
      context.beginPath();
      context.rect(block.x * this.block_size + offset, block.y * this.block_size, this.block_size, this.block_size);
      context.fillText(block.y, block.x * this.block_size + offset, block.y * this.block_size + this.block_size, this.block_size);
      context.stroke();
    }
  }
}

class Tetromino {

  constructor(shape) {
    switch(shape) {
      case shapes.I:
        this.squares = [3, 5, 6];
        break;
      case shapes.J:
        this.squares = [0, 3, 5];
        break;
      case shapes.L:
        this.squares = [2, 3, 5];
        break;
      case shapes.O:
        this.squares = [1, 2, 5];
        break;
      case shapes.S:
        this.squares = [1, 2, 3];
        break;
      case shapes.Z:
        this.squares = [0, 1, 5];
        break;
      case shapes.T:
        this.squares = [1, 3, 5];
        break;
      default:
        console.log("INVALID SHAPE GIVEN");
    }

    this.coordinates = make_coordinate_list(this.squares);
  }
}

const shapes = {
  I: "I",
  J: "J",
  L: "L",
  O: "O",
  S: "S",
  Z: "Z",
  T: "T"
}

function make_coordinate_list(coordinates) {
  var result = [make_coordinate(1,1)];
  for(var i = 0; i < coordinates.length; i++) {
    if(coordinates[i] < 3) {
      result.append(make_coordinate(coordinates[i], 0));
    } else {
      result.append(make_coordinate(coordinates[i] - 3, 1))
    }
  }
}

function make_coordinate(x, y) {
  return {x: x, y: y};
}
