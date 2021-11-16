/* eslint-disable no-console */
/* istanbul ignore file */

import { ESLint } from 'eslint';

async function linterReporter( { results }, logger ) {
	const eslint = new ESLint();
	const formatter = await eslint.loadFormatter( 'stylish' );
	const formattedResults = formatter.format( results );

	logger.log( formattedResults );
}

export default linterReporter;
