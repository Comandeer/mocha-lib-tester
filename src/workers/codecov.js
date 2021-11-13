const { expose } = require( 'threads/worker' );

const isDistDirRegex = /[/\\]dist[/\\]workers$/;
const isBuild = isDistDirRegex.test( __dirname );
const codecovPath = isBuild ? '../mocha-lib-tester.js' : '../index.js';
const { codecov } = require( codecovPath );

expose( ( projectPath ) => {
	return codecov( projectPath );
} );
