/* eslint-disable no-console */
/* istanbul ignore file */

import LoggerColor from  '../LoggerColor.js';

function codecovReporter( results, logger ) {
	if ( results.skipped ) {
		logger.log( 'CodeCov upload skipped', {
			color: LoggerColor.YELLOW
		} );

		return;
	}

	logger.log( results.stdout );
}

export default codecovReporter;
