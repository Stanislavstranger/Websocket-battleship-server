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

export interface Ship {
	position: Position;
	direction: boolean;
	length: number;
	type: 'small' | 'medium' | 'large' | 'huge';
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
	matrix: number[][];
	indexPlayer: number;
	ws: WebSocket;
	isFinish?: number;
}

export interface Connections {
	playerId: number;
	ws: WebSocket;
}

export interface Winners {
	name: string;
	win: number;
}
interface Position {
	x: number;
	y: number;
}

export interface AttackData {
	x: number;
	y: number;
	gameId: number;
	indexPlayer: number;
}

export interface RandomAttackData {
	gameId: number;
	indexPlayer: number;
}

export interface AttackFeedbackData {
	position: Position;
	currentPlayer: number | string;
	status: 'miss' | 'killed' | 'shot';
}

export interface DB {
	players: Players[];
	rooms: Rooms[];
	games: Games[];
	ships: Ships[];
	connections: Connections[];
	winners: Winners[];
}
