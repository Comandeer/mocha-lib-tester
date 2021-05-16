/* istanbul ignore file */

import Runner from './Runner.js';
import Logger from './Logger.js';
import RunController from './RunController.js';

function mlt( config ) {
	const runner = new Runner();
	const logger = new Logger( runner );
	const controller = new RunController( runner, logger, config );

	return controller;
}

export default mlt;
