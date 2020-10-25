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

	run() {
		const steps = [ ...this.steps ];

		return this._processSteps( steps );
	}

	async _processSteps( steps ) {
		const step = steps.shift();

		if ( !step ) {
			return true;
		}

		const result = await step.run();

		if ( !isValidResult( result ) ) {
			throw new TypeError( `Step ${ step.name } didn't return correct results` );
		}

		if ( !result.results.ok ) {
			return false;
		}

		if ( steps.length === 0 ) {
			return true;
		}

		return this._processSteps( steps );
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

function isValidResult( stepResults ) {
	if ( !stepResults || typeof stepResults !== 'object' ) {
		return false;
	}

	const isValidResults = stepResults.results && typeof stepResults.results === 'object';
	const isValidReporter = typeof stepResults.reporter === 'function';
	return isValidResults && isValidReporter;
}

export default Runner;
