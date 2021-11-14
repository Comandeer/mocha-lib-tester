import sleep from './helpers/sleep.js';
import EventEmitter from '../src/EventEmitter.js';

describe( 'EventEmitter', () => {
	let sinonSandbox;

	beforeEach( () => {
		sinonSandbox = sinon.createSandbox();
	} );

	afterEach( () => {
		sinonSandbox.restore();
	} );

	it( 'is a class', () => {
		expect( EventEmitter ).to.be.a( 'function' );
	} );

	describe( '#on()', () => {
		it( 'receives correct event data', async () => {
			const eventEmitter = new EventEmitter();
			const eventName = 'hublabubla';
			const expectedEventData = {
				test: true
			};

			eventEmitter.on( eventName, ( eventData ) => {
				expect( eventData ).to.equal( expectedEventData );
			} );

			await eventEmitter.emit( eventName, expectedEventData );
		} );

		it( 'invokes on every event emit', async () => {
			const eventEmitter = new EventEmitter();
			const eventName = 'hublabubla';
			const listener = sinonSandbox.spy();

			eventEmitter.on( eventName, listener );

			await eventEmitter.emit( eventName, {} );
			await eventEmitter.emit( eventName, {} );

			expect( listener ).to.have.been.calledTwice;
		} );
	} );

	describe( '#once()', () => {
		it( 'receives correct event data', async () => {
			const eventEmitter = new EventEmitter();
			const eventName = 'hublabubla';
			const expectedEventData = {
				test: true
			};

			eventEmitter.once( eventName, ( eventData ) => {
				expect( eventData ).to.equal( expectedEventData );
			} );

			await eventEmitter.emit( eventName, expectedEventData );
		} );

		it( 'invokes only on the first event emit', async () => {
			const eventEmitter = new EventEmitter();
			const eventName = 'hublabubla';
			const listener = sinonSandbox.spy();
			const firstCallData = {};

			eventEmitter.once( eventName, listener );

			await eventEmitter.emit( eventName, firstCallData );
			await eventEmitter.emit( eventName, {} );

			expect( listener ).to.have.been.calledOnce;
			expect( listener ).to.have.been.calledWithExactly( firstCallData );
		} );
	} );

	describe( '#off()', () => {
		it( 'removes listener added via #on()', async () => {
			const eventEmitter = new EventEmitter();
			const eventName = 'hublabubla';
			const listener = sinonSandbox.spy();

			eventEmitter.on( eventName, listener );
			eventEmitter.off( eventName, listener );

			await eventEmitter.emit( eventName, {} );

			expect( listener ).not.to.have.been.called;
		} );

		it( 'removes listener added via #once()', async () => {
			const eventEmitter = new EventEmitter();
			const eventName = 'hublabubla';
			const listener = sinonSandbox.spy();

			eventEmitter.once( eventName, listener );
			eventEmitter.off( eventName, listener );

			await eventEmitter.emit( eventName, {} );

			expect( listener ).not.to.have.been.called;
		} );
	} );

	describe( '#emit()', () => {
		it( 'invokes listeners serially', async () => {
			const eventEmitter = new EventEmitter();
			const eventName = 'hublabubla';
			const listener1 = sinonSandbox.spy();
			const listener2 = sinonSandbox.spy();
			const listener3 = sinonSandbox.spy();

			eventEmitter.on( eventName, listener1 );
			eventEmitter.on( eventName, async () => {
				await sleep( 100 );

				listener2();
			} );
			eventEmitter.on( eventName, async () => {
				await sleep ();

				listener3();
			} );

			await eventEmitter.emit( eventName, {} );

			expect( listener2 ).to.have.been.calledImmediatelyAfter( listener1 );
			expect( listener3 ).to.have.been.calledImmediatelyAfter( listener2 );
		} );
	} );
} );
