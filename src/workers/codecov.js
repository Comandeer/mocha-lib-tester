const { expose } = require( 'threads/worker' );

const isBuild = __dirname.endsWith( '/dist/workers' );
const codecovPath = isBuild ? '../mocha-lib-tester.js' : '../index.js';
const { codecov } = require( codecovPath );

expose( ( projectPath ) => {
	return codecov( projectPath );
} );
