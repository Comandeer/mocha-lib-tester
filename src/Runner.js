const stepsSymbol = Symbol( 'steps' );

class Runner {
	constructor() {
		this[ stepsSymbol ] = Object.freeze( new Set() );
	}

	get steps() {
		return this[ stepsSymbol ];
	}

	addStep( step ) {
		if ( !isValidStep( step ) ) {
			throw new TypeError( 'Provided object must be a valid step definition' );
		}

		this.steps.add( step );
	}

	addSteps( steps ) {
		const isValidStepsArray = Array.isArray( steps ) && steps.every( ( step ) => {
			return isValidStep( step );
		} );

		if ( !isValidStepsArray ) {
			throw new TypeError( 'Provided array must contain only valid step definitions' );
		}

		steps.forEach( ( step ) => {
			this.addStep( step );
		} );
	}

	async run() {
		const promises = [ ...this.steps ].map( ( { run } ) => {
			return run();
		} );

		await Promise.all( promises );

		return true;
	}
}

function isValidStep( value ) {
	if ( !value || typeof value !== 'object' ) {
		return false;
	}

	const isNameValid = typeof value.name === 'string' && value.name.trim().length > 0;
	const isRunValid = typeof value.run === 'function';

	return isNameValid && isRunValid;
}

export default Runner;
