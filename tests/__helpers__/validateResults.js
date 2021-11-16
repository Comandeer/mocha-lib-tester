function validateResults( { name, ok, results } ) {
	expect( name, 'results.name property is defined' ).to.be.a( 'string' );
	expect( ok, 'results.ok property is defined' ).to.be.a( 'boolean' );
	expect( results, 'results.results property is defined' ).not.to.be.undefined;
}

export default validateResults;
