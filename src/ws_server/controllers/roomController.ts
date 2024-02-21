import WebSocket from 'ws';
import { Players } from '../models/models';

const handleRoomCreation = (data: Players, ws: WebSocket): void => {
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

export default handleRoomCreation;
