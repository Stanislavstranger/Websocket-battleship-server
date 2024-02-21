import { Player } from '../models/Player';

export const validatePlayerRegistration = (data: Player): boolean => {
	console.log('🚀 ~ validatePlayerRegistration ~ data:', data);
	if (!data.name || !data.password || data.name.length < 5 || data.password.length < 5) {
		return false;
	}
	return true;
};
