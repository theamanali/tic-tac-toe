const MARKER_X = "X"
const MARKER_O = "O"

const createPlayer = (name, marker) => {
    let currentName = "";
    let currentMarker = "";

    const getName = () => currentName;
    const getMarker = () => currentMarker;

    function setName(name) {
        if (name === "") {
            if (marker === MARKER_X) {
                currentName = "X";
            }
            else if (marker === MARKER_O) {
                currentName = "O";
            }
        }
        else {
            currentName = name[0].toUpperCase() + name.toLowerCase().slice(1);
        }
    }

    function setMarker(marker) {
        currentMarker = marker;
    }

    function toggleMarker() {
        if (currentMarker === MARKER_X) {
            currentMarker = MARKER_O;
        }
        else {
            currentMarker = MARKER_X;
        }
    }

    setName(name);
    setMarker(marker);

    return {getName, getMarker, setName, toggleMarker};
}

const Game = function(player1Name, player2Name) {
    const winningCombos = new Set();

    const player1 = createPlayer(player1Name, MARKER_X);
    const player2 = createPlayer(player2Name, MARKER_O);

    let currentPlayer = player1;
    let currentTurn = 1;
    let isOver = false;

    //IIFE for GameBoard
    const GameBoard = (() => {
        let gameBoard = Array(9).fill(null);

        function placeMarker(marker, index) {
            if (gameBoard[index] === null) {
                gameBoard[index] = marker;
                return true;
            }
            else {
                return false;
            }
        }

        function reset() {
            gameBoard = Array(9).fill(null);
        }

        return {reset, placeMarker}
    })();

    function playRound(index) {
        if (GameBoard.placeMarker(currentPlayer.getMarker(), index)) {
            if (currentPlayer === player1) {
                currentPlayer = player2;
            }
            else currentPlayer = player1;

            currentTurn++;
        }

        if (currentTurn === 9 || checkWinner()) {
            isOver = true;
        }
    }

    function checkWinner() {
        if () {
            isOver = true;
        }
    }

    function isGameOver() {
        return isOver;
    }

    function getTurn() {
        return currentTurn;
    }

    function getCurrentPlayerName() {
        return currentPlayer.getName();
    }
    return {playRound, checkWinner, isGameOver, getTurn, getCurrentPlayerName};
}

const createDisplayController = ((form, gameContainer, turnHeader) => {

    const setVisible = (el, visible) => el.classList.toggle("hidden", !visible);

    return {
        showGameBoard: () => setVisible(gameContainer, true),
        hideGameBoard: () => setVisible(gameContainer, false),
        showStartGameForm: () => setVisible(form, true),
        hideStartGameForm: () => {
            form.reset();
            setVisible(form, false);
        },
        setTurnHeader: (name, turn) => {
            turnHeader.textContent = `Turn ${turn}: ${name}`;
        }
    };
});

const startGameButton = document.querySelector("#startGameButton");
const form = document.querySelector(".startGameForm");
const gameContainer = document.querySelector(".game-container");
const turnHeader = document.querySelector(".player-turn");

const displayController = createDisplayController(form, gameContainer, turnHeader);
let game;

startGameButton.addEventListener("click", (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    console.log(formData.get("playerOneName"));
    const player1Name = formData.get("playerOneName");
    const player2Name = formData.get("playerTwoName");

    game = new Game(player1Name, player2Name);

    displayController.hideStartGameForm();
    displayController.showGameBoard();
    displayController.setTurnHeader(game.getCurrentPlayerName(), 1);
})








