import { expect } from 'chai';
import mlt from '../src/index.js';

describe( 'index', () => {
	it( 'exports a function', () => {
		expect( mlt ).to.be.a( 'function' );
	} );
} );
