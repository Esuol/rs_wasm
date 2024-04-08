import { Universe } from '../../pkg/wasm_game_of_life';

const pre = document.getElementById('game-of-life-canvas');

const universe = Universe.new();

const renderLoop = () => {
  // @ts-ignore
  pre.textContent = universe.render();
  universe.tick();

  requestAnimationFrame(renderLoop);
};

requestAnimationFrame(renderLoop);
