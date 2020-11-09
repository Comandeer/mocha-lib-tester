/* eslint-disable no-console */
/* globals expect, sinon */

import EventEmitter from 'events';
import chalk from 'chalk';
import assertParameter from './helpers/assertParameter.js';
import LoggerType from '../src/LoggerType.js';
import LoggerColor from '../src/LoggerColor.js';
import Logger from '../src/Logger.js';

const { stub } = sinon;

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
					const logger = createLogger();

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
					const logger = createLogger();

					logger.log( '', {
						color: value
					} );
				}
			} );
		} );

		it( 'uses console.log by default', () => {
			const logger = createLogger();
			const value = {};

			logger.log( value );

			expect( console.log ).to.have.been.calledOnceWithExactly( value );
			expect( console.error ).not.to.have.been.called;
		} );

		it( 'uses console.log when the log type is set to LoggerType.LOG', () => {
			const logger = createLogger();
			const value = {};

			logger.log( value, {
				type: LoggerType.LOG
			} );

			expect( console.log ).to.have.been.calledOnceWithExactly( value );
			expect( console.error ).not.to.have.been.called;
		} );

		it( 'uses console.error when the log type is set to LoggerType.ERROR', () => {
			const logger = createLogger();
			const value = {};

			logger.log( value, {
				type: LoggerType.ERROR
			} );

			expect( console.error ).to.have.been.calledOnceWithExactly( value );
			expect( console.log ).not.to.have.been.called;
		} );

		describe( 'colors', () => {
			it( 'does not change passed value when color is set to LoggerColor.AUTO', () => {
				const logger = createLogger();
				const value = 'Hublabubla';

				logger.log( value, {
					color: LoggerColor.AUTO
				} );

				expect( console.log ).to.have.been.calledOnceWithExactly( value );
			} );

			it( 'change color to blue when color is set to LoggerColor.BLUE', () => {
				const logger = createLogger();
				const value = 'Hublabubla';
				const expected = chalk.blue( value );

				logger.log( value, {
					color: LoggerColor.BLUE
				} );

				expect( console.log ).to.have.been.calledOnceWithExactly( expected );
			} );

			it( 'change color to yellow when color is set to LoggerColor.YELLOW', () => {
				const logger = createLogger();
				const value = 'Hublabubla';
				const expected = chalk.yellow( value );

				logger.log( value, {
					color: LoggerColor.YELLOW
				} );

				expect( console.log ).to.have.been.calledOnceWithExactly( expected );
			} );

			it( 'change color to green when color is set to LoggerColor.GREEN', () => {
				const logger = createLogger();
				const value = 'Hublabubla';
				const expected = chalk.green( value );

				logger.log( value, {
					color: LoggerColor.GREEN
				} );

				expect( console.log ).to.have.been.calledOnceWithExactly( expected );
			} );

			it( 'change color to red when color is set to LoggerColor.RED', () => {
				const logger = createLogger();
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
	} );
} );

function createLogger() {
	const eventEmitter = new EventEmitter();
	const logger = new Logger( eventEmitter );

	return logger;
}
