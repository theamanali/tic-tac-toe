const MARKER_X = "X"
const MARKER_O = "O"

const startGameButton = document.querySelector("#startGameButton");
const form = document.querySelector(".startGameForm");
const gameContainer = document.querySelector(".game-container");
const turnHeader = document.querySelector(".player-turn");
const winnerDialog = document.querySelector(".winner-dialog");
const winnerText = document.querySelector(".winner-text");

let game;

startGameButton.addEventListener("click", (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const player1Name = formData.get("playerOneName");
    const player2Name = formData.get("playerTwoName");

    game = new Game(player1Name, player2Name);

    DisplayController.hideStartGameForm();
    DisplayController.showGameBoard();
    DisplayController.setTurnHeader(game.getCurrentPlayerName(), 1);
})

gameContainer.addEventListener("click", (e) => {
    e.preventDefault();

    const index = Number(e.target.id);
    e.target.textContent = game.getCurrentPlayerMarker()
    game.playRound(index);

    if (game.checkWinner()) {
        game.toggleIsOver();


        DisplayController.changeWinnerDialogHeader(game.getCurrentPlayerName(), game.getTurn());
        DisplayController.shoeWinnerDialog();
    }
    else {
        DisplayController.setTurnHeader(game.getCurrentPlayerName(), game.getTurn());
    }
})

winnerDialog.addEventListener("click", (e) => {
    e.preventDefault();

    if (e.target.classList.contains("restart-button-same")) {

    }
})

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
    const winningCombos = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]]

    const player1 = createPlayer(player1Name, MARKER_X);
    const player2 = createPlayer(player2Name, MARKER_O);

    let currentPlayer = player1;
    let currentTurn = 1;
    let isOver = false;

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

        function getBoard() {
            return [...gameBoard];
        }

        function reset() {
            gameBoard = Array(9).fill(null);
        }

        return {reset, placeMarker, getBoard};
    })();

    function playRound(index) {
        if (GameBoard.placeMarker(currentPlayer.getMarker(), index)) {
            if (currentTurn === 9 || checkWinner()) {
                isOver = true;
            }
            else {
                if (currentPlayer === player1) {
                    currentPlayer = player2;
                }
                else currentPlayer = player1;

                currentTurn++;
            }
        }
    }

    function checkWinner() {
        const board = GameBoard.getBoard();

        for (const [a, b, c] of winningCombos) {
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return true
            }
        }

        return false;
    }

    function isGameOver() {
        return isOver;
    }

    function toggleIsOver() {
        isOver = !isOver;
    }

    function getTurn() {
        return currentTurn;
    }

    function getCurrentPlayerName() {
        return currentPlayer.getName();
    }

    function getCurrentPlayerMarker() {
        return currentPlayer.getMarker();
    }

    function resetGame(withNewPlayers) {

    }

    return {playRound, checkWinner, isGameOver, getTurn, getCurrentPlayerName, getCurrentPlayerMarker, toggleIsOver};
}

const DisplayController = (() => {
    const setVisible = (element, visible) => element.classList.toggle("hidden", !visible);

    return {
        showGameBoard: () => setVisible(gameContainer, true),
        hideGameBoard: () => setVisible(gameContainer, false),
        showStartGameForm: () => setVisible(form, true),
        changeWinnerDialogHeader (name, turn) {
            winnerText.textContent = `${name} won the game in ${turn} turns`;
        },
        shoeWinnerDialog: () => {winnerDialog.showModal()},
        hideStartGameForm: () => {
            form.reset();
            setVisible(form, false);
        },
        setTurnHeader: (name, turn) => {
            turnHeader.textContent = `Turn ${turn}: ${name}`;
        }
    };
})();







