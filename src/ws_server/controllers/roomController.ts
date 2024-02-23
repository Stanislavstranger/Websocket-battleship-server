import db from '../data/db';

const handleRoomUpdate = (): void => {
	const roomsWithOnePlayer = db.rooms.filter((room) => room.players.length < 2);
	const data = roomsWithOnePlayer.map((room) => {
		const player = db.players.find((player) => player.id === room.players[0]);
		return {
			roomId: room.id,
			roomUsers: [
				{
					name: player?.name,
					index: player?.id,
				},
			],
		};
	});

	const responseData = {
		type: 'update_room',
		data: JSON.stringify(data),
		id: 0,
	};

	const response = JSON.stringify(responseData);

	db.connections.forEach((connection) => {
		connection.ws.send(response);
	});
};

export default handleRoomUpdate;
