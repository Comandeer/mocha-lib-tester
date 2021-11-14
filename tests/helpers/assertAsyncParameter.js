async function assertAsyncParameter( {
	valids = [],
	invalids = [],
	error = {
		type: TypeError,
		message: 'Wrong parameter type'
	},
	code = () => {}
} = {} ) {
	const invalidPromises = invalids.map( ( invalid ) => {
		return expect( code( invalid ), invalid ).to.be.rejectedWith( error.type, error.message );
	} );
	const validPromises = valids.map( ( valid ) => {
		return expect( code( valid ), valid ).not.to.be.rejectedWith( error.type, error.message );
	} );

	return Promise.all( [
		...invalidPromises,
		...validPromises
	] );
}

export default assertAsyncParameter;
