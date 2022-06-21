const { expose } = require( 'threads/worker' );
const { codecov } = require( '../index.js' );

expose( ( projectPath ) => {
	return codecov( projectPath );
} );
