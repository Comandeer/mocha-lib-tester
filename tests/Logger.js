/* eslint-disable no-console */

import EventEmitter from 'events';
import chalk from 'chalk';
import assertParameter from './helpers/assertParameter.js';
import LoggerType from '../src/LoggerType.js';
import LoggerColor from '../src/LoggerColor.js';
import Logger from '../src/Logger.js';

const { spy, stub } = sinon;

describe( 'Logger', () => {
	beforeEach( () => {
		stub( console, 'log' );
		stub( console, 'error' );
	} );

	afterEach( () => {
		console.log.restore();
		console.error.restore();
	} );

	it( 'is a class', () => {
		expect( Logger ).to.be.a( 'function' );
	} );

	describe( '#constructor()', () => {
		it( 'requires EventEmitter as a first parameter', () => {
			assertParameter( {
				invalids: [
					undefined,
					null,
					true,
					1,
					'test',
					{},
					[],
					() => {},
					{
						emit() {}
					}
				],
				valids: [
					new EventEmitter()
				],
				error: {
					type: TypeError,
					message: 'The passed runner parameter is not an EventEmitter instance'
				},
				code( value ) {
					new Logger( value );
				}
			} );
		} );
	} );

	describe( '#log()', () => {
		it( 'accepts LoggerType as the type option', () => {
			assertParameter( {
				invalids: [
					null,
					1,
					true,
					'LOG',
					{},
					() => {}
				],
				valids: [
					LoggerType.LOG,
					LoggerType.ERROR
				],
				error: {
					type: TypeError,
					message: 'Type option must be a LoggerType instance'
				},
				code( value ) {
					const [ logger ] = createLogger();

					logger.log( '', {
						type: value
					} );
				}
			} );
		} );

		it( 'accepts LoggerColor as the color option', () => {
			assertParameter( {
				invalids: [
					'#f00',
					'RED',
					null,
					true,
					1,
					{}
				],
				valids: [
					undefined,
					LoggerColor.AUTO,
					LoggerColor.BLUE,
					LoggerColor.YELLOW,
					LoggerColor.GREEN,
					LoggerColor.RED
				],
				error: {
					type: TypeError,
					message: 'Color option must a LoggerColor instance'
				},
				code( value ) {
					const [ logger ] = createLogger();

					logger.log( '', {
						color: value
					} );
				}
			} );
		} );

		it( 'uses console.log by default', () => {
			const [ logger ] = createLogger();
			const value = {};

			logger.log( value );

			expect( console.log ).to.have.been.calledOnceWithExactly( value );
			expect( console.error ).not.to.have.been.called;
		} );

		it( 'uses console.log when the log type is set to LoggerType.LOG', () => {
			const [ logger ] = createLogger();
			const value = {};

			logger.log( value, {
				type: LoggerType.LOG
			} );

			expect( console.log ).to.have.been.calledOnceWithExactly( value );
			expect( console.error ).not.to.have.been.called;
		} );

		it( 'uses console.error when the log type is set to LoggerType.ERROR', () => {
			const [ logger ] = createLogger();
			const value = {};

			logger.log( value, {
				type: LoggerType.ERROR
			} );

			expect( console.error ).to.have.been.calledOnceWithExactly( value );
			expect( console.log ).not.to.have.been.called;
		} );

		describe( 'colors', () => {
			it( 'does not change passed value when color is set to LoggerColor.AUTO', () => {
				const [ logger ] = createLogger();
				const value = 'Hublabubla';

				logger.log( value, {
					color: LoggerColor.AUTO
				} );

				expect( console.log ).to.have.been.calledOnceWithExactly( value );
			} );

			it( 'change color to blue when color is set to LoggerColor.BLUE', () => {
				const [ logger ] = createLogger();
				const value = 'Hublabubla';
				const expected = chalk.blue( value );

				logger.log( value, {
					color: LoggerColor.BLUE
				} );

				expect( console.log ).to.have.been.calledOnceWithExactly( expected );
			} );

			it( 'change color to yellow when color is set to LoggerColor.YELLOW', () => {
				const [ logger ] = createLogger();
				const value = 'Hublabubla';
				const expected = chalk.yellow( value );

				logger.log( value, {
					color: LoggerColor.YELLOW
				} );

				expect( console.log ).to.have.been.calledOnceWithExactly( expected );
			} );

			it( 'change color to green when color is set to LoggerColor.GREEN', () => {
				const [ logger ] = createLogger();
				const value = 'Hublabubla';
				const expected = chalk.green( value );

				logger.log( value, {
					color: LoggerColor.GREEN
				} );

				expect( console.log ).to.have.been.calledOnceWithExactly( expected );
			} );

			it( 'change color to red when color is set to LoggerColor.RED', () => {
				const [ logger ] = createLogger();
				const value = 'Hublabubla';
				const expected = chalk.red( value );

				logger.log( value, {
					color: LoggerColor.RED
				} );

				expect( console.log ).to.have.been.calledOnceWithExactly( expected );
			} );
		} );
	} );

	describe( 'listeners', () => {
		describe( 'start', () => {
			it( 'displays info about executing tests', () => {
				const [ , eventEmitter ] = createLogger();
				const expected = chalk.yellow( 'Executing tests…' );

				eventEmitter.emit( 'start' );

				expect( console.log ).to.have.been.calledOnce;
				expect( console.log.getCall( 0 ) ).to.have.been.calledWithExactly( expected );
			} );
		} );

		describe( 'step:start', () => {
			it( 'displays info about the step', () => {
				const [ , eventEmitter ] = createLogger();
				const step = {
					name: 'hublabubla'
				};
				const expected = chalk.blue( `---${ step.name }---` );

				eventEmitter.emit( 'step:start', step );

				expect( console.log ).to.have.been.calledOnceWithExactly( expected );
			} );
		} );

		describe( 'step:end', () => {
			it( 'display info about correct step execution', () => {
				const [ , eventEmitter ] = createLogger();
				const step = {
					name: 'hublabubla'
				};
				const results = {
					ok: true,
					results: {},
					reporter() {}
				};
				const expected = chalk.green( `Step ${ chalk.bold( step.name ) } finished successfully.` );

				eventEmitter.emit( 'step:end', step, results );

				expect( console.log ).to.have.been.calledOnceWithExactly( expected );
			} );

			it( 'display info about incorrect step execution', () => {
				const [ , eventEmitter ] = createLogger();
				const step = {
					name: 'hublabubla'
				};
				const results = {
					ok: false,
					results: {},
					reporter() {}
				};
				const expected = chalk.red( `Step ${ chalk.bold( step.name ) } failed with errors. Skipping subsequent steps.` );

				eventEmitter.emit( 'step:end', step, results );

				expect( console.error ).to.have.been.calledOnceWithExactly( expected );
			} );

			it( 'invokes reporter with correct arguments', () => {
				const [ logger, eventEmitter ] = createLogger();
				const step = {
					name: 'hublabubla'
				};
				const reporter = spy();
				const results = {
					ok: true,
					results: {},
					reporter
				};

				eventEmitter.emit( 'step:end', step, results );

				expect( reporter ).to.have.been.calledOnceWith( results.results, logger );
			} );
		} );

		describe( 'end', () => {
			it( 'displays info about success', () => {
				const [ , eventEmitter ] = createLogger();
				const expected = chalk.green( 'All steps finished correctly 🎉' );

				eventEmitter.emit( 'end', true );

				expect( console.log ).to.have.been.calledOnceWithExactly( expected );
			} );

			it( 'displays info about failure', () => {
				const [ , eventEmitter ] = createLogger();
				const expected = chalk.red( 'There were some errors alonside the way 😿' );

				eventEmitter.emit( 'end', false );

				expect( console.log ).to.have.been.calledOnceWithExactly( expected );
			} );
		} );

		describe( 'error', () => {
			it( 'displays info about error', () => {
				const [ , eventEmitter ] = createLogger();
				const error = new Error();
				const expected = chalk.red( '🚨 Error occured:' );

				eventEmitter.emit( 'error', error );

				expect( console.error ).to.have.been.calledWithExactly( expected );
				expect( console.error ).to.have.been.calledWithExactly( error );
			} );
		} );
	} );
} );

function createLogger() {
	const eventEmitter = new EventEmitter();
	const logger = new Logger( eventEmitter );

	return [ logger, eventEmitter ];
}
