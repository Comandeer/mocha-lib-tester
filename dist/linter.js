const { linter } = require( '@comandeer/mocha-lib-tester' );
const { expose } = require( 'threads/worker' );

expose( ( projectPath ) => {
	return linter( projectPath );
} );
