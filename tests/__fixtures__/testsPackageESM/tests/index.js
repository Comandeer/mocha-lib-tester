import fn from '../src/index.js';

describe( 'index', () => {
	it( 'passes', () => {
		fn();
	} );

	it( 'fails', () => {
		throw new Error( 'Failure' );
	} );
} );
