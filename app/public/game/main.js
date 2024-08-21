import boardFunc from "./board/boardFunc.js";

let initialBoard = boardFunc.createInitialArray();
boardFunc.boardSetup(initialBoard);

const socket = io();

let playerTurn = ["blue", "green", "red", "yellow"]
let highlightedDiv = []
let pieceClicked;

function highlight(moves){
    moves.forEach(({ row, col }) => {
        const id = `${row}-${col}`;
        const element = document.getElementById(id);
        if (element) {
            element.classList.add("highlight");
            highlightedDiv.push(element);
        }
    });
}

function unHighlight(){
    highlightedDiv.forEach(element => {
        element.classList.remove("highlight")
    })
    highlightedDiv = []
}

cell.addEventListener("click", (event) => {
    const tile = event.target.closest(".tile");

    if (!tile) {
        return;
    }

    const { id } = tile;
    const [rowStr, colStr] = id.split("-");
    const row = parseInt(rowStr);
    const col = parseInt(colStr);
    const positionDict = { row, col };

    if(typeof initialBoard[row][col] === "object"){
        if(initialBoard[row][col].getPlayer() === playerTurn[0]){
            let piece = initialBoard[row][col];
            if(piece !== pieceClicked){
                unHighlight();
                let moves = piece.getPossibleMoves(initialBoard);
                highlight(moves);
                pieceClicked = piece;
            } else {
                return;
            }
        }
    }

    if(tile.classList.contains("highlight") && pieceClicked){
        const previousPosition = pieceClicked.getPosition();
        const currentPosition = positionDict;
        pieceClicked.setPosition(currentPosition, initialBoard)
        unHighlight();
        playerTurn.push(playerTurn.shift());

        socket.emit("gameUpdate", {
            from: {
                row: previousPosition.row,
                col: previousPosition.col
            },
            to: currentPosition
        });
        pieceClicked = null;
    }
});

socket.on("gameUpdate", ({ from, to }) => {
    const piece = initialBoard[from.row][from.col];
    if (piece) {
        piece.setPosition(to, initialBoard)
    }
});