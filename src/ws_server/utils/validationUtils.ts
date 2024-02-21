import { Player } from '../models/Player';
import { players } from '../services/userService';

export const validatePlayerRegistration = (data: Player): boolean => {
	if (!data.name || !data.password || data.name.length < 5 || data.password.length < 5) {
		return false;
	}
	const existingPlayer = players.find((player) => player.name === data.name);
	if (existingPlayer) {
		return false;
	}
	return true;
};
