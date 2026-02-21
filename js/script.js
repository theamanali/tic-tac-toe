const MARKER_X = "X"
const MARKER_O = "O"

const startGameButton = document.querySelector("#startGameButton");
const form = document.querySelector(".startGameForm");
const gameContainer = document.querySelector(".game-container");
const turnHeader = document.querySelector(".player-turn");
const winnerDialog = document.querySelector(".winner-dialog");
const winnerText = document.querySelector(".winner-text");

let game;

// Bootstrap a new game from form input and render the game UI.
startGameButton.addEventListener("click", (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const player1Name = formData.get("playerOneName");
    const player2Name = formData.get("playerTwoName");

    const player1 = createPlayer(player1Name, MARKER_X);
    const player2 = createPlayer(player2Name, MARKER_O);

    game = new Game(player1, player2);

    DisplayController.hideStartGameForm();
    DisplayController.showGameBoard();
    DisplayController.setTurnHeader(game.getCurrentPlayerName(), 1);
})

// Handle board clicks: place a marker, resolve win/draw, then update UI text.
gameContainer.addEventListener("click", (e) => {
    e.preventDefault();

    if (!game || game.isGameOver()) return;

    const index = Number(e.target.id);
    DisplayController.placeMarker(index);
    game.playRound(index);

    if (game.checkWinner()) {
        DisplayController.changeWinnerDialogHeader(game.getCurrentPlayerName(), game.getTurn());
        DisplayController.showWinnerDialog();
    }
    else {
        DisplayController.setTurnHeader(game.getCurrentPlayerName(), game.getTurn());
        if (game.isGameOver()) {
            DisplayController.setDrawDialogHeader();
            DisplayController.showWinnerDialog();
        }
    }
})

winnerDialog.addEventListener("cancel", (e) => {
    e.preventDefault();

    game.resetGame()
    DisplayController.hideWinnerDialog();
    DisplayController.clearGameBoard();
    DisplayController.setTurnHeader(game.getCurrentPlayerName(), game.getTurn());
});

// Dialog actions support both "same players" restart and "new players" restart.
winnerDialog.addEventListener("click", (e) => {
    if (e.target.classList.contains("restart-button-same")) {
        game.resetGame()
        DisplayController.hideWinnerDialog();
        DisplayController.clearGameBoard();
        DisplayController.setTurnHeader(game.getCurrentPlayerName(), game.getTurn());
    }
    else if (e.target.classList.contains("restart-button-differ")) {
        DisplayController.hideWinnerDialog();
        DisplayController.clearGameBoard();
        DisplayController.hideGameBoard();
        DisplayController.showStartGameForm();
    }
});

// Player factory keeps name/marker state private and exposes a small API.
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

const Game = function(player1, player2) {
    // Every 3-cell index combination that wins on a 3x3 board.
    const winningCombos = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]]

    let currentPlayer = player1;
    let currentTurn = 1;
    let isOver = false;

    // Internal board module (encapsulated so only Game controls board writes).
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

    // Applies the current player's move and advances game state when valid.
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

    // Starts a fresh round and alternate who begins.
    function resetGame() {
        if (currentPlayer === player1) {
            currentPlayer = player2;
        }
        else currentPlayer = player1;

        currentTurn = 1;
        isOver = false;
        GameBoard.reset();
    }

    return {playRound, checkWinner, isGameOver, getTurn, getCurrentPlayerName, getCurrentPlayerMarker, toggleIsOver, resetGame};
}

// Display-only helpers that keep DOM concerns separate from game rules.
const DisplayController = (() => {
    const divContainer = gameContainer.querySelector(".div-container");
    const cells = divContainer.querySelectorAll("div");

    const setVisible = (element, visible) => element.classList.toggle("hidden", !visible);

    return {
        showGameBoard: () => setVisible(gameContainer, true),
        hideGameBoard: () => setVisible(gameContainer, false),
        showStartGameForm: () => setVisible(form, true),
        clearGameBoard: () => {
            cells.forEach(cell => {
                cell.textContent = "";
            })
        },
        placeMarker: (index) => {
            const cell = cells[index];

            if (cell.textContent === "") {
                cell.textContent = game.getCurrentPlayerMarker()
            }

        },
        changeWinnerDialogHeader (name, turn) {
            winnerText.textContent = `${name} won the game in ${turn} turns!`;
        },
        setDrawDialogHeader () {
            winnerText.textContent = `It's a draw!`;
        },
        showWinnerDialog: () => {winnerDialog.showModal()},
        hideWinnerDialog: () => {winnerDialog.close()},
        hideStartGameForm: () => {
            form.reset();
            setVisible(form, false);
        },
        setTurnHeader: (name, turn) => {
            turnHeader.textContent = `Turn ${turn}: ${name}`;
        }
    };
})();






