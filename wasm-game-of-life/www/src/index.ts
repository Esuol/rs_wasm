import { Universe } from '../../pkg/wasm_game_of_life';

const pre = document.getElementById('game-of-life-canvas');

const universe = Universe.new();

let animationId = null;

const renderLoop = () => {
  // @ts-ignore
  pre.textContent = universe.render();

  universe.tick();

  requestAnimationFrame(renderLoop);
};

requestAnimationFrame(renderLoop);

const isPasued = () => {
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
  cancelAnimationFrame(animationId!);
  animationId = null;
};

// @ts-ignore
playPauseButton.addEventListener('click', () => {
  if (isPasued()) {
    play();
  } else {
    pause();
  }
});
