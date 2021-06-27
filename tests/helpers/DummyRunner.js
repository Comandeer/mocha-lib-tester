import Runner from '../../src/Runner.js';

class DummyRunner extends Runner {
	constructor() {
		super();

		this.promise = new Promise( ( resolve, reject ) => {
			this.resolve = ( ...args ) => {
				resolve( ...args );
				this.emit( 'end' );
			};
			this.reject = reject;
		} );
	}

	run() {
		this.emit( 'start' );

		return this.promise;
	}
}

export default DummyRunner;
