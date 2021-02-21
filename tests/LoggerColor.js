import LoggerColor from '../src/LoggerColor.js';

describe( 'LoggerColor', () => {
	it( 'has all properties', () => {
		expect( LoggerColor ).to.include.all.keys( 'AUTO', 'BLUE', 'YELLOW', 'GREEN', 'RED'  );
	} );

	describe( '.AUTO', () => {
		it( 'has correct value', () => {
			expect( LoggerColor.AUTO ).to.equal( LoggerColor.enumValueOf( 'AUTO' ) );
		} );
	} );

	describe( '.BLUE', () => {
		it( 'has correct value', () => {
			expect( LoggerColor.BLUE ).to.equal( LoggerColor.enumValueOf( 'BLUE' ) );
		} );
	} );

	describe( '.YELLOW', () => {
		it( 'has correct value', () => {
			expect( LoggerColor.YELLOW ).to.equal( LoggerColor.enumValueOf( 'YELLOW' ) );
		} );
	} );

	describe( '.GREEN', () => {
		it( 'has correct value', () => {
			expect( LoggerColor.GREEN ).to.equal( LoggerColor.enumValueOf( 'GREEN' ) );
		} );
	} );

	describe( '.RED', () => {
		it( 'has correct value', () => {
			expect( LoggerColor.RED ).to.equal( LoggerColor.enumValueOf( 'RED' ) );
		} );
	} );
} );
