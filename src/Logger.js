/* eslint-disable no-console */

import EventEmitter from 'events';
import chalk from 'chalk';
import Spinner from '@comandeer/cli-spinner';
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
const spinner = new Spinner( {
	label: 'Working…',
	stdout: process.stderr
} );

class Logger {
	constructor( runner ) {
		if ( !( runner instanceof EventEmitter ) ) {
			throw new TypeError( 'The passed runner parameter is not an EventEmitter instance' );
		}

		this.runner = runner;

		addListeners( this );
	}

	log( value, {
		type = LoggerType.LOG,
		color = LoggerColor.AUTO
	} = {} ) {
		if ( !( type instanceof LoggerType ) ) {
			throw new TypeError( 'Type option must be a LoggerType instance' );
		}

		if ( !( color instanceof LoggerColor ) ) {
			throw new TypeError( 'Color option must a LoggerColor instance' );
		}

		const consoleMethod = type === LoggerType.LOG ? 'log' : 'error';
		const colorMethod = colorMethods.get( color );

		console[ consoleMethod ]( colorMethod( value ) );
	}

	onStart() {
		this.log( 'Executing tests…', { color: LoggerColor.YELLOW } );
	}

	onStepStart( { name } ) {
		this.log( `---${ name }---`, { color: LoggerColor.BLUE } );
		spinner.show();
	}

	onStepEnd( { name, report }, results, context ) {
		spinner.hide();

		report( results, this, context );

		if ( !results.ok ) {
			return this.log( `Step ${ chalk.bold( name ) } failed with errors. Skipping subsequent steps.`, {
				color: LoggerColor.RED,
				type: LoggerType.ERROR
			} );
		}

		this.log( `Step ${ chalk.bold( name ) } finished successfully.`, { color: LoggerColor.GREEN } );
	}

	onEnd( result ) {
		spinner.hide();

		if ( !result ) {
			return this.log( 'There were some errors alonside the way 😿', { color: LoggerColor.RED } );
		}

		this.log( 'All steps finished correctly 🎉', { color: LoggerColor.GREEN } );
	}

	onError( error ) {
		spinner.hide();

		this.log( '🚨 Error occured:', {
			color: LoggerColor.RED,
			type: LoggerType.ERROR
		} );
		this.log( error, { type: LoggerType.ERROR } );
	}
}

function addListeners( logger ) {
	const runner = logger.runner;

	runner.on( 'start', logger.onStart.bind( logger ) );
	runner.on( 'step:start', logger.onStepStart.bind( logger ) );
	runner.on( 'step:end', logger.onStepEnd.bind( logger ) );
	runner.on( 'end', logger.onEnd.bind( logger ) );
	runner.on( 'error', logger.onError.bind( logger ) );
}

export default Logger;
