import LoggerType from '../src/LoggerType.js';

describe( 'LoggerType', () => {
	it( 'has two properties', () => {
		expect( LoggerType ).to.include.all.keys( 'LOG', 'ERROR' );
	} );

	describe( '.LOG', () => {
		it( 'has correct value', () => {
			expect( LoggerType.LOG ).to.equal( LoggerType.enumValueOf( 'LOG' ) );
		} );
	} );

	describe( '.ERROR', () => {
		it( 'has correct value', () => {
			expect( LoggerType.ERROR ).to.equal( LoggerType.enumValueOf( 'ERROR' ) );
		} );
	} );
} );
