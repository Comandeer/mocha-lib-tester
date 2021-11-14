import { ESLint } from 'eslint';
import globPromise from './globPromise.js';

async function linter( projectPath ) {
	if ( typeof projectPath !== 'string' || projectPath.length === 0 ) {
		throw new TypeError( 'Provided path must be a non-empty string' );
	}

	const eslint = new ESLint( {
		useEslintrc: false,
		cwd: projectPath,
		baseConfig: {
			extends: '@comandeer/eslint-config'
		},
		overrideConfig: {
			ignorePatterns: [ 'tests/fixtures/**/*.js' ]
		}
	} );

	const filesToLint = await prepareExistentFilePaths( projectPath );
	const results = await eslint.lintFiles( filesToLint );

	return {
		name: 'linter',
		ok: isOk( results ),
		results
	};
}

// Workaround for https://eslint.org/docs/5.0.0/user-guide/migrating-to-5.0.0#nonexistent-files
async function prepareExistentFilePaths( cwd ) {
	const candidates = [
		'src/**/*.js',
		'bin/**/*',
		'tests/**/*.js'
	];
	const candidatesPromises = candidates.map( ( candidate ) => {
		return globPromise( candidate, {
			cwd
		} );
	} );
	const globResults = await Promise.all( candidatesPromises );

	return globResults.reduce( ( filteredCandidates, found, i ) => {
		if ( found.length === 0 ) {
			return filteredCandidates;
		}

		return [ ...filteredCandidates, candidates[ i ] ];
	}, [] );
}

function isOk( results ) {
	return results.every( ( { errorCount } ) => {
		return errorCount === 0;
	} );
}

export default linter;
