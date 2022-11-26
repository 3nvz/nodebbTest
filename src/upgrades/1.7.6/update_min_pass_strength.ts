'use strict';

import { primaryDB as db } from '../../database';

export default  {
	name: 'Revising minimum password strength to 1 (from 0)',
	timestamp: Date.UTC(2018, 1, 21),
	method: async function () {
		const strength = await db.getObjectField('config', 'minimumPasswordStrength');
		if (!strength) {
			await db.setObjectField('config', 'minimumPasswordStrength', 1);
		}
	},
};
