import { collisionDetection, sameTeamDetection } from "/game/movement/collision.js";
import { outOfBound } from "/game/movement/positionCheck.js";
import { yPawn, bPawn, gPawn, rPawn } from "./direction.js";

export function getNonFiniteMoves(boardState, directions, position, player){
	let moves = []
	for (const direction of directions){
		let {row, col} = position;
		while (true){
			row += direction.row;
			col += direction.col;

			if(outOfBound(boardState, row, col)){
				break;
			}

			if(collisionDetection(boardState, {row, col})){
				if(!sameTeamDetection(boardState, {row, col}, player)){
					moves.push({row, col});
				}
				break;
			} else {
				moves.push({row, col});
			}
		}
	}
	return moves;
}

export function getFiniteMoves(boardState, directions, position, player){
	let moves = []
	for (const direction of directions){
		const row = position.row + direction.row;
		const col = position.col + direction.col;

		if(!outOfBound(boardState, row, col)){
			if(collisionDetection(boardState, {row, col})){
				if(!sameTeamDetection(boardState, {row, col}, player)){
					moves.push({row, col});
				}
			} else {
				moves.push({row, col});
			}
		}
	}
	return moves;
}


export function getPawnMoves(boardState, position, player){
	let moves = []
	let row, col;

	if(player === "yellow" && yPawn.some(pawn => pawn.row === position.row && pawn.col === position.col) || 
		player === "blue" && bPawn.some(pawn => pawn.row === position.row && pawn.col === position.col) || 
		player === "red" && rPawn.some(pawn => pawn.row === position.row && pawn.col === position.col) ||
		player === "green" && gPawn.some(pawn => pawn.row === position.row && pawn.col === position.col)
	){
		for(let i = 1; i <=2; i++){
			switch (player) {
				case 'blue':
					row = position.row + i;
					col = position.col;
					break;
				case 'green':
					row = position.row;
					col = position.col - i;
					break;
				case 'red':
					row = position.row - i;
					col = position.col;
					break;
				case 'yellow':
					row = position.row;
					col = position.col + i;
					break;
			}
			if(!outOfBound(boardState, row, col)){
				if(!collisionDetection(boardState, {row, col})){
					moves.push({row, col});
				} else {
					break;
				}
			}
		}
	} else {
		switch (player) {
			case 'blue':
				row = position.row + 1;
				col = position.col;
				break;
			case 'green':
				row = position.row;
				col = position.col - 1;
				break;
			case 'red':
				row = position.row - 1;
				col = position.col;
				break;
			case 'yellow':
				row = position.row;
				col = position.col + 1;
				break;
		}
		if(!outOfBound(boardState, row, col)){
			if(!collisionDetection(boardState, {row, col})){
				moves.push({row, col});
			}
		}
	}
	for (let i = -1; i <=1; i+=2){
		switch (player) {
			case 'blue':
				row = position.row + 1;
				col = position.col + i;
				break;
			case 'green':
				row = position.row + i;
				col = position.col - 1;
				break;
			case 'red':
				row = position.row - 1;
				col = position.col + i;
				break;
			case 'yellow':
				row = position.row + i;
				col = position.col + 1;
				break;
		}
		if(collisionDetection(boardState, {row, col})){
			if(!sameTeamDetection(boardState, {row, col}, player)){
				moves.push({row, col});
			}
		}
	}

	return moves
}