import db from '../data/db';
import { Games } from '../models/models';

export const createGame = (player1Id: number, player2Id: number): Games => {
	const game: Games = {
		id: db.games.length + 1,
		player1Id,
		player2Id,
		currentPlayerId: player1Id,
		winnerId: undefined,
		gameStatus: 'miss',
	};
	db.games.push(game);
	return game;
};

export const updateGameStatus = (gameId: number, status: 'miss' | 'killed' | 'shot'): void => {
	const game = db.games.find((game) => game.id === gameId);
	if (game) {
		game.gameStatus = status;
	}
};

export const setWinner = (gameId: number, winnerId: number): void => {
	const game = db.games.find((game) => game.id === gameId);
	if (game) {
		game.winnerId = winnerId;
	}
};
