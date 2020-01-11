const { redux } = window;
const container = document.querySelector(".container");
const titleHeader = document.querySelector(".title");
const player = document.querySelector(".player");
const music = new Audio("assets/stage1.mp3");
const scoreboard = document.querySelector(".scoreboard");
const score = document.querySelector(".score");
const playerImageJumping = document.querySelector(".playerImage");
const playerImageStand = document.querySelector(".playerImageStand");

const PLAYER_SPEED = 10;
const OBSTACLES_SPEED = 10;
const BONUSES_SPEED = 10;
const JUMP_MAX_HIGH = 6;
let OBSTACLE_CREATION_PROBABILITY = 0.5;
const BONUS_CREATION_PROBABILITY = 0.9;

window.onload = async () => {
  setStartGameScreen();
};

const initialState = {
  playerPosition: {
    x: 10,
    y: 10
  },
  obstacles: [],
  bonuses: [],
  jumping: false, // If the player is jumping
  timeJumping: 0, // To set a max height to jump
  highScore: 0,
  score: 0,
  stage: 1
};

const calculateScore = (bonuses, obstacles, playerPosition, lastScore) => {
  const { x, y } = playerPosition;

  return bonuses.some(bonus => bonus.x === x && y === 10)
    ? lastScore + 10
    : obstacles.some(obstable => obstable.x === x && y !== 10)
    ? lastScore + 100
    : lastScore;
};

const removeAndMove = (array, distanceToMove) => {
  return array
    .filter(item => item.x > 0)
    .map(item => ({
      ...item,
      x: item.x - distanceToMove
    }));
};

const removeInTouchAndMove = (array, playerPosition, distanceToMove) => {
  const { x, y } = playerPosition;
  const touchedIndex = array.findIndex(item => item.x === x && y === 10);

  return removeAndMove(
    touchedIndex >= 0
      ? [...array.slice(0, touchedIndex), ...array.slice(touchedIndex + 1)]
      : array,
    distanceToMove
  );
};

function updateState(state = initialState, action) {
  switch (action.type) {
    case "JUMP":
      return !state.jumping
        ? {
            ...state,
            jumping: true,
            timeJumping: 1,
            playerPosition: {
              x: state.playerPosition.x,
              y: state.playerPosition.y + PLAYER_SPEED
            }
          }
        : state;
    case "TIME":
      return state.jumping && state.timeJumping < JUMP_MAX_HIGH
        ? {
            ...state,
            timeJumping: state.timeJumping + 1,
            playerPosition: {
              ...state.playerPosition,
              y: state.playerPosition.y + PLAYER_SPEED
            },
            obstacles: removeAndMove(state.obstacles, OBSTACLES_SPEED),
            bonuses: removeInTouchAndMove(
              state.bonuses,
              state.playerPosition,
              BONUSES_SPEED
            ),
            score: calculateScore(
              state.bonuses,
              state.obstacles,
              state.playerPosition,
              state.score
            )
          }
        : !state.jumping &&
          state.playerPosition.y > 0 &&
          state.playerPosition.y !== PLAYER_SPEED
        ? {
            ...state,
            timeJumping: 0,
            playerPosition: {
              ...state.playerPosition,
              y: state.playerPosition.y - PLAYER_SPEED
            },
            obstacles: removeAndMove(state.obstacles, OBSTACLES_SPEED),
            bonuses: removeInTouchAndMove(
              state.bonuses,
              state.playerPosition,
              BONUSES_SPEED
            ),
            score: calculateScore(
              state.bonuses,
              state.obstacles,
              state.playerPosition,
              state.score
            )
          }
        : {
            ...state,

            timeJumping: 0,
            jumping: false,
            obstacles: removeAndMove(state.obstacles, OBSTACLES_SPEED),
            bonuses: removeInTouchAndMove(
              state.bonuses,
              state.playerPosition,
              BONUSES_SPEED
            ),
            score: calculateScore(
              state.bonuses,
              state.obstacles,
              state.playerPosition,
              state.score
            )
          };
    case "MOVE_LEFT":
      return {
        ...state,
        playerPosition: {
          ...state.playerPosition,
          x: state.playerPosition.x - PLAYER_SPEED
        }
      };
    case "MOVE_RIGHT":
      return {
        ...state,
        playerPosition: {
          ...state.playerPosition,
          x: state.playerPosition.x + PLAYER_SPEED
        }
      };
    case "GENERATE_OBSTACLE":
      return Math.random() > OBSTACLE_CREATION_PROBABILITY
        ? {
            ...state,
            obstacles: [
              ...state.obstacles,
              {
                x: Math.ceil(container.offsetWidth / 10) * 10 - OBSTACLES_SPEED
              }
            ]
          }
        : state;
    case "GENERATE_BONUS":
      return Math.random() > BONUS_CREATION_PROBABILITY
        ? {
            ...state,
            bonuses: [
              ...state.bonuses,
              {
                x: Math.ceil(container.offsetWidth / 10) * 10 - BONUSES_SPEED
              }
            ]
          }
        : state;
    case "ADD_LEVEL":
      return {
        ...state,
        stage: state.stage + 1,
        generateMoreObstacles: state.stage > 2
      };
    case "SET_HIGHSCORE":
      return {
        ...state,
        highScore: action.payload.highScore
      };
    case "START":
      return {
        ...initialState,
        highScore: state.highScore
      };
    default:
      return state;
  }
}

