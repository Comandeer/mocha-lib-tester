import { join as joinPath } from 'path';
import { expect } from 'chai';
import { use } from 'chai';
import { spy } from 'sinon';
import sinonChai from 'sinon-chai';
import validateResults from './helpers/validateResults.js';
import linter from '../src/linter.js';

use( sinonChai );

const lintFixture = joinPath( __dirname, 'fixtures', 'lintPackage' );
const noErrorsFixture = joinPath( __dirname, 'fixtures', 'lintCorrectPackage' );

describe( 'linter', () => {
	it( 'is a function', () => {
		expect( linter ).to.be.a( 'function' );
	} );

	it( 'expects path as a first parameter', () => {
		const invalid = [
			undefined,
			null,
			1,
			{},
			[],
			''
		];

		invalid.forEach( ( value ) => {
			expect( () => {
				linter( value );
			} ).to.throw( TypeError, 'Provided path must be a non-empty string' );
		} );

		expect( () => {
			linter( '.' );
		} ).not.to.throw( TypeError, 'Provided path must be a non-empty string' );
	} );

	it( 'does not throw due to nonexistent files', () => {
		expect( () => {
			linter( lintFixture );
		} ).not.to.throw( Error, 'No files matching \'bin/**/*\' were found.' );
	} );

	it( 'does not output anything', async () => {
		const consoleSpy = spy( console, 'log' );

		await linter( lintFixture );

		consoleSpy.restore();
		expect( consoleSpy ).not.to.be.called;
	} );

	it( 'returns Promise, which resolves to correct results object', async () => {
		const promise = linter( lintFixture );

		expect( promise ).to.be.instanceOf( Promise );

		const results = await promise;

		validateResults( results );
	} );

	it( 'detects errors in correct files', async () => {
		const { results, ok } = await linter( lintFixture );

		const expected = {
			[ joinPath( lintFixture, 'src', 'empty.js' ) ]: 0,
			[ joinPath( lintFixture, 'src', 'index.js' ) ]: 1,
			[ joinPath( lintFixture, 'tests', 'index.js' ) ]: 1,
			[ joinPath( lintFixture, 'tests', 'something', 'subtest.js' ) ]: 0
		};

		expect( ok ).to.equal( false );
		expect( results ).to.have.lengthOf( Object.keys( expected ).length );

		results.forEach( ( { filePath, errorCount } ) => {
			expect( filePath ).to.be.oneOf( Object.keys( expected ) );
			expect( errorCount ).to.equal( expected[ filePath ] );
		} );
	} );

	it( 'correctly set ok value when there are no errors', async () => {
		const { ok } = await linter( noErrorsFixture );

		expect( ok ).to.equal( true );
	} );
} );
