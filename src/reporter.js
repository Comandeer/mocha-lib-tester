function reporter( steps = [] ) {
	if ( !steps.every( validateStep ) ) {
		throw new TypeError( 'Passed results must be of correct type' );
	}

	steps.forEach( ( { results, reporter } ) => {
		reporter( results );
	} );
}

function validateStep( step ) {
	return typeof step.results !== 'undefined' && typeof step.reporter === 'function';
}

export default reporter;
