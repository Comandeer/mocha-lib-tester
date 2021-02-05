import { ESLint } from 'eslint';
import { sync as globSync } from 'glob';
import linterReporter from './reporters/linter';

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

	const results = await eslint.lintFiles( prepareExistentFilePaths( projectPath ) );

	return {
		name: 'linter',
		ok: isOk( results ),
		results,
		reporter: linterReporter
	};
}

// Workaround for https://eslint.org/docs/5.0.0/user-guide/migrating-to-5.0.0#nonexistent-files
function prepareExistentFilePaths( cwd ) {
	const candidates = [
		'src/**/*.js',
		'bin/**/*',
		'tests/**/*.js'
	];

	return candidates.filter( ( candidate ) => {
		const found = globSync( candidate, {
			cwd
		} );

		return found.length > 0;
	} );
}

function isOk( results ) {
	return results.every( ( { errorCount } ) => {
		return errorCount === 0;
	} );
}

export default linter;
