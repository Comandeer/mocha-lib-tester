/* globals expect */

import { resolve as resolvePath } from 'path';
import executeCLI from './helpers/executeCLI.js';

describe( 'mlt', () => {
	it( 'executes tests in provided CWD and dumps results into stdout (ESM)', async () => {
		const esmProject = resolvePath( __dirname, 'fixtures', 'testsPackageESM' );
		const { exitCode, stdout, stderr } = await executeCLI( esmProject );

		expect( stdout ).to.match( /---Linter---/, 'linter step is visible in the output' );
		expect( stdout ).to.match( /---Tester---/, 'tester step is visible in the output' );
		expect( stdout ).not.to.match( /---Code Coverage---/, 'code coverage step is not visible in the output' );

		expect( stderr ).to.match( /tester step/, 'stderr shows that the tester step failed' );

		expect( exitCode ).to.equal( 1 );
	} );

	it( 'executes tests in provided CWD and dumps results into stdout (CJS)', async () => {
		const cjsProject = resolvePath( __dirname, 'fixtures', 'testsPackageCJS' );
		const { exitCode, stdout, stderr } = await executeCLI( cjsProject );

		expect( stdout ).to.match( /---Linter---/, 'linter step is visible in the output' );
		expect( stdout ).not.to.match( /---Tester---/, 'tester step is not visible in the output' );
		expect( stdout ).not.to.match( /---Code Coverage---/, 'code coverage step is not visible in the output' );

		expect( stderr ).to.match( /linter step/, 'stderr shows that the linter step failed' );
		expect( exitCode ).to.equal( 1 );
	} );

	it( 'executes tests in provided CWD and dumps results into stdout (valid ESM)', async () => {
		const validProject = resolvePath( __dirname, 'fixtures', 'testsPackageValid' );
		const { exitCode, stdout, stderr } = await executeCLI( validProject );

		expect( stdout ).to.match( /---Linter---/, 'linter step is visible in the output' );
		expect( stdout ).to.match( /---Tester---/, 'tester step is visible in the output' );
		expect( stdout ).to.match( /---Code Coverage---/, 'code coverage step is visible in the output' );

		expect( stderr ).to.equal( '', 'stderr is empty' );

		expect( exitCode ).to.equal( 0 );
	} );
} );
