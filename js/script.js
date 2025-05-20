const MARKER_X = "X"
const MARKER_O = "O"

const startGameButton = document.querySelector("#startGameButton");
const gridContainer = document.querySelector(".grid-container");
const winnerDialog = document.querySelector(".winner-dialog");

let game;

startGameButton.addEventListener("click", () => {
    const player1Name = document.querySelector("#playerOneName").value;
    const player2Name = document.querySelector("#playerTwoName").value;

    game = Game(player1Name, player2Name);
    
    displayController.hideStartGameForm();
    displayController.showGame();
    displayController.setTurnHeader(game.getCurrentPlayerName(), game.getCurrentTurn());
});

gridContainer.addEventListener("click", (e) => {
    let spot = e.target;
    let spotIndex = Number(spot.id) - 1

    displayController.displayMarker(game.getCurrentPlayerMarker(), spot)
    game.playRound(spotIndex);
    
    if (game.isGameOver()) {
        if (game.getCurrentTurn() <= 9 || game.checkWin()) {
            displayController.showWinnerDialog(game.getCurrentPlayerName());
        }
        else {
            displayController.showWinnerDialog(game.getCurrentPlayerName(), true);
        }
    }
    else {
        displayController.setTurnHeader(game.getCurrentPlayerName(), game.getCurrentTurn());
    }
});

winnerDialog.addEventListener("click", (e) => {
    if (e.target.classList.contains("restart-button-same")) {
        game.resetGame();
        displayController.resetGameDisplay();
        displayController.hideWinnerDialog();
    }
    else if (e.target.classList.contains("restart-button-differ")) {
        game.resetGame();
        displayController.resetGameDisplay();
        displayController.hideWinnerDialog();
        displayController.hideGame();
        displayController.showStartGameForm();
    }
})

const displayController = function () {
    const startGameForm = document.querySelector(".startGameForm")
    const playerOneInput    = document.querySelector("#playerOneName");
    const playerTwoInput    = document.querySelector("#playerTwoName");
    const gameGridContainer = document.querySelector(".grid-container");
    const spots = gameGridContainer.childNodes;
    const gameTurnHeader = document.querySelector(".player-turn");
    const gameDisplay = document.querySelector(".game-container");
    const winnerDialog = document.querySelector(".winner-dialog");
    const winnerText = document.querySelector(".winner-text");
    
    
    function hideStartGameForm() {
        playerOneInput.value = "";
        playerTwoInput.value = "";
        startGameForm.classList.add("hidden")
    }
    
    function showStartGameForm() {
        startGameForm.classList.remove("hidden")
    }
    
    function showGame() {
        gameDisplay.classList.remove("hidden")
    }
    
    function hideGame() {
        gameDisplay.classList.add("hidden")
    }
    
    function showWinnerDialog(winnerName = "", isDraw = false) {
        winnerDialog.showModal()
        
        if (isDraw) {
            winnerText.textContent = "It's a draw!"
        }
        else {
            winnerText.textContent = winnerName + " won the game!"
        }
    }

    function hideWinnerDialog() {
        winnerDialog.close();
    }
    
    function resetGameDisplay() {
        spots.forEach((spot) => spot.textContent = "");
        
        setTurnHeader(game.getCurrentPlayerName(), game.getCurrentTurn());
    }
    
    function setTurnHeader(name, turn) {
        gameTurnHeader.textContent = `Turn ${turn}: ${name}`;
    }
    
    function displayMarker(marker, spot) {
        if (spot.textContent === "") {
            spot.textContent = marker; 
        }
    }
    
    return {hideStartGameForm, showStartGameForm, hideGame, showGame, setTurnHeader, displayMarker, resetGameDisplay, showWinnerDialog, hideWinnerDialog};
}()

const GameBoard = (function() {
    let gameBoard = ["", "", "", "", "", "", "", "", ""];

    function resetGameBoard() {
        for (let i = 0; i < gameBoard.length; i++) {
            gameBoard[i] = "";
        }
    }

    function placeMarker(index, marker) {
        if (gameBoard[index] === "") {
            gameBoard[index] = marker;
        }
    }

    function getBoard() {
        return gameBoard;
    }

    return {resetGameBoard, placeMarker, getBoard};
})();

function createPlayer(name, marker) {
    if (name === "") {
        if (marker === MARKER_X) {
            name = "X";
        }
        else if (marker === MARKER_O) {
            name = "O";
        }
    } else {
        name = name[0].toUpperCase() + name.toLowerCase().slice(1)
    }
    
    function getName() {
        return name;
    }

    function getMarker() {
        return marker;
    }

    return {getName, getMarker};
}

const Game = function(player1Name, player2Name) {
    const player1 = createPlayer(player1Name, MARKER_X);
    const player2 = createPlayer(player2Name, MARKER_O);
    let currentPlayer;
    let currentTurn = 1;
    const winningCombos = [[0, 1, 2], [0, 3, 6], [0, 4, 8], [1, 4, 7], [2, 5, 8], [3, 4, 5], [6, 7, 8], [2, 4, 6]]
    let isOver = false;

    if (player1.getMarker() === MARKER_X) {
        currentPlayer = player1;
    } else {
        currentPlayer = player2;
    }

    function getCurrentPlayerName() {
        return currentPlayer.getName();
    }

    function getCurrentPlayerMarker() {
        return currentPlayer.getMarker();
    }

    function getCurrentTurn() {
        return currentTurn;
    }

    function playRound(index) {
        if (currentTurn < 10) {
            if (GameBoard.getBoard()[index] === '') {
                GameBoard.placeMarker(index, currentPlayer.getMarker());
                currentTurn++;

                if (!checkWin()) {
                    if (currentPlayer === player1) {
                        currentPlayer = player2;
                    } else currentPlayer = player1;
                }
            }
        }
    }

    function checkWin() {
        const board = GameBoard.getBoard();
        
        for (const [a, b, c] of winningCombos) {
            if (board[a] !== '' && board[a] === board[b] && board[a] === board[c]) {
                isOver = true;
                return true;
            }
        }
        return false;
    }

    function isGameOver() {
        return isOver;
    }

    function resetGame() {
        GameBoard.resetGameBoard();
        isOver = false;
        currentTurn = 1;
    }

    return {
        playRound,
        getCurrentPlayerName,
        getCurrentPlayerMarker,
        getCurrentTurn,
        isGameOver,
        resetGame,
        checkWin
    };
};