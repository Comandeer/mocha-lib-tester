import { expect } from 'chai';

function validateResults( { name, ok, results, reporter } ) {
	expect( name, 'results.name property is defined' ).to.be.a( 'string' );
	expect( ok, 'results.ok property is defined' ).to.be.a( 'boolean' );
	expect( results, 'results.results property is defined' ).not.to.be.undefined;
	expect( reporter, 'results.reporter property is defined' ).to.be.a( 'function' );
}

export default validateResults;
