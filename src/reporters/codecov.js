/* eslint-disable no-console */
/* istanbul ignore file */

import chalk from 'chalk';

function codecovReporter( results ) {
	if ( results.skipped ) {
		console.log( chalk.yellow( 'CodeCov upload skipped' ) );
		return;
	}

	console.log( results.stdout );
}

export default codecovReporter;
