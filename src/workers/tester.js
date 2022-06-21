const { expose } = require( 'threads/worker' );
const { tester } = require( '../index.js' );

expose( ( projectPath ) => {
	return tester( projectPath );
} );
