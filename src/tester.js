import { promisify } from 'util';
import Mocha from 'mocha';
import glob from 'glob';
import MochaReporter from './reporters/MochaReporter.js';
import addChaiHook from './hooks/chai.js';
import addBabelHook from './hooks/babel.js';
import addIstanbulHook from './hooks/istanbul.js';

const globPromise = promisify( glob );

async function tester( projectPath ) {
	if ( typeof projectPath !== 'string' || projectPath.length === 0 ) {
		throw new TypeError( 'Provided path must be a non-empty string' );
	}

	addChaiHook( projectPath );
	addBabelHook( projectPath );
	addIstanbulHook( projectPath );
	clearCache( projectPath );

	const mocha = new Mocha( {
		reporter: MochaReporter,
		timeout: 30000
	} );
	const tests = await findTestFiles( projectPath );

	tests.forEach( ( test ) => {
		mocha.addFile( test );
	} );

	return new Promise( ( resolve ) => {
		mocha.run( () => {
			resolve( {
				name: 'tester',
				...mocha.suite.results,
				coverage: global.__mltCoverage__
			} );
		} );
	} );
}

function findTestFiles( cwd ) {
	return globPromise( 'tests/**/*.js', {
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
