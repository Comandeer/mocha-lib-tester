import { resolve as resolvePath } from 'path';
import assertAsyncParameter from './helpers/assertAsyncParameter.js';
import validateResults from './helpers/validateResults.js';
import linter from '../src/linter.js';

const lintFixture = resolvePath( __dirname, 'fixtures', 'lintPackage' );
const noErrorsFixture = resolvePath( __dirname, 'fixtures', 'lintCorrectPackage' );

describe( 'linter', () => {
	let sinonSandbox;

	beforeEach( () => {
		sinonSandbox = sinon.createSandbox();
	} );

	afterEach( () => {
		sinonSandbox.restore();
	} );

	it( 'is a function', () => {
		expect( linter ).to.be.a( 'function' );
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
				return linter( param );
			}
		} );
	} );

	it( 'does not throw due to nonexistent files', () => {
		return expect( linter( lintFixture ) ).not.to.be.
			rejectedWith( Error, 'No files matching \'bin/**/*\' were found.' );
	} );

	it( 'does not output anything', async () => {
		const consoleSpy = sinonSandbox.spy( console, 'log' );

		await linter( lintFixture );

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
			[ resolvePath( lintFixture, 'src', 'empty.js' ) ]: 0,
			[ resolvePath( lintFixture, 'src', 'index.js' ) ]: 1,
			[ resolvePath( lintFixture, 'tests', 'index.js' ) ]: 1,
			[ resolvePath( lintFixture, 'tests', 'something', 'subtest.js' ) ]: 0
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
