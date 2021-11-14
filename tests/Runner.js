/* eslint-disable no-console */

import chalk from 'chalk';
import assertParameter from './helpers/assertParameter.js';
import assertAsyncParameter from './helpers/assertAsyncParameter.js';
import Runner from '../src/Runner.js';
import Logger from '../src/Logger.js';
import EventEmitter from '../src/EventEmitter.js';

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
					},

					{
						id: 1,
						name: 'Step',
						run() {}
					},

					{
						id: '',
						name: 'Step',
						run() {}
					},

					{
						id: '        ',
						name: 'Step',
						run() {}
					},

					{
						id: 'some id',
						name: 'Step',
						run() {}
					},

					{
						id: 'Some=id',
						name: 'Step',
						run() {}
					},

					{
						id: 'Some=id',
						name: 'Step',
						watchable: false,
						run() {}
					},

					{
						id: 'step',
						name: 'Step',
						run() {}
					}
				],
				valids: [
					{
						id: 'step',
						name: 'Step',
						run() {},
						report() {}
					},

					{
						id: 'some-id',
						name: 'Step',
						run() {},
						report() {}
					},

					{
						id: 'another-step',
						name: 'Step',
						watchable: false,
						run() {},
						report() {}
					}
				],
				error: {
					type: TypeError,
					message: 'Provided object must be a valid step definition'
				},
				code( param ) {
					runner.addStep( param );
				}
			} );
		} );

		it( 'requires valid `requires` property on the step', () => {
			const runner = new Runner();

			runner.addStep( {
				id: 'step1',
				name: 'Step',
				run() {},
				report() {}
			} );

			assertParameter( {
				invalids: [
					{
						id: 'step2',
						name: 'Step',
						requires: '',
						run() {},
						report() {}
					},

					{
						id: 'step2',
						name: 'Step',
						requires: 1,
						run() {},
						report() {}
					},

					{
						id: 'step2',
						name: 'Step',
						requires: true,
						run() {},
						report() {}
					},

					{
						id: 'step2',
						name: 'Step',
						requires: {},
						run() {},
						report() {}
					},

					{
						id: 'step2',
						name: 'Step',
						requires: [
							'inexistentstep'
						],
						run() {},
						report() {}
					}
				],
				valids: [
					{
						id: 'step2',
						name: 'Step',
						requires: [
							'step1'
						],
						run() {},
						report() {}
					},

					{
						id: 'step3',
						name: 'Step',
						requires: [
							'step1',
							'step2'
						],
						run() {},
						report() {}
					},

					{
						id: 'step4',
						name: 'Step',
						requires: [],
						run() {},
						report() {}
					}
				],
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
				id: 'step',
				name: 'Step',
				run() {},
				report() {}
			};

			runner.addStep( step );

			expect( [ ...runner.steps ] ).to.deep.equal( [ step ] );
		} );

		it( 'does not duplicate steps', () => {
			const runner = new Runner();
			const step = {
				id: 'step',
				name: 'Step',
				run() {},
				report() {}
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
						id: 'step',
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
							id: 'step',
							name: 'Test',
							run() {}
						},

						{
							id: 'step1',
							name: '  		     	',
							run() {}
						}
					],

					[
						{
							id: 'step1',
							name: 'Step',
							run() {}
						},

						{
							id: 'step2',
							name: 'Another Step',
							run() {}
						}
					]
				],
				valids: [
					[],
					[
						{
							id: 'step1',
							name: 'Step',
							run() {},
							report() {}
						},

						{
							id: 'step2',
							name: 'Another Step',
							run() {},
							report() {}
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
					id: 'step1',
					name: 'Step',
					run() {},
					report() {}
				},

				{
					id: 'step2',
					name: 'Another Step',
					run() {},
					report() {}
				}
			];

			runner.addSteps( steps );

			expect( [ ...runner.steps ] ).to.deep.equal( steps );
		} );

		it( 'does not duplicate steps', () => {
			const runner = new Runner();
			const step = {
				id: 'step',
				name: 'Step',
				run() {},
				report() {}
			};

			runner.addSteps( [ step, step ] );

			expect( [ ...runner.steps ] ).to.deep.equal( [ step ] );
		} );
	} );

	describe( '#run()', () => {
		// #57
		it( 'requires non-empty string as the first parameter if it is present', () => {
			return assertAsyncParameter( {
				invalids: [
					'',
					null,
					[],
					{},
					() => {},
					1,
					'                 '
				],
				valids: [
					undefined,
					'.',
					'somePath'
				],
				error: {
					type: TypeError,
					message: 'Provided path must be a non-empty string'
				},
				code( param ) {
					const runner = new Runner();

					return runner.run( param );
				}
			} );
		} );

		it( 'returns Promise resolving to boolean', async () => {
			const runner = new Runner();
			const runnerPromise = runner.run();

			expect( runnerPromise ).to.be.an.instanceOf( Promise );

			const promiseResult = await runnerPromise;

			expect( promiseResult ).to.a( 'boolean' );
		} );

		// #57
		it( 'passes path to steps run method', async () => {
			const expectedPath = 'hublabubla';
			const runner = new Runner();
			const resultsTemplate = {
				ok: true,
				results: {}
			};
			const stub1 = stub().returns( { ...resultsTemplate } );
			const stub2 = stub().returns( { ...resultsTemplate } );
			const steps = [
				{
					id: 'step1',
					name: 'Step #1',
					run: stub1,
					report() {}
				},

				{
					id: 'step2',
					name: 'Step #2',
					run: stub2,
					report() {}
				}
			];

			runner.addSteps( steps );

			await runner.run( expectedPath );

			expect( stub1 ).to.have.been.calledOnceWith( expectedPath );
			expect( stub2 ).to.have.been.calledOnceWith( expectedPath );
		} );

		// #57
		it( 'uses process.cwd as path if it is not supplied', async () => {
			const runner = new Runner();
			const resultsTemplate = {
				ok: true,
				results: {}
			};
			const stub1 = stub().returns( { ...resultsTemplate } );
			const steps = [
				{
					id: 'step1',
					name: 'Step #1',
					run: stub1,
					report() {}
				}
			];

			runner.addSteps( steps );

			await runner.run();

			expect( stub1 ).to.have.been.calledOnceWith( process.cwd() );
		} );

		it( 'runs all steps in preserved order', async () => {
			const runner = new Runner();
			const resultsTemplate = {
				ok: true,
				results: {}
			};
			const stub1 = stub().returns( { ...resultsTemplate } );
			const stub2 = stub().returns( { ...resultsTemplate } );
			const stub3 = stub().returns( { ...resultsTemplate } );
			const steps = [
				{
					id: 'step1',
					name: 'Step #1',
					run: stub1,
					report() {}
				},

				{
					id: 'step2',
					name: 'Step #2',
					run: stub2,
					report() {}
				},

				{
					id: 'step3',
					name: 'Step #3',
					run: stub3,
					report() {}
				}
			];

			runner.addSteps( steps );

			await runner.run();

			expect( stub1 ).to.have.been.calledOnce;
			expect( stub2 ).to.have.been.calledOnce;

			expect( stub1 ).to.have.been.calledImmediatelyBefore( stub2 );
			expect( stub2 ).to.have.been.calledImmediatelyBefore( stub3 );
		} );

		it( 'passes results of required steps to ran step', async () => {
			const runner = new Runner();
			const resultsTemplate = {
				ok: true,
				results: {}
			};
			const stub1Results = { ...resultsTemplate };
			const stub2Results = { ...resultsTemplate };
			const stub1 = stub().returns( stub1Results );
			const stub2 = stub().returns( stub2Results );
			const stub3 = stub().returns( { ...resultsTemplate } );
			const steps = [
				{
					id: 'step1',
					name: 'Step #1',
					run: stub1,
					report() {}
				},

				{
					id: 'step2',
					name: 'Step #2',
					run: stub2,
					report() {}
				},

				{
					id: 'step3',
					name: 'Step #3',
					requires: [
						'step1',
						'step2'
					],
					run: stub3,
					report() {}
				}
			];

			runner.addSteps( steps );

			await runner.run();

			const requiredStepsResults = {
				step1: stub1Results,
				step2: stub2Results
			};
			const passedResults = stub3.getCall( 0 ).args[ 1 ];

			expect( passedResults ).to.deep.equal( requiredStepsResults );
		} );

		it( 'throws when steps return invalid results', async () => {
			const runner = new Runner();
			const step = {
				id: 'step',
				name: 'Step',
				run() {},
				report() {}
			};

			runner.addStep( step );

			const result = runner.run();

			return expect( result ).to.eventually.be.rejectedWith( TypeError,
				`Step ${ step.name } didn't return correct results` );
		} );

		it( 'throws on error during the step', async () => {
			const runner = new Runner();
			const step = {
				id: 'step',
				name: 'Step',
				run() {
					throw new Error( 'Thrown' );
				},
				report() {}
			};

			runner.addStep( step );

			const result = runner.run();

			return expect( result ).to.eventually.be.rejectedWith( Error, 'Thrown' );
		} );

		it( 'throws on rejection from the step', () => {
			const runner = new Runner();
			const step = {
				id: 'step',
				name: 'Step',
				run() {
					return Promise.reject( new Error( 'Reject' ) );
				},
				report() {}
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
					id: 'step1',
					name: 'Step #1',
					run() {
						return {
							ok: false,
							results: {}
						};
					},
					report() {}
				},

				{
					id: 'step2',
					name: 'Step #2',
					run() {
						return {
							ok: true,
							results: {}
						};
					},
					report() {}
				}
			];
			const trueSteps = [
				{
					id: 'step1',
					name: 'Step #1',
					run() {
						return {
							ok: true,
							results: {}
						};
					},
					report() {}
				},

				{
					id: 'step2',
					name: 'Step #2',
					run() {
						return {
							ok: true,
							results: {}
						};
					},
					report() {}
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
				results: {}
			} );
			const stub2 = stub().returns( {
				ok: false,
				results: {}
			} );
			const stub3 = stub().returns( {
				ok: false,
				results: {}
			} );
			const steps = [
				{
					id: 'step1',
					name: 'Step #1',
					run: stub1,
					report() {}
				},

				{
					id: 'step2',
					name: 'Step #2',
					run: stub2,
					report() {}
				},

				{
					id: 'step3',
					name: 'Step #3',
					run: stub3,
					report() {}
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
				id: 'step1',
				name: 'Step #1',
				run() {
					return {
						ok: true,
						results: {}
					};
				},
				report() {}
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
					report() {}
				};
				const results1 = { ...resultsTemplate };
				const results2 = { ...resultsTemplate };
				const steps = [
					{
						id: 'step1',
						name: 'Step #1',
						run() {
							return results1;
						},
						report() {}
					},

					{
						id: 'step2',
						name: 'Step #2',
						run() {
							return results2;
						},
						report() {}
					}
				];

				runner.addSteps( steps );

				const startListener = spy();
				const endListener = spy();

				runner.on( 'step:start', startListener );
				runner.on( 'step:end', endListener );

				await runner.run();

				expect( startListener ).to.have.been.calledWith( steps[ 0 ] );
				expect( startListener ).to.have.been.calledWith( steps[ 1 ] );
				expect( endListener ).to.have.been.calledWith( steps[ 0 ], results1 );
				expect( endListener ).to.have.been.calledWith( steps[ 1 ], results2 );

				const startFirstRunContext = startListener.getCall( 0 ).args[ 1 ];
				const startSecondRunContext = startListener.getCall( 1 ).args[ 1 ];
				const endFirstRunContext = endListener.getCall( 0 ).args[ 2 ];
				const endSecondRunContext = endListener.getCall( 1 ).args[ 2 ];
				const expectedContext = {
					projectPath: process.cwd()
				};

				expect( startFirstRunContext ).to.deep.equal( expectedContext );
				expect( startSecondRunContext ).to.deep.equal( expectedContext );
				expect( endFirstRunContext ).to.deep.equal( expectedContext );
				expect( endSecondRunContext ).to.deep.equal( expectedContext );
			} );
		} );

		describe( 'end', () => {
			it( 'is not emitted when error occurs during step', async () => {
				const step = {
					id: 'step',
					name: 'Step',
					run() {
						throw new Error( 'Some error' );
					},
					report() {}
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
					id: 'step',
					name: 'Step',
					run() {
						throw error;
					},
					report() {}
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
					id: 'step',
					name: 'Step',
					run() {
						return;
					},
					report() {}
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
					id: 'step1',
					name: 'step1',
					run() {
						return { ...resultsTemplate };
					},
					report() {
						console.log( 'step1' );
					}
				},

				{
					id: 'step2',
					name: 'step2',
					run() {
						return { ...resultsTemplate };
					},
					report() {
						console.log( 'step2' );
					}
				}
			];
			const expected = [
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
					id: 'step1',
					name: 'step1',
					run() {
						return { ...resultsTemplate };
					},
					report() {
						console.log( 'step1' );
					}
				},

				{
					id: 'step2',
					name: 'step2',
					run() {
						return { ...resultsTemplate };
					},
					report() {
						console.log( 'step2' );
					}
				}
			];
			const logExpected = [
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
					id: 'step1',
					name: 'step1',
					run() {
						throw error;
					},
					report() {}
				},

				{
					id: 'step2',
					name: 'step2',
					run() {
						return { ...resultsTemplate };
					},
					report() {
						console.log( 'step2' );
					}
				}
			];
			const logExpected = [
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
