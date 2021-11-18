import steps from '../steps.js';

function prepareSteps( {
	requestedSteps,
	isWatch = false
} = {} ) {
	const filteredSteps = requestedSteps.map( ( id ) => {
		const step = steps.find( ( step ) => {
			return step.id === id;
		} );

		return step || id;
	} );
	const invalidSteps = filteredSteps.filter( ( step ) => {
		return typeof step === 'string';
	} );

	if ( invalidSteps.length > 0 ) {
		const stepNames = invalidSteps.map( ( step ) => {
			return `"${ step }"`;
		} ).join( ', ' );

		throw new TypeError( `Provided step names (${ stepNames }) are incorrect` );
	}

	if ( isWatch ) {
		const watchableSteps = filteredSteps.filter( ( step ) => {
			return step.watchable;
		} );

		return watchableSteps;
	}

	return filteredSteps;
}

export default prepareSteps;
