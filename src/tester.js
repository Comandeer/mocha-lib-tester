import Mocha from 'mocha';
import { sync as globSync } from 'glob';
import MochaReporter from './reporters/MochaReporter.js';
import babelRegister from '@babel/register';
import addChaiHook from './hooks/chai.js';
import preset from '@babel/preset-env';

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

	addChaiHook( projectPath );
	hook( projectPath );

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

function hook( projectPath ) {
	babelRegister( {
		only: [
			( path ) => {
				return path.startsWith( projectPath );
			}
		],
		babelrc: false,
		presets: [
			[
				preset,
				{
					targets: {
						node: '8.0.0'
					}
				}
			]
		]
	} );
}

export default tester;
