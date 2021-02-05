/* eslint-disable no-console */
/* istanbul ignore file */

import formatter from 'eslint/lib/cli-engine/formatters/stylish.js';

function linterReporter( results ) {
	console.log( formatter( results ) );
}

export default linterReporter;
