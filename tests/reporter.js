/* globals expect, sinon */

import assertParameter from './helpers/assertParameter.js';
import reporter from '../src/reporter.js';

const { spy } = sinon;

describe( 'reporter', () => {
	it( 'is a function', () => {
		expect( reporter ).to.be.a( 'function' );
	} );

	it( 'requires array of reporters', () => {
		assertParameter( {
			invalids: [
				[
					{
						results: {},
						reporter() {}
					},

					{
						results: {}
					}
				]
			],
			valids: [
				[
					{
						results: {},
						reporter() {}
					},

					{
						results: {},
						reporter() {}
					}
				]
			],
			error: {
				type: TypeError,
				message: 'Passed results must be of correct type'
			},
			code( param ) {
				reporter( param );
			}
		} );
	} );

	it( 'correctly renders the report', () => {
		const step1Results = {};
		const step1Reporter = spy();
		const step2Results = {};
		const step2Reporter = spy();

		const steps = [
			{
				results: step1Results,
				reporter: step1Reporter
			},

			{
				results: step2Results,
				reporter: step2Reporter
			}
		];

		reporter( steps );

		expect( step1Reporter ).to.have.been.calledOnceWithExactly( step1Results );
		expect( step2Reporter ).to.have.been.calledOnceWithExactly( step2Results );
		expect( step2Reporter ).to.have.been.calledImmediatelyAfter( step1Reporter );
	} );
} );
