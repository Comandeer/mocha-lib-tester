/* globals expect */

function assertParameter( {
	valids = [],
	invalids = [],
	error = {
		type: TypeError,
		message: 'Wrong parameter type'
	},
	code = () => {}
} = {} ) {
	invalids.forEach( ( invalid ) => {
		expect( () => {
			code( invalid );
		}, invalid ).to.throw( error.type, error.message );
	} );

	valids.forEach( ( valid ) => {
		expect( () => {
			code( valid );
		}, valid ).not.to.throw( error.type, error.message );
	} );
}

export default assertParameter;
