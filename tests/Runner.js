/* eslint-disable no-console */
/* globals expect, sinon */

import EventEmitter from 'events';
import chalk from 'chalk';
import assertParameter from './helpers/assertParameter.js';
import Runner from '../src/Runner.js';
import Logger from '../src/Logger.js';
import { version } from '../package.json';

const { spy, stub } = sinon;

describe( 'Runner', () => {
	it( 'is a class', () => {
		expect( Runner ).to.be.a( 'function' );
	} );

	it( 'is an event emitter', () => {
		const runner = new Runner();

		expect( runner ).to.be.an.instanceOf( EventEmitter );
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
				ok: true,
				results: {},
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
							ok: false,
							results: {},
							reporter() {}
						};
					}
				},

				{
					name: 'Step #2',
					run() {
						return {
							ok: true,
							results: {},
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
							ok: true,
							results: {},
							reporter() {}
						};
					}
				},

				{
					name: 'Step #2',
					run() {
						return {
							ok: true,
							results: {},
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
				ok: true,
				results: {},
				reporter() {}
			} );
			const stub2 = stub().returns( {
				ok: false,
				results: {},
				reporter() {}
			} );
			const stub3 = stub().returns( {
				ok: false,
				results: {},
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

	describe( 'events', () => {
		it( 'emits events in correct order', async () => {
			const runner = new Runner();
			const step = {
				name: 'Step #1',
				run() {
					return {
						ok: true,
						results: {},
						reporter() {}
					};
				}
			};

			runner.addStep( step );

			const startListener = spy();
			const stepStartListener = spy();
			const stepEndListener = spy();
			const endListener = spy();

			runner.on( 'start', startListener );
			runner.on( 'step:start', stepStartListener );
			runner.on( 'step:end', stepEndListener );
			runner.on( 'end', endListener );

			await runner.run();

			expect( startListener, 'start' ).to.have.been.calledOnce;
			expect( stepStartListener ).to.have.been.calledImmediatelyAfter( startListener );
			expect( stepStartListener, 'step:start' ).to.have.been.calledOnce;
			expect( stepEndListener ).to.have.been.calledImmediatelyAfter( stepStartListener );
			expect( stepEndListener, 'step:end' ).to.have.been.calledOnce;
			expect( endListener ).to.have.been.calledImmediatelyAfter( stepEndListener );
			expect( endListener, 'end' ).to.have.been.calledOnce;
		} );

		describe( 'step:*', () => {
			it( 'provides info about the step', async () => {
				const runner = new Runner();
				const resultsTemplate = {
					ok: true,
					results: {},
					reporter() {}
				};
				const results1 = { ...resultsTemplate };
				const results2 = { ...resultsTemplate };
				const steps = [
					{
						name: 'Step #1',
						run() {
							return results1;
						}
					},

					{
						name: 'Step #2',
						run() {
							return results2;
						}
					}
				];

				runner.addSteps( steps );

				const startListener = spy();
				const endListener = spy();

				runner.on( 'step:start', startListener );
				runner.on( 'step:end', endListener );

				await runner.run();

				expect( startListener ).to.have.been.calledWithExactly( steps[ 0 ] );
				expect( startListener ).to.have.been.calledWithExactly( steps[ 1 ] );
				expect( endListener ).to.have.been.calledWithExactly( steps[ 0 ], results1 );
				expect( endListener ).to.have.been.calledWithExactly( steps[ 1 ], results2 );
			} );
		} );

		describe( 'end', () => {
			it( 'is not emitted when error occurs during step', async () => {
				const step = {
					name: 'Step',
					run() {
						throw new Error( 'Some error' );
					}
				};
				const runner = new Runner();
				const endListener = spy();

				runner.addStep( step );

				runner.on( 'end', endListener );

				try {
					await runner.run();
				} catch {} // eslint-disable-line no-empty

				expect( endListener ).not.to.have.been.called;
			} );
		} );

		describe( 'error', () => {
			it( 'is emitted when error occurs during step', async () => {
				const error = new Error( 'Some error' );
				const step = {
					name: 'Step',
					run() {
						throw error;
					}
				};
				const runner = new Runner();
				const errorListener = spy();

				runner.addStep( step );

				runner.on( 'error', errorListener );

				try {
					await runner.run();
				} catch {} // eslint-disable-line no-empty

				expect( errorListener ).to.have.been.calledOnce;
				expect( errorListener ).to.have.been.calledWithExactly( error );
			} );

			it( 'is emitted when step returns incorrect results', async () => {
				const step = {
					name: 'Step',
					run() {
						return;
					}
				};
				const runner = new Runner();
				const errorListener = spy();

				runner.addStep( step );

				runner.on( 'error', errorListener );

				try {
					await runner.run();
				} catch {} // eslint-disable-line no-empty

				expect( errorListener ).to.have.been.calledOnce;

				const [ error ] = errorListener.getCall( 0 ).args;

				expect( error ).to.be.an.instanceOf( TypeError );
				expect( error.message ).to.equal( 'Step Step didn\'t return correct results' );
			} );
		} );
	} );

	describe( 'integration with logger', () => {
		beforeEach( () => {
			stub( console, 'log' );
			stub( console, 'error' );
		} );

		afterEach( () => {
			console.log.restore();
			console.error.restore();
		} );

		it( 'smooth run', async () => {
			const runner = new Runner();
			const resultsTemplate = {
				ok: true,
				results: {}
			};
			const steps = [
				{
					name: 'step1',
					run() {
						return {
							reporter() {
								console.log( 'step1' );
							},
							...resultsTemplate
						};
					}
				},

				{
					name: 'step2',
					run() {
						return {
							reporter() {
								console.log( 'step2' );
							},
							...resultsTemplate
						};
					}
				}
			];
			const expected = [
				[ `MLT v${ version }` ],
				[ chalk.yellow( 'Executing tests…' ) ],
				[ chalk.blue( '---step1---' ) ],
				[ 'step1' ],
				[ chalk.green( `Step ${ chalk.bold( 'step1' ) } finished successfully.` ) ],
				[ chalk.blue( '---step2---' ) ],
				[ 'step2' ],
				[ chalk.green( `Step ${ chalk.bold( 'step2' ) } finished successfully.` ) ],
				[ chalk.green( 'All steps finished correctly 🎉' ) ]
			];

			new Logger( runner );
			runner.addSteps( steps );
			await runner.run();

			expect( console.log ).to.have.callCount( expected.length );
			expect( console.log.args ).to.deep.equal( expected );
		} );

		it( 'incorrect results run', async () => {
			const runner = new Runner();
			const resultsTemplate = {
				ok: false,
				results: {}
			};
			const steps = [
				{
					name: 'step1',
					run() {
						return {
							reporter() {
								console.log( 'step1' );
							},
							...resultsTemplate
						};
					}
				},

				{
					name: 'step2',
					run() {
						return {
							reporter() {
								console.log( 'step2' );
							},
							...resultsTemplate
						};
					}
				}
			];
			const logExpected = [
				[ `MLT v${ version }` ],
				[ chalk.yellow( 'Executing tests…' ) ],
				[ chalk.blue( '---step1---' ) ],
				[ 'step1' ],
				[ chalk.red( 'There were some errors alonside the way 😿' ) ]
			];
			const errorExpected = [
				[ chalk.red( `Step ${ chalk.bold( 'step1' ) } failed with errors. Skipping subsequent steps.` ) ]
			];

			new Logger( runner );
			runner.addSteps( steps );
			await runner.run();

			expect( console.log ).to.have.callCount( logExpected.length );
			expect( console.log.args ).to.deep.equal( logExpected );
			expect( console.error ).to.have.callCount( errorExpected.length );
			expect( console.error.args ).to.deep.equal( errorExpected );
		} );

		it( 'errored run', async () => {
			const runner = new Runner();
			const resultsTemplate = {
				ok: true,
				results: {}
			};
			const error = new Error();
			const steps = [
				{
					name: 'step1',
					run() {
						throw error;
					}
				},

				{
					name: 'step2',
					run() {
						return {
							reporter() {
								console.log( 'step2' );
							},
							...resultsTemplate
						};
					}
				}
			];
			const logExpected = [
				[ `MLT v${ version }` ],
				[ chalk.yellow( 'Executing tests…' ) ],
				[ chalk.blue( '---step1---' ) ],
				[ chalk.red( 'There were some errors alonside the way 😿' ) ]
			];
			const errorExpected = [
				[ chalk.red( '🚨 Error occured:' ) ],
				[ error ]
			];

			new Logger( runner );
			runner.addSteps( steps );

			try {
				await runner.run();
			} catch {
				// Well, errored run is errored run after all, isn't it?
			}

			expect( console.log ).to.have.callCount( logExpected.length );
			expect( console.log.args ).to.deep.equal( logExpected );
			expect( console.error ).to.have.been.callCount( errorExpected.length );
			expect( console.error.args ).to.deep.equal( errorExpected );
		} );
	} );
} );
