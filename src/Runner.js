import EventEmitter from 'events';

const stepsSymbol = Symbol( 'steps' );

class Runner extends EventEmitter {
	constructor() {
		super();

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

	run( path = process.cwd() ) {
		if ( !isNonEmptyString( path ) ) {
			throw new TypeError( 'Provided path must be a non-empty string' );
		}

		this.emit( 'start' );

		const steps = [ ...this.steps ];

		return this._processSteps( steps, path );
	}

	async _processSteps( steps, path ) {
		const finish = ( result ) => {
			this.emit( 'end', result );

			return result;
		};
		const step = steps.shift();

		if ( !step ) {
			return finish( true );
		}

		this.emit( 'step:start', step );

		try {
			const result = await step.run( path );

			if ( !isValidResult( result ) ) {
				throw new TypeError( `Step ${ step.name } didn't return correct results` );
			}

			this.emit( 'step:end', step, result );

			if ( !result.ok ) {
				return finish( false );
			}

			if ( steps.length === 0 ) {
				return finish( true );
			}
		} catch ( error ) {
			this.emit( 'error', error );

			return finish( false );
		}

		return this._processSteps( steps, path );
	}
}

function isNonEmptyString( value ) {
	return typeof value === 'string' && value.trim().length > 0;
}

function isValidStep( step ) {
	if ( !step || typeof step !== 'object' ) {
		return false;
	}

	const isIdValid = isValidStepId( step.id );
	const isNameValid = typeof step.name === 'string' && step.name.trim().length > 0;
	const isRunValid = typeof step.run === 'function';

	return isIdValid && isNameValid && isRunValid;

	function isValidStepId( id ) {
		if ( typeof id !== 'string' || id.trim().length === 0 ) {
			return false;
		}

		const whiteSpaceRegex = /\s/;
		const isLoweredCase = id === id.toLowerCase();
		const isSpaceless = !whiteSpaceRegex.test( id );

		return isLoweredCase && isSpaceless;
	}
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
