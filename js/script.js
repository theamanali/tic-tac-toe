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
            currentName = name[0].toUpperCase() + name.toLowerCase().slice(1)
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
    const player1 = createPlayer(player1Name, MARKER_X);
    const player2 = createPlayer(player2Name, MARKER_O);

    //IIFE for GameBoard
    const GameBoard = (() => {
        let gameBoard = Array(9).fill("");

        function placeMarker(marker, index) {
            gameBoard[index] = marker;
        }

        function reset() {
            gameBoard = Array(9).fill("");
        }

        return {reset, placeMarker}
    })();


}







