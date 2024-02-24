import { Player } from '../models/models';
import { createPlayer, getPlayerByName, getPlayerByWs } from '../services/playerService';
import { addConnection } from '../services/connectionService';
import db from '../data/db';

export const validatePlayerRegistration = (data: Player, ws: WebSocket): boolean => {
	const { name, password } = data;
	if (!name || !password || name.length < 5 || password.length < 5) {
		return false;
	}

	const player = getPlayerByName(name);

	if (!player) {
		createPlayer(name, password, ws);
		return true;
	}

	if (player.password !== password) {
		return false;
	}

	addConnection(player.id, ws as any);
	return true;
};
