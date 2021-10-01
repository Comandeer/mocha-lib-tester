const { expose } = require( 'threads/worker' );

const isBuild = __dirname.endsWith( '/dist/workers' );
const linterPath = isBuild ? '../mocha-lib-tester.js' : '../index.js';
const { linter } = require( linterPath );

expose( ( projectPath ) => {
	return linter( projectPath );
} );
