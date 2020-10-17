/* globals expect, sinon */
import reporter from '../src/reporter.js';

const { spy } = sinon;

describe( 'reporter', () => {
	it( 'is a function', () => {
		expect( reporter ).to.be.a( 'function' );
	} );

	it( 'requires array of reporters', () => {
		expect( () => {
			reporter( [
				{
					results: {},
					reporter() {}
				},

				{
					results: {}
				}
			] );
		} ).to.throw( TypeError, 'Passed results must be of correct type' );

		expect( () => {
			reporter( [
				{
					results: {},
					reporter() {}
				},

				{
					results: {},
					reporter() {}
				}
			] );
		} ).not.to.throw( TypeError, 'Passed results must be of correct type' );
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
