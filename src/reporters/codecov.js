/* eslint-disable no-console */
/* istanbul ignore file */

import LoggerColor from  '../LoggerColor.js';
import LoggerType from '../LoggerType.js';

function codecovReporter( { results }, logger ) {
	if ( results.skipped ) {
		logger.log( 'CodeCov upload skipped', {
			color: LoggerColor.YELLOW
		} );

		return;
	}

	logger.log( results.stdout );

	if ( results.stderr ) {
		logger.log( results.stderr, {
			type: LoggerType.ERROR,
			color: LoggerColor.RED
		} );
	}
}

export default codecovReporter;
