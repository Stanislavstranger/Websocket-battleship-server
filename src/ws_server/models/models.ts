export interface Player {
	name: string;
	password: string;
}

export interface RegisteredPlayer {
	name: string;
	password: string;
	id: number;
}

export interface Rooms {
	id: number;
	players: RegisteredPlayer[];
	gameId: number;
}

export interface Games {
	id: number;
	player1Id: number;
	player2Id: number;
	currentPlayerId: number;
	winnerId: number;
	gameStatus: 'miss' | 'killed' | 'shot';
}

export interface Ships {
	id: number;
	gameId: number;
	playerId: number;
	positionX: number;
	positionY: number;
	direction: boolean;
	length: number;
	type: 'small' | 'medium' | 'large' | 'huge';
}

export interface DB {
	players: RegisteredPlayer[];
	rooms: Rooms[];
	games: Games[];
	ships: [];
}
