/* istanbul ignore file */

import { resolve as resolvePath } from 'path';
import { exec } from 'child_process';
import isCI from 'is-ci';
import codecovReporter from './reporters/codecov.js';

function codecov( projectPath ) {
	if ( typeof projectPath !== 'string' || projectPath.length === 0 ) {
		throw new TypeError( 'Provided path must be a non-empty string' );
	}

	const resultsTemplate = {
		name: 'codecov',
		reporter: codecovReporter
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
	const codecovPath = resolvePath( __dirname, '..', 'node_modules', 'codecov', 'bin', 'codecov' );

	return new Promise( ( resolve ) => {
		const codecovProcess = exec( `node ${ codecovPath }`, {
			cwd: projectPath
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
