/* globals expect */

import assertParameter from './helpers/assertParameter.js';
import codecov from '../src/codecov.js';

const originalEnvVariable = process.env.NO_CODECOV;

describe( 'codecov', () => {
	// We don't want any garbage in codecov reports.
	before( () => {
		process.env.NO_CODECOV = true;
	} );

	after( () => {
		if ( typeof originalEnvVariable === 'undefined' ) {
			delete process.env.NO_CODECOV;

			return;
		}

		process.env.NO_CODECOV = originalEnvVariable;
	} );

	it( 'is a function', () => {
		expect( codecov ).to.be.a( 'function' );
	} );

	it( 'expects non-empty string as the first parameter', () => {
		assertParameter( {
			invalids: [
				undefined,
				null,
				1,
				[],
				''
			],
			valids: [
				'.'
			],
			error: {
				type: TypeError,
				message: 'Provided path must be a non-empty string'
			},
			code( param ) {
				codecov( param );
			}
		} );
	} );

	it( 'can be skipped with env variable', async () => {
		const expected = {
			skipped: true
		};
		const { results } = await codecov( '.' );

		expect( results ).to.deep.equal( expected );
	} );

} );
