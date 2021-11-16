import { join as joinPath } from 'path';
import assertAsyncParameter from './helpers/assertAsyncParameter.js';
import validateResults from './helpers/validateResults.js';
import tester from '../src/tester.js';

const emptyFixture = joinPath( __dirname, 'fixtures', 'emptyPackage' );

// When dogfooding, the original value of global.__mltCoverage__ is connected with
// the MLT itself. This juggling probably breaks the coverage report…
const mainCoverage = global.__mltCoverage__;

describe( 'tester', () => {
	let sinonSandbox;

	beforeEach( () => {
		sinonSandbox = sinon.createSandbox();

		delete global.__mltCoverage__;
	} );

	after( () => {
		sinonSandbox.restore();

		global.__mltCoverage__ = mainCoverage;
	} );

	it( 'is a function', () => {
		expect( tester ).to.be.a( 'function' );
	} );

	it( 'expects path as a first parameter', () => {
		return assertAsyncParameter( {
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
				return tester( param );
			}
		} );
	} );

	it( 'returns Promise, which resolves to correct results object', async () => {
		const promise = tester( emptyFixture );

		expect( promise ).to.be.instanceOf( Promise );

		const results = await promise;

		validateResults( results );
	} );

	it( 'does not output anything', async () => {
		const consoleSpy = sinonSandbox.spy( process.stdout, 'write' );

		await tester( emptyFixture );

		expect( consoleSpy ).not.to.be.called;
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

	it( 'run tests in correct files', async () => {
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

		const { results, ok } = await tester( fixturePath );

		expect( ok ).to.equal( false );

		const resultsWithoutOutput = { ...results };
		delete resultsWithoutOutput._output;

		expect( resultsWithoutOutput ).to.deep.equal( expected );
	} );

	it( 'passes for empty package', async () => {
		const { ok } = await tester( emptyFixture );

		expect( ok ).to.equal( true );
	} );
} );
