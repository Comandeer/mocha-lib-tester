import { join as joinPath } from 'path';
import { expect } from 'chai';
import { use } from 'chai';
import { spy } from 'sinon';
import sinonChai from 'sinon-chai';
import validateResults from './helpers/validateResults.js';
import tester from '../src/tester.js';

use( sinonChai );

const emptyFixture = joinPath( __dirname, 'fixtures', 'emptyPackage' );

describe( 'tester', () => {
	beforeEach( () => {
		// Mocha uses require cache to not load tests twice. To reuse fixtures we must empty the cache.
		Object.keys( require.cache ).forEach( ( key ) => {
			if ( key.startsWith( joinPath( __dirname, 'fixtures' ) ) ) {
				delete require.cache[ key ];
			}
		} );

		delete global.__mltCoverage__;
	} );

	it( 'is a function', () => {
		expect( tester ).to.be.a( 'function' );
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
				tester( value );
			} ).to.throw( TypeError, 'Provided path must be a non-empty string' );
		} );

		expect( () => {
			tester( '.' );
		} ).not.to.throw( TypeError, 'Provided path must be a non-empty string' );
	} );

	it( 'returns Promise, which resolves to correct results object', () => {
		const promise = tester( emptyFixture );

		expect( promise ).to.be.instanceOf( Promise );

		return promise.then( ( results ) => {
			validateResults( results );
		} );
	} );

	it( 'does not output anything', () => {
		const consoleSpy = spy( process.stdout, 'write' );

		return tester( emptyFixture ).then( () => {
			consoleSpy.restore();

			expect( consoleSpy ).not.to.be.called;
		} );
	} );

	it( 'supports CJS syntax', () => {
		const fixturePath = joinPath( __dirname, 'fixtures', 'testsPackageCJS' );

		// Mocha automatically fails the test when Promise rejects, so it's enough to just
		// return it.
		return tester( fixturePath );
	} );

	it( 'supports ESM syntax', () => {
		const fixturePath = joinPath( __dirname, 'fixtures', 'testsPackageESM' );

		// Mocha automatically fails the test when Promise rejects, so it's enough to just
		// return it.
		return tester( fixturePath );
	} );

	it( 'correctly exposes chai and other testing libraries', async () => {
		const fixturePath = joinPath( __dirname, 'fixtures', 'testsChai' );

		const { ok } = await tester( fixturePath );

		expect( ok ).to.equal( true );
	} );

	it( 'gathers info about code coverage', async () => {
		const fixturePath = joinPath( __dirname, 'fixtures', 'testsPackageESM' );

		await tester( fixturePath );

		expect( global.__mltCoverage__ ).not.to.be.undefined;
	} );

	it( 'run tests in correct files', () => {
		const fixturePath = joinPath( __dirname, 'fixtures', 'testsPackageCJS' );
		const expected = {
			[ joinPath( fixturePath, 'tests', 'index.js' ) ]: {
				'passes': 'passed',
				'fails': 'failed'
			},
			[ joinPath( fixturePath, 'tests', 'something', 'subtest.js' ) ]: {
				'passes': 'passed',
				'fails': 'failed'
			}
		};

		return tester( fixturePath ).then( ( { results, ok } ) => {
			expect( ok ).to.equal( false );
			expect( results ).to.deep.equal( expected );
		} );
	} );

	it( 'passes for empty package', () => {
		return tester( emptyFixture ).then( ( { ok } ) => {
			expect( ok ).to.equal( true );
		} );
	} );
} );
