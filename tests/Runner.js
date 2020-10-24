/* globals expect, sinon */

import assertParameter from './helpers/assertParameter.js';
import Runner from '../src/Runner.js';

const { spy } = sinon;

describe( 'Runner', () => {
	it( 'is a class', () => {
		expect( Runner ).to.be.a( 'function' );
	} );

	describe( '#steps', () => {
		it( 'is a set', () => {
			const runner = new Runner();

			expect( runner.steps ).to.be.an.instanceOf( Set );
		} );

		it( 'is frozen', () => {
			const runner = new Runner();

			expect( runner.steps ).to.be.frozen;
		} );

		it( 'is read-only', () => {
			const runner = new Runner();

			expect( () => {
				runner.steps = 'whatever';
			} ).to.throw();
		} );
	} );

	describe( '#addStep', () => {
		it( 'requires correct step as first parametr', () => {
			const runner = new Runner();

			assertParameter( {
				invalids: [
					'',
					null,
					undefined,
					[],
					{
						name: '',
						run() {}
					},
					{
						name: '  		     	',
						run() {}
					},
					{
						name: 'Step',
						run: 1
					}
				],
				valids: [ {
					name: 'Step',
					run() {}
				} ],
				error: {
					type: TypeError,
					message: 'Provided object must be a valid step definition'
				},
				code( param ) {
					runner.addStep( param );
				}
			} );
		} );

		it( 'adds step to the runner', () => {
			const runner = new Runner();
			const step = {
				name: 'Step',
				run() {}
			};

			runner.addStep( step );

			expect( [ ...runner.steps ] ).to.deep.equal( [ step ] );
		} );

		it( 'does not duplicate steps', () => {
			const runner = new Runner();
			const step = {
				name: 'Step',
				run() {}
			};

			runner.addStep( step );
			runner.addStep( step );

			expect( [ ...runner.steps ] ).to.deep.equal( [ step ] );
		} );
	} );

	describe( '#addSteps()', () => {
		it( 'requires array of correct steps as first parameter', () => {
			const runner = new Runner();

			assertParameter( {
				invalids: [
					'',
					null,
					undefined,
					[ 1 ],
					{
						name: 'Step',
						run() {}
					},

					[
						{
							name: '  		     	',
							run() {}
						},
						{
							name: 'Step',
							run: 1
						}
					],

					[
						{
							name: 'Test',
							run() {}
						},

						{
							name: '  		     	',
							run() {}
						}
					]
				],
				valids: [
					[],
					[
						{
							name: 'Step',
							run() {}
						},

						{
							name: 'Another Step',
							run() {}
						}
					]
				],
				error: {
					type: TypeError,
					message: 'Provided array must contain only valid step definitions'
				},
				code( param ) {
					runner.addSteps( param );
				}
			} );
		} );

		it( 'add steps to runner', () => {
			const runner = new Runner();
			const steps = [
				{
					name: 'Step',
					run() {}
				},

				{
					name: 'Another Step',
					run() {}
				}
			];

			runner.addSteps( steps );

			expect( [ ...runner.steps ] ).to.deep.equal( steps );
		} );

		it( 'does not duplicate steps', () => {
			const runner = new Runner();
			const step = {
				name: 'Step',
				run() {}
			};

			runner.addSteps( [ step, step ] );

			expect( [ ...runner.steps ] ).to.deep.equal( [ step ] );
		} );
	} );

	describe( '#run()', () => {
		it( 'returns Promise resolving to boolean', () => {
			const runner = new Runner();
			const result = runner.run();

			expect( result ).to.be.an.instanceOf( Promise );

			return result.then( ( resolved ) => {
				expect( resolved ).to.a( 'boolean' );
			} );
		} );

		it( 'runs all steps in preserved order', async () => {
			const runner = new Runner();
			const spy1 = spy();
			const spy2 = spy();
			const spy3 = spy();
			const steps = [
				{
					name: 'Step #1',
					run: spy1
				},

				{
					name: 'Step #2',
					run: spy2
				},

				{
					name: 'Step #3',
					run: spy3
				}
			];

			runner.addSteps( steps );

			await runner.run();

			expect( spy1 ).to.have.been.calledOnce;
			expect( spy2 ).to.have.been.calledOnce;

			expect( spy1 ).to.have.been.calledImmediatelyBefore( spy2 );
			expect( spy2 ).to.have.been.calledImmediatelyBefore( spy3 );
		} );
	} );
} );
