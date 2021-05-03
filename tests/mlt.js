import { resolve as resolvePath } from 'path';
import executeCLI from './helpers/executeCLI.js';

describe( 'mlt', () => {
	it( 'executes tests in provided CWD and dumps results into stdout (ESM)', async () => {
		const esmProject = resolvePath( __dirname, 'fixtures', 'testsPackageESM' );
		const { exitCode, stdout, stderr } = await executeCLI( esmProject );

		expect( stdout ).to.match( /---Linter---/, 'linter step is visible in the output' );
		expect( stdout ).to.match( /---Tester---/, 'tester step is visible in the output' );
		expect( stdout ).not.to.match( /---Code Coverage---/, 'code coverage step is not visible in the output' );
		expect( stdout ).not.to.match( /---CodeCov---/, 'codecov step is not visible in the output' );

		expect( stderr ).to.match( /Step Tester/, 'stderr shows that the tester step failed' );

		expect( exitCode ).to.equal( 1 );
	} );

	it( 'executes tests in provided CWD and dumps results into stdout (CJS)', async () => {
		const cjsProject = resolvePath( __dirname, 'fixtures', 'testsPackageCJS' );
		const { exitCode, stdout, stderr } = await executeCLI( cjsProject );

		expect( stdout ).to.match( /---Linter---/, 'linter step is visible in the output' );
		expect( stdout ).not.to.match( /---Tester---/, 'tester step is not visible in the output' );
		expect( stdout ).not.to.match( /---Code Coverage---/, 'code coverage step is not visible in the output' );
		expect( stdout ).not.to.match( /---CodeCov---/, 'codecov step is not visible in the output' );

		expect( stderr ).to.match( /Step Linter/, 'stderr shows that the linter step failed' );
		expect( exitCode ).to.equal( 1 );
	} );

	it( 'executes tests in provided CWD and dumps results into stdout (valid ESM)', async () => {
		const validProject = resolvePath( __dirname, 'fixtures', 'testsPackageValid' );
		const { exitCode, stdout, stderr } = await executeCLI( validProject );

		expect( stdout ).to.match( /---Linter---/, 'linter step is visible in the output' );
		expect( stdout ).to.match( /---Tester---/, 'tester step is visible in the output' );
		expect( stdout ).to.match( /---Code Coverage---/, 'code coverage step is visible in the output' );
		expect( stdout ).to.match( /---CodeCov---/, 'codecov step is visible in the output' );

		expect( stderr ).to.equal( '', 'stderr is empty' );

		expect( exitCode ).to.equal( 0 );
	} );

	// #65
	it( 'executes only provided steps', async () => {
		const validProject = resolvePath( __dirname, 'fixtures', 'testsPackageValid' );
		const { exitCode, stdout, stderr } = await executeCLI( validProject, {
			additionalArguments: 'lint test'
		} );

		expect( stdout ).to.match( /---Linter---/, 'linter step is visible in the output' );
		expect( stdout ).to.match( /---Tester---/, 'tester step is visible in the output' );
		expect( stdout ).not.to.match( /---Code Coverage---/, 'code coverage step is not visible in the output' );
		expect( stdout ).not.to.match( /---CodeCov---/, 'codecov step is not visible in the output' );

		expect( stderr ).to.equal( '', 'stderr is empty' );

		expect( exitCode ).to.equal( 0 );
	} );

	// #65
	it( 'preserves the order of requested steps', async () => {
		const validProject = resolvePath( __dirname, 'fixtures', 'testsPackageValid' );
		const { exitCode, stdout, stderr } = await executeCLI( validProject, {
			additionalArguments: 'test lint '
		} );

		expect( stdout ).to.match( /---Tester---.+?---Linter---/s, 'order is preserved in output' );

		expect( stderr ).to.equal( '', 'stderr is empty' );

		expect( exitCode ).to.equal( 0 );
	} );

	// #65
	it( 'throws an error if non-existent step id is provided', async () => {
		const validProject = resolvePath( __dirname, 'fixtures', 'testsPackageValid' );
		const { exitCode, stdout, stderr } = await executeCLI( validProject, {
			additionalArguments: 'hublabubla lint whatever'
		} );

		expect( stdout ).not.to.match( /---Linter---/, 'linter step is not visible in the output' );
		expect( stdout ).not.to.match( /---Tester---/, 'tester step is not visible in the output' );
		expect( stdout ).not.to.match( /---Code Coverage---/, 'code coverage step is not visible in the output' );
		expect( stdout ).not.to.match( /---CodeCov---/, 'codecov step is not visible in the output' );

		expect( stderr ).to.match( /Provided step names \("hublabubla", "whatever"\) are incorrect/, 'stderr is empty' );

		expect( exitCode ).to.equal( 1 );
	} );
} );
