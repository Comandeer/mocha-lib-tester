import { FSWatcher } from 'chokidar';
import assertParameter from './helpers/assertParameter.js';
import Logger from '../src/Logger.js';
import RunController from '../src/RunController.js';
import Runner from '../src/Runner.js';
import DummyRunner from './helpers/DummyRunner.js';
import { version } from '../package.json';
import DummyLogger from './helpers/DummyLogger.js';
import sleep from './helpers/sleep.js';

describe( 'RunController', () => {
	let sinonSandbox;
	let watcher;

	beforeEach( () => {
		sinonSandbox = sinon.createSandbox();
	} );

	afterEach( async () => {
		sinonSandbox.restore();

		if ( !watcher ) {
			return;
		}

		await watcher.close();

		watcher = null; // eslint-disable-line require-atomic-updates
	} );

	it( 'is a class', () => {
		expect( RunController ).to.be.a( 'function' );
	} );

	describe( '#path', () => {
		it( 'defaults to CWD', () => {
			const runner = new DummyRunner();
			const logger = new DummyLogger( runner );
			const controller = new RunController( runner, logger );

			expect( controller.path ).to.equal( process.cwd() );
		} );

		it( 'is set to config.path', () => {
			const expectedPath = 'hublabubla';
			const runner = new DummyRunner();
			const logger = new DummyLogger( runner );
			const controller = new RunController( runner, logger, {
				path: expectedPath
			} );

			expect( controller.path ).to.equal( expectedPath );
		} );
	} );

	describe( '#watcher', () => {
		it( 'defaults to null', () => {
			const runner = new DummyRunner();
			const logger = new DummyLogger( runner );
			const controller = new RunController( runner, logger );

			expect( controller.watcher ).to.equal( null );
		} );

		it( 'is populated by #watch()',	 () => {
			const runner = new DummyRunner();
			const logger = new DummyLogger( runner );
			const controller = new RunController( runner, logger );

			watcher = controller.watch();

			expect( controller.watcher ).to.equal( watcher );
		} );
	} );

	describe( '#continuous', () => {
		it( 'defaults to false', () => {
			const runner = new DummyRunner();
			const logger = new DummyLogger( runner );
			const controller = new RunController( runner, logger );

			expect( controller.continuous ).to.equal( false );
		} );

		it( 'is set to true by #watch()',	 () => {
			const runner = new DummyRunner();
			const logger = new DummyLogger( runner );
			const controller = new RunController( runner, logger );

			watcher = controller.watch();

			expect( controller.continuous ).to.equal( true );
		} );
	} );

	describe( '#constructor()', () => {
		it( 'requires Runner instance as the first parameter', () => {
			const runner = new Runner();
			const logger = new Logger( runner );

			assertParameter( {
				invalids: [
					'',
					null,
					[],
					{},
					() => {},
					1,
					logger
				],
				valids: [
					runner
				],
				error: {
					type: TypeError,
					message: 'The runner parameter must be a valid Runner instance.'
				},
				code( param ) {
					new RunController( param, logger );
				}
			} );
		} );

		it( 'requires Logger instance as the second parameter', () => {
			const runner = new Runner();
			const logger = new Logger( runner );

			assertParameter( {
				invalids: [
					'',
					null,
					[],
					{},
					() => {},
					1,
					runner
				],
				valids: [
					logger
				],
				error: {
					type: TypeError,
					message: 'The logger parameter must be a valid Logger instance.'
				},
				code( param ) {
					new RunController( runner, param );
				}
			} );
		} );

		it( 'requires object or undefined as the third parameter', () => {
			const runner = new Runner();
			const logger = new Logger( runner );

			assertParameter( {
				invalids: [
					'',
					null,
					[],
					() => {},
					1
				],
				valids: [
					undefined,
					{}
				],
				error: {
					type: TypeError,
					message: 'The config parameter must be an object.'
				},
				code( param ) {
					new RunController( runner, logger, param );
				}
			} );
		} );

		it( 'add default steps to the runner', () => {
			const runner = new DummyRunner();
			const logger = new DummyLogger( runner );
			const expectedSteps = [ 'lint', 'test', 'coverage', 'codecov' ];

			new RunController( runner, logger );

			const actualSteps = [ ...runner.steps ].map( ( { id } ) => {
				return id;
			} );

			expect( actualSteps ).to.deep.equal( expectedSteps );
		} );

		it( 'add steps to the runner based on config.requestedSteps', () => {
			const runner = new DummyRunner();
			const logger = new DummyLogger( runner );
			const expectedSteps = [ 'lint' ];

			new RunController( runner, logger, {
				requestedSteps: expectedSteps
			} );

			const actualSteps = [ ...runner.steps ].map( ( { id } ) => {
				return id;
			} );

			expect( actualSteps ).to.deep.equal( expectedSteps );
		} );

		it( 'add steps to the runner based on config.requestedSteps + config.isWatch', () => {
			const runner = new DummyRunner();
			const logger = new DummyLogger( runner );
			const expectedSteps = [ 'lint' ];

			new RunController( runner, logger, {
				requestedSteps: expectedSteps.concat( [ 'codecov' ] ),
				isWatch: true
			} );

			const actualSteps = [ ...runner.steps ].map( ( { id } ) => {
				return id;
			} );

			expect( actualSteps ).to.deep.equal( expectedSteps );
		} );
	} );

	describe( '#run()', () => {
		it( 'displays info about MLT', async () => {
			const runner = new DummyRunner();
			const logger = new DummyLogger( runner );
			const spy = sinonSandbox.spy( logger, 'log' );
			const controller = new RunController( runner, logger );

			runner.resolve( true );

			await controller.run();

			expect( spy ).to.have.been.calledOnceWithExactly( `MLT v${ version }` );
		} );

		it( 'does not display info about MLT on subsequent invokes', async () => {
			const runner = new DummyRunner();
			const logger = new DummyLogger( runner );
			const spy = sinonSandbox.spy( logger, 'log' );
			const controller = new RunController( runner, logger );

			runner.resolve( true );

			await controller.run();
			await controller.run();

			expect( spy ).to.have.been.calledOnceWithExactly( `MLT v${ version }` );
		} );

		it( 'invokes Runner run method', async () => {
			const runner = new DummyRunner();
			const logger = new DummyLogger( runner );
			const controller = new RunController( runner, logger );
			const spy = sinonSandbox.spy( runner, 'run' );

			runner.resolve( true );

			await controller.run();

			expect( spy ).to.have.been.calledOnce;
		} );

		it( 'resolves to 0 exit code for passed tests', async () => {
			const runner = new DummyRunner();
			const logger = new DummyLogger( runner );
			const controller = new RunController( runner, logger );

			runner.resolve( true );

			const returnValue = await controller.run();

			expect( returnValue ).to.equal( 0 );
		} );

		it( 'resolves to 1 exit code for failed tests', async () => {
			const runner = new DummyRunner();
			const logger = new DummyLogger( runner );
			const controller = new RunController( runner, logger );

			runner.resolve( false );

			const returnValue = await controller.run();

			expect( returnValue ).to.equal( 1 );
		} );

		it( 'does nothing if controller is already in the middle of the run', async () => {
			const runner = new DummyRunner();
			const logger = new DummyLogger( runner );
			const controller = new RunController( runner, logger );
			const spy = sinonSandbox.spy( runner, 'run' );

			controller.run();
			await sleep();
			controller.run();
			await sleep();
			runner.resolve( true );

			expect( spy ).to.have.been.calledOnce;
		} );
	} );

	describe( '#watch()', () => {
		it( 'creates file watcher', () => {
			const runner = new DummyRunner();
			const logger = new DummyLogger( runner );
			const controller = new RunController( runner, logger );

			watcher = controller.watch();

			expect( watcher ).to.be.an.instanceOf( FSWatcher );
		} );

		it( 'watches the directory pointed by #path', () => {
			const runner = new DummyRunner();
			const logger = new DummyLogger( runner );
			const controller = new RunController( runner, logger );

			watcher = controller.watch();

			expect( watcher.options.cwd ).to.equal( controller.path );
		} );

		it( 'schedules run on any observed change', () => {
			const runner = new DummyRunner();
			const logger = new DummyLogger( runner );
			const controller = new RunController( runner, logger );
			const spy = sinonSandbox.spy( controller, 'scheduleRun' );

			watcher = controller.watch();

			watcher.emit( 'all' );

			expect( spy ).to.have.been.calledOnce;
		} );
	} );

	describe( '#scheduleRun()', () => {
		it( 'invokes #run() if there is no current run', () => {
			const runner = new DummyRunner();
			const logger = new DummyLogger( runner );
			const controller = new RunController( runner, logger );
			const spy = sinonSandbox.spy( controller, 'run' );

			controller.scheduleRun();

			expect( spy ).to.have.been.calledOnce;
		} );

		it( 'invokes #run() only after the current run ends', async () => {
			const runner = new DummyRunner();
			const logger = new DummyLogger( runner );
			const controller = new RunController( runner, logger );

			controller.run();
			await sleep();

			const spy = sinonSandbox.spy( controller, 'run' );

			controller.scheduleRun();

			expect( spy ).not.to.have.been.called;

			const promise = new Promise( ( resolve ) => {
				runner.once( 'end', () => {
					resolve();
				} );
			} );

			runner.resolve( true );

			await promise;

			expect( spy ).to.have.been.calledOnce;
		} );

		it( 'invokes only one #run() after the current run ends despite multiple scheduling', async () => {
			const runner = new DummyRunner();
			const logger = new DummyLogger( runner );
			const controller = new RunController( runner, logger );

			controller.run();
			await sleep();

			const spy = sinonSandbox.spy( controller, 'run' );

			controller.scheduleRun();
			controller.scheduleRun();

			const promise = new Promise( ( resolve ) => {
				runner.once( 'end', () => {
					resolve();
				} );
			} );

			runner.resolve( true );

			await promise;

			expect( spy ).to.have.been.calledOnce;
		} );
	} );

	describe( '#start()', () => {
		it( 'invokes #run() by default', async () => {
			const runner = new DummyRunner();
			const logger = new DummyLogger( runner );
			const controller = new RunController( runner, logger );
			const spy = sinonSandbox.spy( controller, 'run' );

			runner.resolve( true );

			await controller.start();

			expect( spy ).to.have.been.calledOnce;
		} );

		it( 'invokes #run() if config.isWatch is set to false', async () => {
			const runner = new DummyRunner();
			const logger = new DummyLogger( runner );
			const controller = new RunController( runner, logger, {
				isWatch: false
			} );
			const spy = sinonSandbox.spy( controller, 'run' );

			runner.resolve( true );

			await controller.start();

			expect( spy ).to.have.been.calledOnce;
		} );

		it( 'invokes #watch() + #run() if config.isWatch is set to true', async () => {
			const runner = new DummyRunner();
			const logger = new DummyLogger( runner );
			const controller = new RunController( runner, logger, {
				isWatch: true
			} );
			const watchSpy = sinonSandbox.spy( controller, 'watch' );
			const runSpy = sinonSandbox.spy( controller, 'run' );

			runner.resolve( true );

			await controller.start();

			expect( watchSpy ).to.have.been.calledOnce;
			expect( runSpy ).to.have.been.calledOnce;
			expect( watchSpy ).to.have.been.calledImmediatelyBefore( runSpy );
		} );
	} );
} );
