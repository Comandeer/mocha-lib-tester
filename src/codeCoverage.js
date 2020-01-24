function codeCoverage( data ) {
	if ( !data || typeof data !== 'object' || Array.isArray( data ) ) {
		throw new TypeError( 'Provided code coverage data must be an object' );
	}

	return Promise.resolve( {
		name: 'code coverage',
		ok: true,
		results: {},
		reporter() {}
	} );
}

export default codeCoverage;
