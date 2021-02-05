/* eslint-disable no-console */
/* istanbul ignore file */

function linterReporter( eslint ) {
	return async function( results ) {
		const formatter = await eslint.loadFormatter();

		console.log( formatter.format( results ) );
	};
}

export default linterReporter;
