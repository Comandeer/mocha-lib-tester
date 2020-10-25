/* globals expect, sinon */

import assertParameter from './helpers/assertParameter.js';
import Runner from '../src/Runner.js';

const { stub } = sinon;

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
			const resultsTemplate = {
				results: {
					ok: true
				},
				reporter() {}
			};
			const stub1 = stub().returns( { ...resultsTemplate } );
			const stub2 = stub().returns( { ...resultsTemplate } );
			const stub3 = stub().returns( { ...resultsTemplate } );
			const steps = [
				{
					name: 'Step #1',
					run: stub1
				},

				{
					name: 'Step #2',
					run: stub2
				},

				{
					name: 'Step #3',
					run: stub3
				}
			];

			runner.addSteps( steps );

			await runner.run();

			expect( stub1 ).to.have.been.calledOnce;
			expect( stub2 ).to.have.been.calledOnce;

			expect( stub1 ).to.have.been.calledImmediatelyBefore( stub2 );
			expect( stub2 ).to.have.been.calledImmediatelyBefore( stub3 );
		} );

		it( 'throws when steps return invalid results', () => {
			const runner = new Runner();
			const step = {
				name: 'Step',
				run() {}
			};

			runner.addStep( step );

			const result = runner.run();

			return expect( result ).to.eventually.be.rejectedWith( TypeError,
				`Step ${ step.name } didn't return correct results` );
		} );

		it( 'throws on error during the step', () => {
			const runner = new Runner();
			const step = {
				name: 'Step',
				run() {
					throw new Error( 'Thrown' );
				}
			};

			runner.addStep( step );

			const result = runner.run();

			return expect( result ).to.eventually.be.rejectedWith( Error, 'Thrown' );
		} );

		it( 'throws on rejection from the step', () => {
			const runner = new Runner();
			const step = {
				name: 'Step',
				run() {
					return Promise.reject( new Error( 'Reject' ) );
				}
			};

			runner.addStep( step );

			const result = runner.run();

			return expect( result ).to.eventually.be.rejectedWith( Error, 'Reject' );
		} );

		it( 'returns true only if all steps return ok results', async () => {
			const falseRunner = new Runner();
			const trueRunner = new Runner();
			const falseSteps = [
				{
					name: 'Step #1',
					run() {
						return {
							results: {
								ok: false
							},
							reporter() {}
						};
					}
				},

				{
					name: 'Step #2',
					run() {
						return {
							results: {
								ok: true
							},
							reporter() {}
						};
					}
				}
			];
			const trueSteps = [
				{
					name: 'Step #1',
					run() {
						return {
							results: {
								ok: true
							},
							reporter() {}
						};
					}
				},

				{
					name: 'Step #2',
					run() {
						return {
							results: {
								ok: true
							},
							reporter() {}
						};
					}
				}
			];

			falseRunner.addSteps( falseSteps );
			trueRunner.addSteps( trueSteps );

			const falseResult = await falseRunner.run();
			const trueResult = await trueRunner.run();

			expect( falseResult ).to.equal( false );
			expect( trueResult ).to.equal( true );
		} );

		it( 'returns false on first step with ok === false', async () => {
			const runner = new Runner();
			const stub1 = stub().returns( {
				results: {
					ok: true
				},
				reporter() {}
			} );
			const stub2 = stub().returns( {
				results: {
					ok: false
				},
				reporter() {}
			} );
			const stub3 = stub().returns( {
				results: {
					ok: false
				},
				reporter() {}
			} );
			const steps = [
				{
					name: 'Step #1',
					run: stub1
				},

				{
					name: 'Step #2',
					run: stub2
				},

				{
					name: 'Step #3',
					run: stub3
				}
			];

			runner.addSteps( steps );

			const result = await runner.run();

			expect( result ).to.equal( false );

			expect( stub1 ).to.have.been.calledOnce;
			expect( stub2 ).to.have.been.calledOnce;
			expect( stub3 ).not.to.have.been.called;
		} );
	} );
} );
