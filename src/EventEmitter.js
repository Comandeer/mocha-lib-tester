const listenersSymbol = Symbol( 'listeners' );
const onceListenersSymbol = Symbol( 'onceListeners' );

class EventEmitter {
	constructor() {
		this[ listenersSymbol ] = new Map();
		this[ onceListenersSymbol ] = new Map();
	}

	on( name, listener ) {
		const listeners = this._getListenersCollection( name );

		listeners.add( listener );
	}

	once( eventName, listener ) {
		this.on( eventName, listener );

		const onceListeners = this._getListenersCollection( eventName, this[ onceListenersSymbol ] );

		onceListeners.add( listener );
	}

	off( eventName, listener ) {
		const listeners = this._getListenersCollection( eventName );
		const onceListeners = this._getListenersCollection( eventName, this[ onceListenersSymbol ] );

		listeners.delete( listener );
		onceListeners.delete( listener );
	}

	async emit( eventName, ...eventData ) {
		const listeners = this._getListenersCollection( eventName );
		const onceListeners = this._getListenersCollection( eventName, this[ onceListenersSymbol ] );

		for ( const listener of listeners ) {
			await listener( ...eventData ); // eslint-disable-line no-await-in-loop

			if ( onceListeners.has( listener ) ) {
				this.off( eventName, listener );
			}
		}
	}

	_getListenersCollection( eventName, listeners = this[ listenersSymbol ] ) {
		if ( listeners.has( eventName ) ) {
			return listeners.get( eventName );
		}

		const newCollection = new Set();

		listeners.set( eventName, newCollection );

		return newCollection;
	}
}

export default EventEmitter;
