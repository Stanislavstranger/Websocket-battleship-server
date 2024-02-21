import { Player } from '../models/Player';

export const validatePlayerRegistration = (data: Player): boolean => {
	if (!data.name || !data.password || data.name.length < 5 || data.password.length < 5) {
		return false;
	}
	return true;
};