const store = redux.createStore(updateState);
let lastObstaclesLength = 0;
let playerActualScore = 0;

store.subscribe(() => {
  const {
    playerPosition,
    obstacles,
    jumping,
    score: playerScore,
    highScore,
    stage,
    bonuses
  } = store.getState();
  const { x, y } = playerPosition;

  const collided = obstacles.some(obstable => obstable.x === x && y === 10);

  if (collided) {
    setGameOverScreen();
  }

  if (jumping) {
    playerImageJumping.removeAttribute("hidden");
    playerImageStand.setAttribute("hidden", true);
  } else {
    playerImageJumping.setAttribute("hidden", true);
    playerImageStand.removeAttribute("hidden");
  }

  player.style.left = `${x}px`;
  player.style.bottom = `${y}px`;

  removeElementsByClass("newObstacle");
  obstacles.forEach(obs => {
    const obstable = document.createElement("div");
    obstable.setAttribute("class", "newObstacle");
    obstable.style.left = `${obs.x}px`;

    const obstacleImageBack = new Image();
    obstacleImageBack.className = "newObstacleImageBack";
    obstacleImageBack.src = "assets/fireback.png";

    const obstacleImageFront = new Image();
    obstacleImageFront.className = "newObstacleImageFront";
    obstacleImageFront.src = "assets/firefront.png";

    obstable.appendChild(obstacleImageBack);
    obstable.appendChild(obstacleImageFront);

    container.appendChild(obstable);
  });

  removeElementsByClass("newBonus");
  bonuses.forEach(bon => {
    const bonus = document.createElement("img");
    bonus.setAttribute("class", "newBonus");
    bonus.setAttribute("src", "./assets/bonus.png");
    bonus.style.left = `${bon.x}px`;

    container.appendChild(bonus);
  });

  playerActualScore = playerScore;
  const playerScoreString = playerScore.toString().padStart(6, "0");
  const highScoreString = highScore.toString().padStart(6, "0");

  score.innerHTML = `1P-${playerScoreString} HI-${highScoreString} STAGE-0${stage}`;
});

const timeFn = () => {
  store.dispatch({ type: "TIME" });
};

const obstableGeneratorFn = () => {
  store.dispatch({ type: "GENERATE_OBSTACLE" });
};

const bonusGeneratorFn = () => {
  store.dispatch({ type: "GENERATE_BONUS" });
};

let timeInterval = null;
let obstacleGeneratorInterval = null;
let bonusGeneratorInterval = null;

