/* istanbul ignore file */
/* eslint-disable no-console */
import chalk from 'chalk';
import linter from './linter.js';
import tester from './tester.js';
import codeCoverage from './codeCoverage.js';
import codecov from './codecov.js';
import reporter from './reporter.js';

async function mlt() {
	const projectPath = process.cwd();

	console.log( 'MLT' );
	console.log( chalk.yellow( 'Executing tests…' ) );

	const results = [];
	let exitCode = 0;

	try {
		console.log( chalk.blue.bold( '---Linter---' ) );
		const linterResults = await linter( projectPath );

		processResults( linterResults );

		console.log( chalk.blue.bold( '---Tester---' ) );
		const testResults = await tester( projectPath );

		processResults( testResults );

		console.log( chalk.blue.bold( '---Code Coverage---' ) );
		const codeCoverageResults = await codeCoverage( projectPath, global.__mltCoverage__ );

		processResults( codeCoverageResults );

		console.log( chalk.blue.bold( '---CodeCov---' ) );
		const codecovResults = await codecov( projectPath );

		processResults( codecovResults );
	} catch ( { message } ) {
		exitCode = 1;
		console.error( chalk.red( `Error occured: ${ message }. Skipping subsequent steps` ) );
	} finally {
		reporter( results );
	}

	return exitCode;

	function processResults( stepResults ) {
		results.push( stepResults );

		if ( !stepResults.ok ) {
			throw new Error( `Errors detected during ${ stepResults.name } step` );
		}

		console.log( chalk.green( `${ stepResults.name } step finished correctly.` ) );
	}
}

export default mlt;
