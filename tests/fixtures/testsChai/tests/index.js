import { strict as assert } from 'assert';
import helperExpect from './helpers/subdir/helper.js';
import fixtureExpect from './fixtures/subdir/fixture.js';
import srcExpect from '../src/index.js';

describe( 'chai', () => {
	it( 'exposes expect', () => {
		assert.equal( typeof expect, 'function' );
	} );

	it( 'exposes chai in helpers', () => {
		assert.equal( helperExpect, true );
	} );

	it( 'does not expose chai in fixtures', () => {
		assert.equal( fixtureExpect, false );
	} );

	it( 'does not expose chai in source files', () => {
		assert.equal( srcExpect, false );
	} );
} );
