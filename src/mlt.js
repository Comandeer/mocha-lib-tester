/* istanbul ignore file */

import Runner from './Runner.js';
import Logger from './Logger.js';
import prepareSteps from './prepareSteps.js';

async function mlt( projectPath, {
	requestedSteps = [ 'lint', 'test', 'coverage', 'codecov' ],
	isWatch = false
} = {} ) {
	const steps = prepareSteps( projectPath, {
		requestedSteps,
		isWatch
	} );
	const runner = new Runner();

	new Logger( runner );
	runner.addSteps( steps );

	const result = await runner.run();
	const exitCode = result ? 0 : 1;

	return exitCode;
}

export default mlt;
