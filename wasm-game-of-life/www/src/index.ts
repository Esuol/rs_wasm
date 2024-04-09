import { Universe, Cell } from 'wasm-game-of-life';
import { memory } from '../../pkg/wasm_game_of_life_bg.wasm';

const CELL_SIZE = 5; // px
const GRID_COLOR = '#CCCCCC';
const DEAD_COLOR = '#FFFFFF';
const ALIVE_COLOR = '#000000';

// Construct the universe, and get its width and height.
const universe = Universe.new();
const width = universe.width();
const height = universe.height();

// Give the canvas room for all of our cells and a 1px border
// around each of them.
const canvas = document.getElementById('game-of-life-canvas');
// @ts-ignore
canvas.height = (CELL_SIZE + 1) * height + 1;
// @ts-ignore
canvas.width = (CELL_SIZE + 1) * width + 1;
// @ts-ignore
const ctx = canvas.getContext('2d');

const fps = new (class {
  constructor() {
    // @ts-ignore
    this.fps = document.getElementById('fps');
    // @ts-ignore
    this.frames = [];
    // @ts-ignore
    this.lastFrameTimeStamp = performance.now();
  }

  render() {
    // Convert the delta time since the last frame render into a measure
    // of frames per second.
    const now = performance.now();
    // @ts-ignore
    const delta = now - this.lastFrameTimeStamp;
    // @ts-ignore
    this.lastFrameTimeStamp = now;
    const fps = (1 / delta) * 1000;

    // Save only the latest 100 timings.
    // @ts-ignore
    this.frames.push(fps);
    // @ts-ignore
    if (this.frames.length > 100) {
      // @ts-ignore
      this.frames.shift();
    }

    // Find the max, min, and mean of our 100 latest timings.
    let min = Infinity;
    let max = -Infinity;
    let sum = 0;
    // @ts-ignore
    for (let i = 0; i < this.frames.length; i++) {
      // @ts-ignore
      sum += this.frames[i];
      // @ts-ignore
      min = Math.min(this.frames[i], min);
      // @ts-ignore
      max = Math.max(this.frames[i], max);
    }
    // @ts-ignore
    let mean = sum / this.frames.length;

    // Render the statistics.
    // @ts-ignore
    this.fps.textContent = `
Frames per Second:
         latest = ${Math.round(fps)}
avg of last 100 = ${Math.round(mean)}
min of last 100 = ${Math.round(min)}
max of last 100 = ${Math.round(max)}
`.trim();
  }
})();

let animationId = null;

const renderLoop = () => {
  fps.render();

  drawGrid();
  drawCells();

  for (let i = 0; i < 9; i++) {
    universe.tick();
  } // @ts-ignore

  animationId = requestAnimationFrame(renderLoop);
};

const isPaused = () => {
  return animationId === null;
};

const playPauseButton = document.getElementById('play-pause');

const play = () => {
  // @ts-ignore
  playPauseButton.textContent = '⏸';
  renderLoop();
};

const pause = () => {
  // @ts-ignore
  playPauseButton.textContent = '▶';
  // @ts-ignore
  cancelAnimationFrame(animationId);
  animationId = null;
};
// @ts-ignore
playPauseButton.addEventListener('click', (event) => {
  if (isPaused()) {
    play();
  } else {
    pause();
  }
});

const drawGrid = () => {
  ctx.beginPath();
  ctx.strokeStyle = GRID_COLOR;

  // Vertical lines.
  for (let i = 0; i <= width; i++) {
    ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
    ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
  }

  // Horizontal lines.
  for (let j = 0; j <= height; j++) {
    ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
    ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
  }

  ctx.stroke();
};

const getIndex = (row, column) => {
  return row * width + column;
};

const drawCells = () => {
  const cellsPtr = universe.cells();
  const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

  ctx.beginPath();

  // Alive cells.
  ctx.fillStyle = ALIVE_COLOR;
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = getIndex(row, col);
      if (cells[idx] !== Cell.Alive) {
        continue;
      }

      ctx.fillRect(
        col * (CELL_SIZE + 1) + 1,
        row * (CELL_SIZE + 1) + 1,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }

  // Dead cells.
  ctx.fillStyle = DEAD_COLOR;
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = getIndex(row, col);
      if (cells[idx] !== Cell.Dead) {
        continue;
      }

      ctx.fillRect(
        col * (CELL_SIZE + 1) + 1,
        row * (CELL_SIZE + 1) + 1,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }

  ctx.stroke();
};

// @ts-ignore
canvas.addEventListener('click', (event) => {
  // @ts-ignore
  const boundingRect = canvas.getBoundingClientRect();
  // @ts-ignore
  const scaleX = canvas.width / boundingRect.width;
  // @ts-ignore
  const scaleY = canvas.height / boundingRect.height;

  const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
  const canvasTop = (event.clientY - boundingRect.top) * scaleY;

  const row = Math.min(Math.floor(canvasTop / (CELL_SIZE + 1)), height - 1);
  const col = Math.min(Math.floor(canvasLeft / (CELL_SIZE + 1)), width - 1);

  universe.toggle_cell(row, col);

  drawCells();
  drawGrid();
});

play();
