import { join as joinPath } from 'path';
import { expect } from 'chai';
import { use } from 'chai';
import { spy } from 'sinon';
import sinonChai from 'sinon-chai';
import linter from '../src/linter.js';

use( sinonChai );

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

	it( 'doe not throw due to nonexistent files', () => {
		const fixturePath = joinPath( __dirname, 'fixtures', 'lintPackage' );

		expect( () => {
			linter( fixturePath );
		} ).not.to.throw( Error, 'No files matching \'bin/**/*\' were found.' );
	} );

	it( 'does not output anything', () => {
		const consoleSpy = spy( console, 'log' );

		linter( '.' );

		consoleSpy.restore();
		expect( consoleSpy ).not.to.be.called;
	} );

	it( 'returns object with results and reporter fields', () => {
		expect( linter( '.' ) ).to.have.all.keys( 'results', 'reporter' );
	} );

	it( 'detects errors in correct files', () => {
		const fixturePath = joinPath( __dirname, 'fixtures', 'lintPackage' );
		const { results } = linter( fixturePath );

		const expected = {
			[ joinPath( fixturePath, 'src', 'empty.js' ) ]: 0,
			[ joinPath( fixturePath, 'src', 'index.js' ) ]: 1,
			[ joinPath( fixturePath, 'tests', 'index.js' ) ]: 1,
			[ joinPath( fixturePath, 'tests', 'something', 'subtest.js' ) ]: 0
		};

		expect( results ).to.have.lengthOf( Object.keys( expected ).length );

		results.forEach( ( { filePath, errorCount } ) => {
			expect( filePath ).to.be.oneOf( Object.keys( expected ) );
			expect( errorCount ).to.equal( expected[ filePath ] );
		} );
	} );
} );
