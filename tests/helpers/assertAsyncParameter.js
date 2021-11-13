function assertAsyncParameter( {
	valids = [],
	invalids = [],
	error = {
		type: TypeError,
		message: 'Wrong parameter type'
	},
	code = () => {}
} = {} ) {
	invalids.forEach( ( invalid ) => {
		expect( code( invalid ), invalid ).to.be.rejectedWith( error.type, error.message );
	} );

	valids.forEach( ( valid ) => {
		expect( code( valid ), valid ).not.to.be.rejectedWith( error.type, error.message );
	} );
}

export default assertAsyncParameter;
