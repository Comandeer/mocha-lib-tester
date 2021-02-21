import { join as joinPath } from 'path';
import assertParameter from './helpers/assertParameter.js';
import validateResults from './helpers/validateResults.js';
import tester from '../src/tester.js';

const { spy } = sinon;

const emptyFixture = joinPath( __dirname, 'fixtures', 'emptyPackage' );

// When dogfooding, the original value of global.__mltCoverage__ is connected with
// the MLT itself. This juggling probably breaks the coverage report…
const mainCoverage = global.__mltCoverage__;

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

	after( () => {
		global.__mltCoverage__ = mainCoverage;
	} );

	it( 'is a function', () => {
		expect( tester ).to.be.a( 'function' );
	} );

	it( 'expects path as a first parameter', () => {
		assertParameter( {
			invalids: [
				undefined,
				null,
				1,
				{},
				[],
				''
			],
			valids: [
				'.'
			],
			error: {
				type: TypeError,
				message: 'Provided path must be a non-empty string'
			},
			code( param ) {
				tester( param );
			}
		} );
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
