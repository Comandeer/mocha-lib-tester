import { strict as assert } from 'assert';

describe( 'chai (subtest)', () => {
	it( 'exposes expect', () => {
		assert.equal( typeof expect, 'function' );
	} );
} );
