import { expect } from 'chai';
import { use } from 'chai';
import { spy } from 'sinon';
import sinonChai from 'sinon-chai';
import validateResults from './helpers/validateResults.js';
import fixture from './fixtures/coverageData.js';
import codeCoverage from '../src/codeCoverage.js';

use( sinonChai );

describe( 'codeCoverage', () => {
	it( 'is a function', () => {
		expect( codeCoverage ).to.be.a( 'function' );
	} );

	it( 'expects object as a first parameter', () => {
		const invalid = [
			undefined,
			null,
			1,
			[],
			''
		];

		invalid.forEach( ( value ) => {
			expect( () => {
				codeCoverage( value );
			} ).to.throw( TypeError, 'Provided code coverage data must be an object' );
		} );

		expect( () => {
			codeCoverage( {} );
		} ).not.to.throw( TypeError, 'Provided code coverage data must be an object' );
	} );

	it( 'does not output anything', async () => {
		const consoleSpy = spy( console, 'log' );

		await codeCoverage( fixture );

		consoleSpy.restore();
		expect( consoleSpy ).not.to.be.called;
	} );

	it( 'returns Promise, which resolves to correct results object', async () => {
		const promise = codeCoverage( fixture );

		expect( promise ).to.be.instanceOf( Promise );

		const results = await promise;

		validateResults( results );
	} );
} );
