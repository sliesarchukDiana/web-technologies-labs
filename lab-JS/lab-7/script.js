'use strict';

const reduceStartGame = (state) => ({ ...state, status: 'WALKING', playerTime: 0.00 });
const reducePrepare = (state) => ({ ...state, status: 'WAITING' });
const reduceFire = (state, time) => ({ ...state, status: 'FIRE', fireStartTime: time });

const reducePlayerWin = (state, reactionSec) => {
  const timeBonus = Math.max(0, state.enemyTime - reactionSec);
  const points = Math.round(timeBonus * 1000) * state.level + 100;

  return {
    ...state,
    status: 'WIN',
    playerTime: reactionSec,
    score: state.score + points
  };
};

const reducePlayerLose = (state, time) => ({ ...state, status: 'LOSE', playerTime: time });
const reduceNextLevel = (state) => {
  return {
    ...state,
    level: state.level + 1,
    enemyTime: Math.max(0.30, state.enemyTime - 0.15),
    status: 'WALKING',
    playerTime: 0.00,
    enemyId: state.level + 1
  };
};
const getInitialState = () => ({
  status: 'MENU',
  level: 1,
  score: 0,
  enemyTime: 1.00,
  playerTime: 0.00,
  fireStartTime: null,
  enemyId: 1
});

let state = getInitialState();
let gameTimer = null;
let visualTimer = null;

const DOM = {
  menu: document.querySelector('.game-menu'),
  wrapper: document.querySelector('.wrapper'),
  gameScreen: document.querySelector('.game-screen'),
  gunman: document.querySelector('.gunman'),
  crosshair: document.querySelector('.crosshair'),
  message: document.querySelector('.message'),
  timeGunman: document.querySelector('.time-panel__gunman'),
  timeYou: document.querySelector('.time-panel__you'),
  scoreNum: document.querySelector('.score-panel__score_num'),
  levelNum: document.querySelector('.score-panel__level'),
  btnStart: document.querySelector('.button-start-game'),
  btnRestart: document.querySelector('.button-restart'),
  btnNext: document.querySelector('.button-next-level'),
  btnToMenu: document.querySelector('.button-to-menu'),
  winScreen: document.querySelector('.win-screen'),
  winTitle: document.querySelector('.win-screen__title')
};

const sfx = {
  intro: new Audio('assets/sfx/intro.m4a'),
  wait: new Audio('assets/sfx/wait.m4a'),
  fire: new Audio('assets/sfx/fire.m4a'),
  shot: new Audio('assets/sfx/shot.m4a'),
  shotFall: new Audio('assets/sfx/shot-fall.m4a'),
  death: new Audio('assets/sfx/death.m4a'),
  foul: new Audio('assets/sfx/foul.m4a'),
  victory: new Audio('assets/sfx/win.m4a')
};

setInterval(() => {
  const gap = 0.2;
  if (!sfx.wait.paused && sfx.wait.duration) {
    if (sfx.wait.currentTime >= sfx.wait.duration - gap) {
      sfx.wait.currentTime = 0;
    }
  }}, 20);

function stopAllAudio() {
  Object.values(sfx).forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });
}

function startGame() {
  stopAllAudio();

  state = reduceStartGame(state);
  DOM.menu.style.display = 'none';
  DOM.winScreen.style.display = 'none';
  DOM.wrapper.style.display = 'block';
  DOM.gameScreen.style.display = 'block';
  document.querySelector('.game-panels').style.display = 'block';
  DOM.crosshair.style.display = 'block';

  moveGunman();
}

function restartGame() {
  stopAllAudio();
  clearTimeout(gameTimer);
  cancelAnimationFrame(visualTimer);

  state = getInitialState();
  state = reduceStartGame(state);

  DOM.btnRestart.style.display = 'none';
  DOM.gameScreen.classList.remove('game-screen--death');
  DOM.message.className = 'message';
  DOM.message.innerText = '';

  moveGunman();
}

function backToMenu() {
  stopAllAudio();
  state = getInitialState();

  DOM.winScreen.style.display = 'none';
  DOM.gameScreen.style.display = 'none';
  document.querySelector('.game-panels').style.display = 'none';
  DOM.crosshair.style.display = 'none';
  DOM.menu.style.display = 'block';

  sfx.wait.play().catch(() => {});
}

function nextLevel() {
  if (state.level === 5) {
    stopAllAudio();
    clearTimeout(gameTimer);
    cancelAnimationFrame(visualTimer);

    DOM.gameScreen.style.display = 'none';
    document.querySelector('.game-panels').style.display = 'none';
    DOM.winScreen.style.display = 'block';
    DOM.crosshair.style.display = 'none';

    DOM.winTitle.innerHTML = `YOU WON!<br><br>FINAL SCORE: ${state.score}`;

    sfx.victory.play().catch(() => {});
    return;
  }

  state = reduceNextLevel(state);

  DOM.btnNext.style.display = 'none';
  DOM.gameScreen.classList.remove('game-screen--death');
  DOM.message.className = 'message';
  DOM.message.innerText = '';

  moveGunman();
}

function moveGunman() {
  DOM.gunman.className = `gunman char-${state.enemyId}`;
  void DOM.gunman.offsetWidth;

  DOM.gunman.className = `gunman char-${state.enemyId} is-walking`;

  scoreCount();

  sfx.intro.currentTime = 0;
  sfx.intro.play();

  clearTimeout(gameTimer);
  gameTimer = setTimeout(prepareForDuel, 3000);
}

