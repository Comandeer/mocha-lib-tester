const { expose } = require( 'threads/worker' );

const isBuild = __dirname.endsWith( '/dist/workers' );
const testerPath = isBuild ? '../mocha-lib-tester.js' : '../index.js';
const { tester } = require( testerPath );

expose( ( projectPath ) => {
	return tester( projectPath );
} );
