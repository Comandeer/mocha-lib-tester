import Mocha from 'mocha';
import { sync as globSync } from 'glob';
import MochaReporter from './reporters/MochaReporter.js';
import addChaiHook from './hooks/chai.js';
import addBabelHook from './hooks/babel.js';

function tester( projectPath ) {
	if ( typeof projectPath !== 'string' || projectPath.length === 0 ) {
		throw new TypeError( 'Provided path must be a non-empty string' );
	}

	addChaiHook( projectPath );
	addBabelHook( projectPath );

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

export default tester;
