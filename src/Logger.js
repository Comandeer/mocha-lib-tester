/* eslint-disable no-console */

import chalk from 'chalk';
import EventEmitter from 'events';
import LoggerColor from './LoggerColor.js';
import LoggerType from './LoggerType.js';

const colorMethods = new Map( [
	[ LoggerColor.AUTO, ( value ) => {
		return value;
	} ],

	[ LoggerColor.BLUE, ( value ) => {
		return chalk.blue( value );
	} ],

	[ LoggerColor.YELLOW, ( value ) => {
		return chalk.yellow( value );
	} ],

	[ LoggerColor.GREEN, ( value ) => {
		return chalk.green( value );
	} ],

	[ LoggerColor.RED, ( value ) => {
		return chalk.red( value );
	} ]
] );

class Logger {
	constructor( runner ) {
		if ( !( runner instanceof EventEmitter ) ) {
			throw new TypeError( 'The passed runner parameter is not an EventEmitter instance' );
		}

		this.runner = runner;
	}

	log( type, value, {
		color = LoggerColor.AUTO
	} = {} ) {
		if ( !( type instanceof LoggerType ) ) {
			throw new TypeError( 'The type of log must be a LoggerType instance' );
		}

		if ( !( color instanceof LoggerColor ) ) {
			throw new TypeError( 'Color option must a LoggerColor instance' );
		}

		const consoleMethod = type === LoggerType.LOG ? 'log' : 'error';
		const colorMethod = colorMethods.get( color );

		console[ consoleMethod ]( colorMethod( value ) );
	}
}

export default Logger;
