import { Ships } from '../models/models';

export const createMatrix = (data: Ships): number[][] => {
	const matrix: number[][] = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => 0));

	const ships = data.ships;

	for (const ship of ships) {
		const { x, y } = ship.position;
		const { direction, length } = ship;

		if (direction) {
			for (let i = 0; i < length; i++) {
				matrix[y + i][x] = 1;
			}
		} else {
			for (let i = 0; i < length; i++) {
				matrix[y][x + i] = 1;
			}
		}
	}

	return matrix;
};
