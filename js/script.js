const MARKER_X = "X"
const MARKER_O = "O"

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
    name = name[0].toUpperCase() + name.toLowerCase().slice(1)

    function getName() {
        return name;
    }

    function getMarker() {
        return marker;
    }

    return {getName, getMarker};
}

const Game = function(player1Name, player2Name, player1Marker, player2Marker) {
    const player1 = createPlayer(player1Name, player1Marker);
    const player2 = createPlayer(player2Name, player2Marker);
    let currentPlayer;
    let currentTurn = 1;
    const winningCombos = [[0,1,2], [0,3,6], [0,4,8], [1,4,7], [2,5,8], [3,4,5], [6,7,8], [2,4,6]]
    let isOver = false;

    if (player1.getMarker() === MARKER_X) {
        currentPlayer = player1;
    }
    else {
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
                    }
                    else currentPlayer = player1;
                }
            }
        }
    }

    function checkWin() {
        const board = GameBoard.getBoard();   // ← call it once
        for (const [a, b, c] of winningCombos) {
            if (
                board[a] !== '' &&
                board[a] === board[b] &&
                board[a] === board[c]
            ) {
                isOver = true;
                return true;
            }
        }
        return false;
    }

    function isGameOver() {
        return isOver;
    }

    return {playRound, getCurrentPlayerName, getCurrentPlayerMarker, getCurrentTurn, isGameOver};
};

const game = Game("Aman", "Tara", MARKER_X, MARKER_O);

while (game.getCurrentTurn() < 10 && !game.isGameOver()) {
    let index = prompt("Select index to place marker");
    game.playRound(index);
}