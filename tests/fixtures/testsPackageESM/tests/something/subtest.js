import fn from '../../src/index.js';

describe( 'subtest', () => {
	it( 'passes', () => {
		fn();
	} );

	it( 'fails', () => {
		throw new Error( 'Failure' );
	} );
} );
