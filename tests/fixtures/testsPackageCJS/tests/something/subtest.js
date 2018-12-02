const fn  = require( '../../src/index' );

describe( 'subtest', () => {
	it( 'passes', () => {} );

	it( 'fails', () => {
		throw new Error( 'Failure' );
	} );
} );
