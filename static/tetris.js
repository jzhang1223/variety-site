function start() {
  setup();
  ontick();
}

function setup() {
  var canvas = document.getElementById("tetris");

  game = new TetrisGame(10, 24, canvas);

  document.addEventListener("keydown", game.handle_key);

  game.draw_board();
}

function ontick() {
  game.ontick();
  if(!game.paused && !game.is_game_over) {
    setTimeout(() => {window.requestAnimationFrame(ontick);}, 200);
  }
}

function paint_board() {
  game.draw_board();
}

class TetrisGame {

  constructor(width, height, canvas) {
    // width of game board in blocks
    this.width = width;
    // Add 2 invisible rows for spawning tetromino
    // width of game board in blocks
    this.height = height + 2;
    this.board = new Array(this.width);
    for(var i = 0; i < this.width; i++) {
      this.board[i] = new Array(this.height);
      this.board[i].fill(0);
    }

    this.paused = true;
    this.is_game_over = false;
    this.spawn_tetromino(Tetromino.generate_tetromino());
  }

  print_board() {
    for(var i = 0; i < this.width; i++) {
      for(var j = 0; j < this.height; j++) {
        console.log(this.board[i][j]);
      }
    }
  }

  draw_board() {
    var canvas = document.getElementById("tetris");
    var context = canvas.getContext("2d");
    canvas.width = window.innerWidth - 20;
    canvas.height = window.innerHeight - 2;
    this.block_size = canvas.height / this.height;

    context.clearRect(0, 0, canvas.width, canvas.height);

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

    if(block.value === 0) {
      context.fillStyle = "rgb(0,0,0)";
      context.beginPath();
      context.rect(block.x * this.block_size + offset, block.y * this.block_size, this.block_size, this.block_size);
      context.fillText("(" + block.x + ", " + block.y + ")", block.x * this.block_size + offset, block.y * this.block_size + this.block_size, this.block_size);
      context.stroke();
    }
    else if(block.value === 1) {
      context.fillStyle = "rgb(0,0,0)";
      context.fillRect(block.x * this.block_size + offset, block.y * this.block_size, this.block_size, this.block_size);
    }
    else if(block.value === 2) {
      context.fillStyle = "rgb(255,0,0)";
      context.fillRect(block.x * this.block_size + offset, block.y * this.block_size, this.block_size, this.block_size);
    }
  }

  spawn_tetromino(tetromino) {
    let base = make_coordinate(3, 0);
    var coordinates = [];
    for(var i = 0; i < tetromino.coordinates.length; i++) {
      coordinates.push(make_coordinate(base.x + tetromino.coordinates[i].x, base.y + tetromino.coordinates[i].y));
    }
    this.current_piece = {
      direction: direction.UP,
      shape: tetromino.shape, 
      coordinates: coordinates, 
      center: make_coordinate(4,1)}
  }

  ontick() {
    console.log(this.current_piece);
    if(this.paused || this.is_game_over) {
      return;
    }
    if(this.can_move(direction.DOWN)) {
      this.move(direction.DOWN);
    } 
    else if(!this.on_board()) {
      this.is_game_over = true;
    }
    else {
      this.current_piece.coordinates.forEach(piece => {this.board[piece.x][piece.y] = 1});
      // TODO: check for full row and delete it
      let rows_to_be_cleared = this.get_rows_to_clear();
      if(rows_to_be_cleared.length > 0) {
        rows_to_be_cleared.forEach(index => {this.clear_row(index)});
        rows_to_be_cleared.forEach(index => {this.shift_blocks_down(index, 1)});
      }
      this.spawn_tetromino(Tetromino.generate_tetromino());
    }
    this.draw_board();
  }

  can_move(direction) {
    if(this.current_piece.shape == null || this.is_game_over || this.paused) {
      return false;
    }
    for(var i = 0; i < this.current_piece.coordinates.length; i++) {
      let current_block = this.moved_block(this.current_piece.coordinates[i], direction);

      if(this.out_of_bounds(current_block) || this.board[current_block.x][current_block.y] === 1) {
        return false;
      }
    }
    return true;
  }

  out_of_bounds(coordinates) {
    return coordinates.x < 0 || coordinates.x >= this.width || coordinates.y < 0 || coordinates.y >= this.height;
  }

  on_board() {
      for(var i = 0; i < this.current_piece.coordinates.length; i++) {
        if(this.current_piece.coordinates[i].y < 2) {
          return false;
        }
      } 
      return true;
  }

  move(direction) {
    var result = []
    this.current_piece.coordinates.forEach(block => {
      let moved_block = this.moved_block(block, direction);
      result.push(moved_block);
    })
    this.current_piece.coordinates = result;
    // delete previous instances of the active block scanning from the bottom
    for(var i = 0; i < this.width; i++) {
      for(var j = this.height - 1; j >= 0; j--) {
        if(this.board[i][j] === 2) {
          this.board[i][j] = 0;
        }
      }
    }
    this.current_piece.coordinates.forEach(block => {this.board[block.x][block.y] = 2});
    this.current_piece.center = this.moved_block(this.current_piece.center, direction);
  }

