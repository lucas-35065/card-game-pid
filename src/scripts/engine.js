const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById("score_points"),
  },
  cardSprites: {
    avatar: document.getElementById("card-image"),
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type"),
  },
  fieldCards: {
    player: document.getElementById("player-field-card"),
    computer: document.getElementById("computer-field-card"),
  },
  playerSides: {
    player1: "player-cards",
    player1BOX: document.querySelector("#player-cards"),
    computer: "computer-cards",
    computerBOX: document.querySelector("#computer-cards"),
  },
  actions: {
    button: document.getElementById("next-duel"),
  },
};

const pathImages = "./src/assets/icons/";

const cardData = [
  {
    id: 0,
    name: "Blue Eyes white Dragon",
    type: "Paper",
    img: `${pathImages}dragon.png`,
    winOf: [1],
    LoseOf: [2],
  },
  {
    id: 1,
    name: "Dark Magician",
    type: "Rock",
    img: `${pathImages}magician.png`,
    winOf: [2],
    LoseOf: [0],
  },
  {
    id: 2,
    name: "Exodia",
    type: "Scissors",
    img: `${pathImages}exodia.png`,
    winOf: [0],
    LoseOf: [1],
  },
];

async function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length);
  return cardData[randomIndex].id;
}

async function crateCardImage(idCard, fieldSide) {
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", `${pathImages}card-back.png`);
  cardImage.setAttribute("data-id", idCard);
  cardImage.classList.add("card");

  if (fieldSide === state.playerSides.player1) {
    cardImage.addEventListener("click", () => {
      setCardsField(cardImage.getAttribute("data-id"));
    });
    cardImage.addEventListener("mouseover", () => {
      drawSelectedCard(idCard);
    });
  }
  return cardImage;
}

async function drawSelectedCard(id) {
  state.cardSprites.avatar.src = cardData[id].img;
  state.cardSprites.name.innerText = cardData[id].name;
  state.cardSprites.type.innerText = `Attribute: ${cardData[id].type}`;
}

async function drawCards(cardNumber, fieldSide) {
  for (let i = 0; i < cardNumber; i++) {
    const randomIdCard = await getRandomCardId();
    const cardImage = await crateCardImage(randomIdCard, fieldSide);
    document.getElementById(fieldSide).appendChild(cardImage);
  }
}

async function hiddenCardDetails() {
  state.cardSprites.avatar.src = "";
  state.cardSprites.name.innerText = "";
  state.cardSprites.type.innerText = "";
}

async function showHiddenCardFieldsImages(value) {
  if (value === true) {
    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";
  } 

	if (value ===false){
		state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
	}
}

async function drawCardsInField (cardId, computerCardId) {
	state.fieldCards.player.src = cardData[cardId].img;
  state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function resetDuel() {
  state.cardSprites.avatar.src = "";
  state.actions.button.style.display = "none";

  state.fieldCards.player.style.display = "none";
  state.fieldCards.computer.style.display = "none";

  init();
}

async function drawButton(text) {
	state.actions.button.innerText = text;
	state.actions.button.style.display = "block";
}


async function playAudio(status) {
  const audio = new Audio(`./src/assets/audios/${status}.wav`);
  audio.play();
}

async function checkDuelResults(playerCardId, computerCardId) {
  let duelResults = "DRAW";
  let playerCard = cardData[playerCardId];

  if (playerCard.winOf.includes(computerCardId)) {
    duelResults = "WIN";
    await playAudio(duelResults);
    state.score.playerScore++;
  }

  if (playerCard.LoseOf.includes(computerCardId)) {
    duelResults = "LOSE";
    await playAudio(duelResults);
    state.score.computerScore++;
  }
  return duelResults;
}

async function updateScore() {
  state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function removeAllCardsImages() {
  let { computerBOX, player1BOX } = state.playerSides;
  let imgElements = computerBOX.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());

  imgElements = player1BOX.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());
}

async function setCardsField(cardId) {
  await removeAllCardsImages();

  let computerCardId = await getRandomCardId();

  await hiddenCardDetails();
  await showHiddenCardFieldsImages(true);
	await drawCardsInField (cardId, computerCardId);

  let duelResults = await checkDuelResults(cardId, computerCardId);

  await updateScore();
  await drawButton(duelResults);
}

function init() {
  showHiddenCardFieldsImages(false);
  drawCards(5, state.playerSides.player1);
  drawCards(5, state.playerSides.computer);
	const bgm = document.getElementById('bgm');
	bgm.play();
}

init();