function prepareForDuel() {
  state = reducePrepare(state);
  DOM.gunman.className = `gunman char-${state.enemyId} is-standing`;

  const waitTime = Math.random() * 2000 + 1000;

  gameTimer = setTimeout(() => {
    state = reduceFire(state, Date.now());
    DOM.gunman.className = `gunman char-${state.enemyId} is-ready`;
    DOM.message.classList.add('message--fire');

    sfx.fire.currentTime = 0;
    sfx.fire.play();

    timeCounter();
    gameTimer = setTimeout(gunmanShootsPlayer, state.enemyTime * 1000);

  }, waitTime);
}

function timeCounter() {
  if (state.status === 'FIRE') {
    const elapsed = (Date.now() - state.fireStartTime) / 1000;
    DOM.timeYou.innerText = elapsed.toFixed(2);
    visualTimer = requestAnimationFrame(timeCounter);
  }
}

function gunmanShootsPlayer() {
  if (state.status !== 'FIRE') return;

  cancelAnimationFrame(visualTimer);
  state = reducePlayerLose(state, state.enemyTime);

  sfx.shot.currentTime = 0;
  sfx.shot.play();
  setTimeout(() => sfx.death.play(), 500);

  DOM.gunman.className = `gunman char-${state.enemyId} is-shooting`;

  setTimeout(() => {
    if (state.status === 'LOSE') {
      DOM.gunman.className = `gunman char-${state.enemyId} is-victory`;
    }
  }, 400);

  DOM.gameScreen.classList.add('game-screen--death');
  DOM.message.classList.remove('message--fire');
  DOM.message.classList.add('message--dead');
  DOM.message.innerText = 'YOU LOSE';

  DOM.btnRestart.style.display = 'block';
  scoreCount();
}

function playerShootsGunman() {
  if (state.status === 'WAITING') {
    clearTimeout(gameTimer);
    state = reducePlayerLose(state, 0);

    sfx.foul.currentTime = 0;
    sfx.foul.play();

    DOM.message.classList.add('message--dead');
    DOM.message.innerText = 'FOUL!';
    DOM.btnRestart.style.display = 'block';

    DOM.gunman.className = `gunman char-${state.enemyId} is-shooting`;

    setTimeout(() => {
      if (state.status === 'LOSE') {
        DOM.gunman.className = `gunman char-${state.enemyId} is-victory`;
      }
    }, 450);

    scoreCount();
  }
  else if (state.status === 'FIRE') {
    clearTimeout(gameTimer);
    cancelAnimationFrame(visualTimer);

    const reactionTimeSec = (Date.now() - state.fireStartTime) / 1000;
    const isWin = reactionTimeSec <= state.enemyTime;

    sfx.shot.currentTime = 0;
    sfx.shot.play();

    if (isWin) {
      state = reducePlayerWin(state, reactionTimeSec);
      setTimeout(() => sfx.shotFall.play(), 400);

      DOM.gunman.className = `gunman char-${state.enemyId} is-dead`;
      DOM.message.classList.remove('message--fire');
      DOM.message.classList.add('message--win');
      DOM.message.innerText = 'YOU WIN!';
      DOM.btnNext.style.display = 'block';
    } else {
      state = reducePlayerLose(state, reactionTimeSec);
      setTimeout(() => sfx.death.play(), 500);

      DOM.gunman.className = `gunman char-${state.enemyId} is-shooting`;

      setTimeout(() => {
        if (state.status === 'LOSE') {
          DOM.gunman.className = `gunman char-${state.enemyId} is-victory`;
        }
      }, 400);

      DOM.gameScreen.classList.add('game-screen--death');
      DOM.message.classList.remove('message--fire');
      DOM.message.classList.add('message--dead');
      DOM.message.innerText = 'YOU LOSE';
      DOM.btnRestart.style.display = 'block';
    }
    scoreCount();
  }
}

function scoreCount() {
  DOM.timeGunman.innerText = state.enemyTime.toFixed(2);
  DOM.timeYou.innerText = state.playerTime.toFixed(2);
  DOM.scoreNum.innerText = state.score;
  DOM.levelNum.innerText = `Level ${state.level}`;
}

DOM.btnStart.addEventListener('click', startGame);
DOM.btnRestart.addEventListener('click', restartGame);
DOM.btnNext.addEventListener('click', nextLevel);
DOM.btnToMenu.addEventListener('click', backToMenu);
DOM.gunman.addEventListener('mousedown', playerShootsGunman);

document.addEventListener('click', () => {
  if (state.status === 'MENU' && sfx.wait.paused) {
    sfx.wait.play().catch(() => {});
  }
}, { once: true });

DOM.gameScreen.addEventListener('mousemove', (e) => {
  const rect = DOM.gameScreen.getBoundingClientRect();
  DOM.crosshair.style.left = `${e.clientX - rect.left}px`;
  DOM.crosshair.style.top = `${e.clientY - rect.top}px`;
});

DOM.gameScreen.addEventListener('mousedown', () => DOM.crosshair.classList.add('is-shooting'));
window.addEventListener('mouseup', () => DOM.crosshair.classList.remove('is-shooting'));
