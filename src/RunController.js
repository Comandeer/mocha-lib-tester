import chokidar from 'chokidar';
import Logger from './Logger.js';
import Runner from './Runner.js';
import prepareSteps from './prepareSteps.js';
import { version } from '../package.json';

const configSymbol = Symbol( 'config' );
const bannerEmittedSymbol = Symbol( 'bannerEmitted' );
const isInTheMiddleOfRunSymbol = Symbol( 'isInTheMiddleOfRun' );
const scheduledRunSymbol = Symbol( 'scheduledRun' );

class RunController {
	constructor( runner, logger, config = {} ) {
		if ( !( runner instanceof Runner ) ) {
			throw new TypeError( 'The runner parameter must be a valid Runner instance.' );
		}

		if ( !( logger instanceof Logger ) ) {
			throw new TypeError( 'The logger parameter must be a valid Logger instance.' );
		}

		if ( !config || Array.isArray( config ) || typeof config !== 'object' ) {
			throw new TypeError( 'The config parameter must be an object.' );
		}

		this.runner = runner;
		this.logger = logger;
		this.watcher = null;
		this.continuous = false;
		this[ configSymbol ] = config;
		this[ bannerEmittedSymbol ] = false;
		this[ isInTheMiddleOfRunSymbol ] = false;

		this._init( config );
	}

	async run() {
		if ( !this[ bannerEmittedSymbol ] ) {
			this.logger.log( `MLT v${ version }` );

			this[ bannerEmittedSymbol ] = true;
		}

		if ( this[ isInTheMiddleOfRunSymbol ] ) {
			return;
		}

		this[ isInTheMiddleOfRunSymbol ] = true;

		const result = await this.runner.run( this.path );
		const exitCode = result ? 0 : 1;

		this[ isInTheMiddleOfRunSymbol ] = false;

		return exitCode;
	}

	watch() {
		const watcher = chokidar.watch( '{bin,src,tests}/**/*.js', {
			persistent: true,
			ignoreInitial: true,
			cwd: process.cwd()
		} );

		watcher.on( 'all', () => {
			this.scheduleRun();
		} );

		this.continuous = true;
		this.watcher = watcher;

		return watcher;
	}

	scheduleRun() {
		if ( this[ scheduledRunSymbol ] ) {
			return;
		}

		if ( !this[ isInTheMiddleOfRunSymbol ] ) {
			return this.run();
		}

		this[ scheduledRunSymbol ] = true;

		this.runner.once( 'end', () => {
			this[ scheduledRunSymbol ] = false;
			this.run();
		} );
	}

	start() {
		const isWatch = this[ configSymbol ].isWatch;

		if ( isWatch ) {
			this.watch();
		}

		return this.run();
	}

	_init( {
		path = process.cwd(),
		requestedSteps = [ 'lint', 'test', 'coverage', 'codecov' ],
		isWatch = false
	} = {} ) {
		this.path = path;

		const preparedSteps = prepareSteps ( {
			requestedSteps,
			isWatch
		} );

		this.runner.addSteps( preparedSteps );
	}
}

export default RunController;
