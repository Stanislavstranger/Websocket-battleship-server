import WebSocket from 'ws';
import { Player } from '../models/Player';

const handleGameCreation = (data: Player, ws: WebSocket): void => {
	const responseData = {
		type: 'create_game',
		data: JSON.stringify({
			idGame: 1,
			idPlayer: 0,
		}),
		id: 0,
	};
	const response = JSON.stringify(responseData);
	ws.send(response);
};

export default handleGameCreation;