  can_rotate() {
    let next_rotation = this.get_rotation()
    for(var i = 0; i < next_rotation.length; i++) {
      let next_x = next_rotation[i].x;
      let next_y = next_rotation[i].y;
      if(this.out_of_bounds(next_rotation[i]) || this.board[next_x][next_y] === 1) {
        return false;
      }
    }
    return true;
  }

  rotate_piece() {
    console.log(this.get_rotation());
    this.current_piece.coordinates = this.get_rotation();
  }

  // Using https://vignette.wikia.nocookie.net/tetrisconcept/images/3/3d/SRS-pieces.png/revision/latest?cb=20060626173148
  get_rotation() {
    if(this.current_piece.shape !== shapes.O) {
      var result = [];
      let xc = this.current_piece.center.x;
      let yc = this.current_piece.center.y;

      // use the halfway point as the center
      if(this.current_piece.shape === shapes.I) {
        xc += 0.5;
        yc += 0.5;
      }

      this.current_piece.coordinates.forEach(coordinate => {

        // cos 90 = 0
        // sin 90 = 1
        // x1 = (x0 - xc)cos(90)-(y0 - yc)sin(90) + xc
        // y1 = (x0 - xc)sin(90)+(y0 - yc)cos(90) + yc

        let x1 = (coordinate.x - xc) * 0 - (coordinate.y - yc) * 1 + xc;
        let y1 = (coordinate.x - xc) * 1 + (coordinate.y - yc) * 0 + yc;

        result.push(make_coordinate(x1, y1));
      })
      return result;
    } else {
      return this.current_piece.coordinates;
    }
  }

  // Return the given blocked moved 1 spot in a given direction.
  moved_block(block, direction) {
    switch(direction) {
      case "UP":
        return make_coordinate(block.x, block.y - 1);
      case "DOWN":
        return make_coordinate(block.x, block.y + 1);
      case "LEFT":
        return make_coordinate(block.x - 1, block.y);
      case "RIGHT":
        return make_coordinate(block.x + 1, block.y);
      default:
        console.log("INVALID DIRECTION GIVEN");
        console.log(direction);
    }
  }

  get_rows_to_clear() {
    var result = []
    for(var j = 0; j < this.height; j++) {
      var should_clear = true;
      for(var i = 0; i < this.width; i++) {
        if(this.board[i][j] === 0) {
          should_clear = false;
        }
      }
      if(should_clear === true) {
        result.push(j);
      }
    }
    return result;
  }

  clear_row(index) {
    for(var i = 0; i < this.width; i++) {
      this.board[i][index] = 0;
    }
  }

  shift_blocks_down(starting_index, num_rows) {
    for(var j = starting_index; j > 1; j--) {
      for(var i = 0; i < this.width; i++) {
      // no need to shift from hidden rows
        this.board[i][j] = this.board[i][j-num_rows];
      }
    }
  }

  handle_key(event) {
    let key = event.key
    switch(key) {
      case "p":
        game.pause();
        break;
      // potential force advance for debugging purposes?
      case "f":
        game.paused = false;
        game.ontick();
        game.paused = true;
        break;
      case "ArrowLeft":
        if(game.can_move(direction.LEFT)) {
          game.move(direction.LEFT);
          game.draw_board();
        }
        break;
      case "ArrowRight":
        if(game.can_move(direction.RIGHT)) {
          game.move(direction.RIGHT);
          game.draw_board();
        }
        break;
      case "ArrowDown":
        game.ontick()
        break;
      case "c":
        if(game.can_rotate()) {
          game.rotate_piece();
          game.draw_board();
        }
        break;
      default:
        console.log(key);
    }
  }

  pause() {
    this.paused = !this.paused;
    if(!this.paused) {
      ontick();
    }
  }

  end_game() {
    this.is_game_over = true;
  }
}

const direction = {
  UP: "UP",
  DOWN: "DOWN",
  LEFT: "LEFT",
  RIGHT: "RIGHT"
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

    this.shape = shape
    this.coordinates = make_coordinate_list(this.squares);
  }

  static generate_tetromino() {
    // return new Tetromino(shapes.I);
    let random_shape = Math.floor(Math.random() * 7);
    switch (random_shape) {
      case 0:
        return new Tetromino(shapes.I);
      case 1:
        return new Tetromino(shapes.J);
      case 2:
        return new Tetromino(shapes.L);
      case 3:
        return new Tetromino(shapes.O);
      case 4:
        return new Tetromino(shapes.S);
      case 5:
        return new Tetromino(shapes.Z);
      case 6:
        return new Tetromino(shapes.T);
      default:
        console.log("INVALID TETROMINO GENERATED");
    }
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
      result.push(make_coordinate(coordinates[i], 0));
    } else {
      result.push(make_coordinate(coordinates[i] - 3, 1))
    }
  }
  return result;
}

function make_coordinate(x, y) {
  return {x: x, y: y};
}
