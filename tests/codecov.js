/* globals expect */

import codecov from '../src/codecov.js';

const originalEnvVariable = process.env.NO_CODECOV;

describe( 'codecov', () => {
	// We don't want any garbage in codecov reports.
	before( () => {
		process.env.NO_CODECOV = true;
	} );

	after( () => {
		process.env.NO_CODECOV = originalEnvVariable;
	} );

	it( 'is a function', () => {
		expect( codecov ).to.be.a( 'function' );
	} );

	it( 'expects non-empty string as the first parameter', () => {
		const invalid = [
			undefined,
			null,
			1,
			[],
			''
		];

		invalid.forEach( ( value ) => {
			expect( () => {
				codecov( value );
			} ).to.throw( TypeError, 'Provided path must be a non-empty string' );
		} );

		expect( () => {
			codecov( '.' );
		} ).not.to.throw( TypeError, 'Provided path must be a non-empty string' );
	} );

	it( 'can be skipped with env variable', async () => {
		const expected = {
			skipped: true
		};
		const { results } = await codecov( '.' );

		expect( results ).to.deep.equal( expected );
	} );

} );
