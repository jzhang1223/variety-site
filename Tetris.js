

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

  game = new TetrisGame(10, 24);

  game.draw_board();
}

class TetrisGame {

  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.board = new Array(this.width);
    for(var i = 0; i < this.height; i++) {
      this.board[i] = new Array(height);
    }

    var canvas = document.getElementById("tetris");

    // console.log(canvas.height);
    // console.log(this.height);
    // console.log(canvas.height / this.height);
    // this.block_size = canvas.height / this.height;
    this.block_size = 27;
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
      for(var j = 0; j < this.height; j++) {
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
      context.stroke();
    }
  }
}

var game = new TetrisGame(10, 24);