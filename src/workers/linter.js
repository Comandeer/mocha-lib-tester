const { expose } = require( 'threads/worker' );
const { linter } = require( '../index.js' );

expose( ( projectPath ) => {
	return linter( projectPath );
} );
