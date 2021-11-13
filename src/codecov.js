/* istanbul ignore file */

import { exec } from 'child_process';
import isCI from 'is-ci';
import npmRunPath from 'npm-run-path';

function codecov( projectPath ) {
	if ( typeof projectPath !== 'string' || projectPath.length === 0 ) {
		throw new TypeError( 'Provided path must be a non-empty string' );
	}

	const resultsTemplate = {
		name: 'codecov'
	};

	if ( !isCI || process.env.NO_CODECOV ) {
		return Object.assign( {}, resultsTemplate, {
			ok: true,
			results: {
				skipped: true
			}
		} );
	}

	return executeCLI( projectPath ).then( ( { exitCode, stdout, stderr } ) => {
		return Object.assign( {}, resultsTemplate, {
			ok: exitCode === 0,
			results: {
				stdout,
				stderr
			}
		} );
	} );
}

function executeCLI( projectPath ) {
	return new Promise( ( resolve ) => {
		const codecovProcess = exec( 'codecov', {
			cwd: projectPath,
			env: npmRunPath.env()
		}, ( error, stdout, stderr ) => {
			resolve( {
				exitCode: codecovProcess.exitCode,
				stdout,
				stderr
			} );
		} );
	} );
}

export default codecov;
