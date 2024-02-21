import WebSocket from 'ws';
import { RegisteredPlayer } from '../models/models';

const handleRoomUpdate = (data: RegisteredPlayer, ws: WebSocket): void => {
	const responseData = {
		type: 'update_room',
		data: JSON.stringify([
			{
				roomId: 1,
				roomUsers: [
					{
						name: data.name,
						index: data.id,
					},
				],
			},
		]),
		id: 0,
	};
	const response = JSON.stringify(responseData);
	ws.send(response);
};

export default handleRoomUpdate;
