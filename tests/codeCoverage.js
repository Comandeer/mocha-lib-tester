import { resolve as resolvePath } from 'path';
import { removeSync as remove, existsSync as exists } from 'fs-extra';
import assertAsyncParameter from './helpers/assertAsyncParameter.js';
import validateResults from './helpers/validateResults.js';
import fixture from './fixtures/coverageData.js';
import codeCoverage from '../src/codeCoverage.js';
import reporter from '../src/reporters/codeCoverage.js';

const { spy } = sinon;

describe( 'codeCoverage', () => {
	it( 'is a function', () => {
		expect( codeCoverage ).to.be.a( 'function' );
	} );

	it( 'expects non-empty string as the first parameter', () => {
		return assertAsyncParameter( {
			invalids: [
				undefined,
				null,
				1,
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
				return codeCoverage( param, {} );
			}
		} );
	} );

	it( 'expects object as the second parameter', () => {
		return assertAsyncParameter( {
			invalids: [
				undefined,
				null,
				1,
				[],
				''
			],
			error: {
				type: TypeError,
				message: 'Provided code coverage data must be an object'
			},
			code( param ) {
				return codeCoverage( '.', param );
			}
		} );
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
		const context = {
			projectPath
		};
		let sandbox;

		beforeEach( () => {
			sandbox = sinon.createSandbox();
		} );

		afterEach( () => {
			const coveragePath = resolvePath( projectPath, '.coverage' );

			remove( coveragePath );

			sandbox.restore();
		} );

		it( 'generate .coverage directory in project path', async () => {
			const coveragePath = resolvePath( projectPath, '.coverage' );
			const results = await codeCoverage( projectPath, fixture );

			// Prevent any logging.
			sandbox.stub( process.stdout, 'write' );

			reporter( results, {}, context );

			expect( exists( coveragePath ) ).to.equal( true );
		} );

		it( 'displays info inside the console', async () => {
			const results = await codeCoverage( projectPath, fixture );
			const consoleStub = sandbox.stub( process.stdout, 'write' );

			reporter( results, {}, context );

			expect( consoleStub ).to.have.been.called;
		} );
	} );
} );