const difficultyFn = () => {
  OBSTACLE_CREATION_PROBABILITY -= 0.1;
  store.dispatch({ type: "ADD_LEVEL" });
};

let difficultyInteval = setInterval(difficultyFn, 30000);

document.addEventListener("keydown", ({ code, target }) => {
  const targetName = target.tagName.toUpperCase();

  if (
    (code === "KeyS" || code === "KeyR") &&
    timeInterval === null &&
    obstacleGeneratorInterval === null &&
    bonusGeneratorInterval === null &&
    targetName !== "INPUT"
  ) {
    setGameScreen();
  }

  if (
    timeInterval !== null &&
    obstacleGeneratorInterval !== null &&
    bonusGeneratorInterval !== null
  ) {
    if (code === "ArrowRight") {
      store.dispatch({ type: "MOVE_RIGHT" });
    }

    if (code === "ArrowLeft") {
      store.dispatch({ type: "MOVE_LEFT" });
    }

    if (code === "Space") {
      titleHeader.innerHTML = "";
      titleHeader.setAttribute("hidden", true);
      store.dispatch({ type: "JUMP" });
    }
  }
});

const removeElementsByClass = className => {
  var elements = document.getElementsByClassName(className);
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
};

const setStartGameScreen = async () => {
  clearInterval(timeInterval);
  clearInterval(obstacleGeneratorInterval);
  clearInterval(bonusGeneratorInterval);
  timeInterval = null;
  obstacleGeneratorInterval = null;
  scoreboard.setAttribute("hidden", "true");
  store.dispatch({ type: "START" });

  const titleImage = new Image();
  titleImage.src = "./assets/title.png";
  titleImage.className = "logoImage";

  const initialTitle = document.createElement("p");
  initialTitle.innerHTML = "Press 's' to start";

  const buttonToScores = document.createElement("button");
  buttonToScores.onclick = () => {
    window.open("http://localhost:8080/allscores.html", "_self");
  };
  buttonToScores.innerHTML = "See scores";
  buttonToScores.setAttribute("class", "seeScores");

  titleHeader.innerHTML = null;
  titleHeader.style.paddingTop = 0;
  titleHeader.appendChild(titleImage);
  titleHeader.appendChild(initialTitle);
  titleHeader.appendChild(buttonToScores);

  const highScore = await fetch("http://localhost:8080/highscore");
  if (highScore.status === 200) {
    const parsedHighScore = await highScore.json();

    store.dispatch({
      type: "SET_HIGHSCORE",
      payload: { highScore: parsedHighScore.score }
    });
  }
};

const setGameScreen = () => {
  timeInterval = setInterval(timeFn, 50);
  obstacleGeneratorInterval = setInterval(obstableGeneratorFn, 1000);
  bonusGeneratorInterval = setInterval(bonusGeneratorFn, 1500);
  titleHeader.innerHTML = "Press 'space' to jump";
  store.dispatch({ type: "START" });
  container.style.animation = "animatedBackground 40s linear infinite";
  titleHeader.style.paddingTop = "8%";

  scoreboard.removeAttribute("hidden");

  music.play();
};

const setGameOverScreen = () => {
  clearInterval(timeInterval);
  clearInterval(obstacleGeneratorInterval);
  clearInterval(bonusGeneratorInterval);
  timeInterval = null;
  obstacleGeneratorInterval = null;
  bonusGeneratorInterval = null;
  titleHeader.removeAttribute("hidden");
  titleHeader.innerHTML = "Game over\n\r";

  const nameInput = document.createElement("input");
  nameInput.setAttribute("class", "nameInput");
  nameInput.setAttribute("placeholder", "Write your name and hit 'enter'");
  nameInput.onkeydown = async ({ code }) => {
    if (code === "Enter") {
      await fetch("http://localhost:8080", {
        method: "PUT",
        body: JSON.stringify({
          score: playerActualScore,
          name: nameInput.value
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      setStartGameScreen();
    }
  };

  titleHeader.appendChild(nameInput);

  container.style.animation = null;
  music.pause();
};