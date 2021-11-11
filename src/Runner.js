import EventEmitter from 'events';

const stepsSymbol = Symbol( 'steps' );
const stepResultsSymbol = Symbol( 'stepResults' );

class Runner extends EventEmitter {
	constructor() {
		super();

		this[ stepsSymbol ] = Object.freeze( new Set() );
		this[ stepResultsSymbol ] = {};
	}

	get steps() {
		return this[ stepsSymbol ];
	}

	addStep( step ) {
		const stepIds = [ ...this.steps ].map( ( { id } ) => {
			return id;
		} );

		if ( !isValidStep( step, stepIds ) ) {
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
		const context = this._constructContext( path );

		if ( !step ) {
			return finish( true );
		}

		this.emit( 'step:start', step, context );

		try {
			const requiresParameter = this._constructRequiresParameter( step );

			const result = await step.run( path, requiresParameter );

			if ( !isValidResult( result ) ) {
				throw new TypeError( `Step ${ step.name } didn't return correct results` );
			}

			this[ stepResultsSymbol ][ step.id ] = result;

			this.emit( 'step:end', step, result, context );

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

	_constructRequiresParameter( { requires } ) {
		if ( !requires ) {
			return {};
		}

		return requires.reduce( ( parameter, stepId ) => {
			const results = {
				[ stepId ]: this[ stepResultsSymbol ][ stepId ]
			};

			return { ...parameter, ...results };
		}, {} );
	}

	_constructContext( projectPath ) {
		return {
			projectPath
		};
	}
}

function isNonEmptyString( value ) {
	return typeof value === 'string' && value.trim().length > 0;
}

function isValidStep( step, stepIds ) {
	if ( !step || typeof step !== 'object' ) {
		return false;
	}

	const isIdValid = isValidStepId( step.id );
	const isNameValid = typeof step.name === 'string' && step.name.trim().length > 0;
	const isRunValid = typeof step.run === 'function';
	const isReporterValid = typeof step.report === 'function';
	const isRequiresValid = Array.isArray( stepIds ) ? isValidRequires( step.requires, stepIds ) : true;

	return isIdValid && isNameValid && isRunValid && isReporterValid && isRequiresValid;

	function isValidStepId( id ) {
		if ( typeof id !== 'string' || id.trim().length === 0 ) {
			return false;
		}

		const whiteSpaceRegex = /\s/;
		const isLoweredCase = id === id.toLowerCase();
		const isSpaceless = !whiteSpaceRegex.test( id );

		return isLoweredCase && isSpaceless;
	}

	function isValidRequires( requires, availableSteps ) {
		if ( typeof requires === 'undefined' ) {
			return true;
		}

		if ( typeof requires !== 'undefined' && !Array.isArray( requires ) ) {
			return false;
		}

		return requires.every( ( requires ) => {
			return availableSteps.includes( requires );
		} );
	}
}

function isValidResult( stepResults ) {
	if ( !stepResults || typeof stepResults !== 'object' ) {
		return false;
	}

	const isValidResults = stepResults.results && typeof stepResults.results === 'object';

	return isValidResults;
}

export default Runner;
