/* eslint-disable no-console */
/* istanbul ignore file */

import { CLIEngine } from 'eslint';

function linterReporter( results ) {
	const formatter = CLIEngine.getFormatter();

	console.log( formatter( results ) );
}

export default linterReporter;
