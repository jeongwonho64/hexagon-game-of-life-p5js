const hexRadius = 10;
const hexMargin = 1;
let hexHeight, hexWidth, columns, rows;
let hexagons = [];
let play = 1;
function setup() {
  hexWidth = hexRadius * 2;
  hexHeight = Math.sqrt(3) * hexRadius;
  columns = Math.ceil(window.innerWidth / (hexRadius * 3));
  rows = Math.ceil(window.innerHeight / (hexHeight / 2)) + 1;

  createCanvas(
    (columns + 1 / 4) * (hexRadius * 3),
    (rows + 1) * (hexHeight / 2)
  );
  frameRate(5);
  fill(255, 100);
  stroke(255);
  strokeWeight(5);
  noStroke();

  for (let x = 0; x < columns; x++) {
    hexagons.push([]);
    for (let y = 0; y < rows; y++) {
      const active = Math.round(random() * 0.6);
      hexagons[x].push(new Hex(x, y, active));
    }
  }
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      hexagons[x][y].initialiseNeighbours(x, y);
    }
  }
}

function draw() {
  background(0);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      let hex = hexagons[x][y];
      hex.draw();
      hex.checkActive();
    }
  }
  if (play) update();
}

function keyPressed() {
  if (keyCode == 32) {
    play = !play;
  }
}

function update() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      let hex = hexagons[x][y];
      hex.updateActive();
    }
  }
}

class Hex {
  constructor(x, y, active) {
    this.pos = createVector(x, y);
    this.pixelPos = createVector(0, 0);
    this.pixelPos.x = hexWidth * (1.5 * x + 0.5 + (y % 2) * 0.75);
    this.pixelPos.y = hexHeight * (y * 0.5 + 0.5);
    this.active = active;
    this.nextActive = false;
    this.neighbours = [];
  }
  initialiseNeighbours(x, y) {
    let n = [false, false, false, false, false, false];
    const odd = y % 2;
    if (y >= 2) {
      n[0] = hexagons[x][y - 2];
    }
    if (y >= 1) {
      if (!odd || x < columns - 1) {
        n[1] = hexagons[x + odd][y - 1];
      }
    }
    if (y < rows - 1) {
      if (!odd || x < columns - 1) {
        n[2] = hexagons[x + odd][y + 1];
      }
    }
    if (y < rows - 2) {
      n[3] = hexagons[x][y + 2];
    }
    if (y < rows - 1) {
      if (odd || x >= 1) {
        n[4] = hexagons[x - 1 + odd][y + 1];
      }
    }
    if (y >= 1) {
      if (odd || x >= 1) {
        n[5] = hexagons[x - 1 + odd][y - 1];
      }
    }
    this.neighbours = n;
  }

  updateActive() {
    this.active = this.nextActive;
  }

  countActiveNeighbours() {
    let activeNeighbours = 0;
    for (let i = 0; i < 6; i++) {
      if (this.neighbours[i] && this.neighbours[i].active) {
        activeNeighbours++;
      }
    }
    return activeNeighbours;
  }

  checkActive() {
    let activeNeighbours = this.countActiveNeighbours();
    if (this.active) {
      if (activeNeighbours < 3) this.nextActive = false;
      if (activeNeighbours > 4) this.nextActive = false;
    } else {
      if (activeNeighbours == 2) this.nextActive = true;
      if (activeNeighbours == 1) {
        if (Math.random() < 0.01) this.nextActive = true;
      }

      if (activeNeighbours == 0) {
        if (Math.random() < 0.005) this.nextActive = true;
      }
    }
  }

  checkNeighbours() {
    return true;
  }

  draw() {
    if (this.active) {
      let activeNeighbours = this.countActiveNeighbours();
      fill(
        100 - 10 * activeNeighbours,
        20 + 15 * activeNeighbours,
        50 + 25 * activeNeighbours
      );
    } else {
      fill(25);
    }

    push();
    translate(this.pixelPos.x, this.pixelPos.y);
    beginShape();
    for (let i = 0; i < 6; i++) {
      vertex(
        (hexRadius - hexMargin / 2) * cos((i * Math.PI) / 3),
        (hexRadius - hexMargin / 2) * sin((i * Math.PI) / 3)
      );
    }
    endShape(CLOSE);
    pop();
  }
}
