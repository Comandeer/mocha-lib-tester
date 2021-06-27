import Mocha from 'mocha';
import { sync as globSync } from 'glob';
import MochaReporter from './reporters/MochaReporter.js';
import addChaiHook from './hooks/chai.js';
import addBabelHook from './hooks/babel.js';
import addIstanbulHook from './hooks/istanbul.js';

function tester( projectPath ) {
	if ( typeof projectPath !== 'string' || projectPath.length === 0 ) {
		throw new TypeError( 'Provided path must be a non-empty string' );
	}

	addChaiHook( projectPath );
	addBabelHook( projectPath );
	addIstanbulHook( projectPath );
	clearCache( projectPath );

	const mocha = new Mocha( {
		reporter: MochaReporter,
		timeout: 60000
	} );
	const tests = findTestFiles( projectPath );

	tests.forEach( ( test ) => {
		mocha.addFile( test );
	} );

	return new Promise( ( resolve ) => {
		mocha.run( () => {
			resolve( {
				name: 'tester',
				...mocha.suite.results
			} );
		} );
	} );
}

function findTestFiles( cwd ) {
	return globSync( 'tests/**/*.js', {
		cwd,
		ignore: [
			'tests/fixtures/**/*.js',
			'tests/helpers/**/*.js'
		],
		realpath: true
	} );
}

function clearCache( path ) {
	Object.keys( require.cache ).forEach( ( key ) => {
		if ( key.startsWith( path ) ) {
			delete require.cache[ key ];
		}
	} );
}

export default tester;
