const { expose } = require( 'threads/worker' );

const isDistDirRegex = /[/\\]dist[/\\]workers$/;
const isBuild = isDistDirRegex.test( __dirname );
const testerPath = isBuild ? '../mocha-lib-tester.js' : '../index.js';
const { tester } = require( testerPath );

expose( ( projectPath ) => {
	return tester( projectPath );
} );
