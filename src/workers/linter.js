const { expose } = require( 'threads/worker' );

const isDistDirRegex = /[/\\]dist[/\\]workers$/;
const isBuild = isDistDirRegex.test( __dirname );
const linterPath = isBuild ? '../mocha-lib-tester.js' : '../index.js';
const { linter } = require( linterPath );

expose( ( projectPath ) => {
	return linter( projectPath );
} );
