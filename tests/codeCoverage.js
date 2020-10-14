/* globals expect, sinon */

import { resolve as resolvePath } from 'path';
import { existsSync as exists } from 'fs';
import { sync as rimraf } from 'rimraf';
import validateResults from './helpers/validateResults.js';
import fixture from './fixtures/coverageData.js';
import codeCoverage from '../src/codeCoverage.js';

const { spy, stub } = sinon;

describe( 'codeCoverage', () => {
	it( 'is a function', () => {
		expect( codeCoverage ).to.be.a( 'function' );
	} );

	it( 'expects non-empty string as the first parameter', () => {
		const invalid = [
			undefined,
			null,
			1,
			[],
			''
		];

		invalid.forEach( ( value ) => {
			expect( () => {
				codeCoverage( value, {} );
			} ).to.throw( TypeError, 'Provided path must be a non-empty string' );
		} );

		expect( () => {
			codeCoverage( '.', {} );
		} ).not.to.throw( TypeError, 'Provided path must be a non-empty string' );
	} );

	it( 'expects object as the second parameter', () => {
		const invalid = [
			undefined,
			null,
			1,
			[],
			''
		];

		invalid.forEach( ( value ) => {
			expect( () => {
				codeCoverage( '.', value );
			} ).to.throw( TypeError, 'Provided code coverage data must be an object' );
		} );

		expect( () => {
			codeCoverage( '.', {} );
		} ).not.to.throw( TypeError, 'Provided code coverage data must be an object' );
	} );

	it( 'does not output anything', async () => {
		const consoleSpy = spy( console, 'log' );

		await codeCoverage( '.', fixture );

		consoleSpy.restore();
		expect( consoleSpy ).not.to.be.called;
	} );

	it( 'returns Promise, which resolves to correct results object', async () => {
		const promise = codeCoverage( '.', fixture );

		expect( promise ).to.be.instanceOf( Promise );

		const results = await promise;

		validateResults( results );
	} );

	describe( 'reporter', () => {
		const projectPath = resolvePath( __dirname, 'fixtures', 'emptyPackage' );

		afterEach( () => {
			const coveragePath = resolvePath( projectPath, '.coverage' );

			rimraf( coveragePath );
		} );

		it( 'generate .coverage directory in project path', async () => {
			const coveragePath = resolvePath( projectPath, '.coverage' );
			const { reporter, results } = await codeCoverage( projectPath, fixture );
			const consoleStub = stub( process.stdout, 'write' );

			reporter( results );

			consoleStub.restore();
			expect( exists( coveragePath ) ).to.equal( true );
		} );

		it( 'displays info inside the console', async () => {
			const { reporter, results } = await codeCoverage( projectPath, fixture );
			const consoleStub = stub( process.stdout, 'write' );

			reporter( results );

			consoleStub.restore();
			expect( consoleStub ).to.have.been.called;
		} );
	} );
} );
