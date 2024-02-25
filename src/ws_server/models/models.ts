export interface Player {
	name: string;
	password: string;
}

export interface Players {
	name: string;
	password: string;
	id: number;
}

export interface Rooms {
	id: number;
	players: number[];
	gameId: number;
}

export interface Games {
	id: number;
	player1Id: number;
	player2Id: number;
	currentPlayerId: number;
	winnerId: number | undefined;
	gameStatus: 'miss' | 'killed' | 'shot';
}

export interface Ships {
	gameId: number;
	ships: [
		{
			position: {
				x: number;
				y: number;
			};
			direction: boolean;
			length: number;
			type: 'small' | 'medium' | 'large' | 'huge';
		},
	];
	indexPlayer: number;
	ws: WebSocket;
}

export interface Connections {
	playerId: number;
	ws: WebSocket;
}

export interface Winners {
	name: string;
	win: number;
}

export interface DB {
	players: Players[];
	rooms: Rooms[];
	games: Games[];
	ships: Ships[];
	connections: Connections[];
	winners: Winners[];
}
