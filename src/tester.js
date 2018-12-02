import Mocha from 'mocha';
import { sync as globSync } from 'glob';
import MochaReporter from './reporters/MochaReporter.js';

function findTestFiles( cwd ) {
	return globSync( 'tests/**/*.js', {
		cwd,
		ignore: 'tests/fixtures/**/*.js',
		realpath: true
	} );
}

function tester( projectPath ) {
	if ( typeof projectPath !== 'string' || projectPath.length === 0 ) {
		throw new TypeError( 'Provided path must be a non-empty string' );
	}

	const mocha = new Mocha( {
		reporter: MochaReporter
	} );
	const tests = findTestFiles( projectPath );

	tests.forEach( ( test ) => {
		mocha.addFile( test );
	} );

	return new Promise( ( resolve ) => {
		mocha.run( () => {
			resolve( mocha.suite.results );
		} );
	} );
}

export default tester;
