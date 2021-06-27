import { resolve as resolvePath } from 'path';
import touch from 'touch';
import executeCLI from './helpers/executeCLI.js';
import { cleanupFixtures, prepareCLIFixture } from './helpers/fixtures.js';
import spawnCLI from './helpers/spawnCLI.js';

describe( 'mlt', () => {
	afterEach( cleanupFixtures );

	it( 'executes tests in provided CWD and dumps results into stdout (ESM)', async () => {
		const esmProject = await prepareCLIFixture( 'testsPackageESM' );
		const { exitCode, stdout, stderr } = await executeCLI( esmProject );

		expect( stdout ).to.match( /---Linter---/, 'linter step is visible in the output' );
		expect( stdout ).to.match( /---Tester---/, 'tester step is visible in the output' );
		expect( stdout ).not.to.match( /---Code Coverage---/, 'code coverage step is not visible in the output' );
		expect( stdout ).not.to.match( /---CodeCov---/, 'codecov step is not visible in the output' );

		expect( stderr ).to.match( /Step Tester/, 'stderr shows that the tester step failed' );

		expect( exitCode ).to.equal( 1 );
	} );

	it( 'executes tests in provided CWD and dumps results into stdout (CJS)', async () => {
		const cjsProject = await prepareCLIFixture( 'testsPackageCJS' );
		const { exitCode, stdout, stderr } = await executeCLI( cjsProject );

		expect( stdout ).to.match( /---Linter---/, 'linter step is visible in the output' );
		expect( stdout ).not.to.match( /---Tester---/, 'tester step is not visible in the output' );
		expect( stdout ).not.to.match( /---Code Coverage---/, 'code coverage step is not visible in the output' );
		expect( stdout ).not.to.match( /---CodeCov---/, 'codecov step is not visible in the output' );

		expect( stderr ).to.match( /Step Linter/, 'stderr shows that the linter step failed' );
		expect( exitCode ).to.equal( 1 );
	} );

	it( 'executes tests in provided CWD and dumps results into stdout (valid ESM)', async () => {
		const validProject = await prepareCLIFixture( 'testsPackageValid' );
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
		const validProject = await prepareCLIFixture( 'testsPackageValid' );
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
		const validProject = await prepareCLIFixture( 'testsPackageValid' );
		const { exitCode, stdout, stderr } = await executeCLI( validProject, {
			additionalArguments: 'test lint '
		} );

		expect( stdout ).to.match( /---Tester---.+?---Linter---/s, 'order is preserved in output' );

		expect( stderr ).to.equal( '', 'stderr is empty' );

		expect( exitCode ).to.equal( 0 );
	} );

	// #65
	it( 'throws an error if non-existent step id is provided', async () => {
		const validProject = await prepareCLIFixture( 'testsPackageValid' );
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

	// #57
	describe( '--watch', () => {
		const DELAYED_CALLBACK_TIMEOUT = 5000;
		const SHORT_KILL_TIMEOUT = 5000;
		const LONG_KILL_TIMEOUT = 20000;

		it( 'does not terminate after full run', async () => {
			const validProject = await prepareCLIFixture( 'testsPackageValid' );
			const { exitCode } = await spawnCLI( validProject, {
				args: [ '--watch' ],
				killAfter: SHORT_KILL_TIMEOUT
			} );

			// If process is killed, then it does not return exit code.
			expect( exitCode ).to.equal( null );
		} );

		it( 'runs all steps except CodeCov', async () => {
			const validProject = await prepareCLIFixture( 'testsPackageValid' );
			const { stdout, stderr, exitCode } = await spawnCLI( validProject, {
				args: [ '--watch' ],
				killAfter: SHORT_KILL_TIMEOUT
			} );

			expect( stdout ).to.match( /---Linter---/, 'linter step is visible in the output' );
			expect( stdout ).to.match( /---Tester---/, 'tester step is visible in the output' );
			expect( stdout ).to.match( /---Code Coverage---/, 'code coverage step is visible in the output' );
			expect( stdout ).not.to.match( /---CodeCov---/, 'codecov step is not visible in the output' );

			expect( stderr ).to.equal( '', 'stderr is empty' );

			// If process is killed, then it does not return exit code.
			expect( exitCode ).to.equal( null );
		} );

		it( 'skips subsequent steps when something fails but without process termination', async () => {
			const validProject = await prepareCLIFixture( 'testsPackageESM' );
			const { stdout, stderr, exitCode } = await spawnCLI( validProject, {
				args: [ '--watch' ],
				killAfter: SHORT_KILL_TIMEOUT
			} );

			expect( stdout ).to.match( /---Linter---/, 'linter step is visible in the output' );
			expect( stdout ).to.match( /---Tester---/, 'tester step is visible in the output' );
			expect( stdout ).not.to.match( /---Code Coverage---/, 'code coverage step is not visible in the output' );
			expect( stdout ).not.to.match( /---CodeCov---/, 'codecov step is not visible in the output' );

			expect( stderr ).to.match( /Step Tester/, 'stderr shows that the tester step failed' );

			// If process is killed, then it does not return exit code.
			expect( exitCode ).to.equal( null );
		} );

		it( 'reruns all steps except CodeCov if .js file is modified in the project src', async () => {
			const validProject = await prepareCLIFixture( 'testsPackageValid' );
			const touchablePath = resolvePath( validProject, 'src', 'index.js' );
			const { stdout, stderr, exitCode } = await spawnCLI( validProject, {
				args: [ '--watch' ],
				killAfter: LONG_KILL_TIMEOUT,
				delayedCallback: {
					callback() {
						touch( touchablePath, {
							force: true
						} );
					},
					timeout: DELAYED_CALLBACK_TIMEOUT
				}
			} );

			// This monster uses negative lookbehinds and negative lookaheads to ensure that
			// MLT preamble is displayed only once, not on every rerun.
			expect( stdout ).to.match( /(?<!MLT v\d+\.\d+\.\d+.*?)MLT v\d+\.\d+\.\d+(?!.*?MLT v\d+\.\d+\.\d+)/s, 'MLT preamble is displayed only once' );
			expect( stdout ).to.match( /---Linter---.+?---Linter---/s, 'linter step is visible twice in the output' );
			expect( stdout ).to.match( /---Tester---.+?---Tester---/s, 'tester step is visible twice in the output' );
			expect( stdout ).to.match( /---Code Coverage---.+?---Code Coverage---/s, 'code coverage step is visible twice in the output' );
			expect( stdout ).not.to.match( /---CodeCov---/, 'codecov step is not visible in the output' );

			expect( stderr ).to.equal( '', 'stderr is empty' );

			// If process is killed, then it does not return exit code.
			expect( exitCode ).to.equal( null );
		} );

		it( 'reruns all steps except CodeCov if .js file is modified in the project tests', async () => {
			const validProject = await prepareCLIFixture( 'testsPackageValid' );
			const touchablePath = resolvePath( validProject, 'tests', 'index.js' );
			const { stdout, stderr, exitCode } = await spawnCLI( validProject, {
				args: [ '--watch' ],
				killAfter: LONG_KILL_TIMEOUT,
				delayedCallback: {
					callback() {
						touch( touchablePath, {
							force: true
						} );
					},
					timeout: DELAYED_CALLBACK_TIMEOUT
				}
			} );

			// This monster uses negative lookbehinds and negative lookaheads to ensure that
			// MLT preamble is displayed only once, not on every rerun.
			expect( stdout ).to.match( /(?<!MLT v\d+\.\d+\.\d+.*?)MLT v\d+\.\d+\.\d+(?!.*?MLT v\d+\.\d+\.\d+)/s, 'MLT preamble is displayed only once' );
			expect( stdout ).to.match( /---Linter---.+?---Linter---/s, 'linter step is visible twice in the output' );
			expect( stdout ).to.match( /---Tester---.+?---Tester---/s, 'tester step is visible twice in the output' );
			expect( stdout ).to.match( /---Code Coverage---.+?---Code Coverage---/s, 'code coverage step is visible twice in the output' );
			expect( stdout ).not.to.match( /---CodeCov---/, 'codecov step is not visible in the output' );

			expect( stderr ).to.equal( '', 'stderr is empty' );

			// If process is killed, then it does not return exit code.
			expect( exitCode ).to.equal( null );
		} );

		it( 'reruns only requested steps if .js file is modified in the project', async () => {
			const validProject = await prepareCLIFixture( 'testsPackageValid' );
			const touchablePath = resolvePath( validProject, 'tests', 'index.js' );
			const { stdout, stderr, exitCode } = await spawnCLI( validProject, {
				args: [ 'lint', '--watch' ],
				killAfter: LONG_KILL_TIMEOUT,
				delayedCallback: {
					callback() {
						touch( touchablePath, {
							force: true
						} );
					},
					timeout: DELAYED_CALLBACK_TIMEOUT
				}
			} );

			// This monster uses negative lookbehinds and negative lookaheads to ensure that
			// MLT preamble is displayed only once, not on every rerun.
			expect( stdout ).to.match( /(?<!MLT v\d+\.\d+\.\d+.*?)MLT v\d+\.\d+\.\d+(?!.*?MLT v\d+\.\d+\.\d+)/s, 'MLT preamble is displayed only once' );
			expect( stdout ).to.match( /---Linter---.+?---Linter---/s, 'linter step is visible twice in the output' );
			expect( stdout ).not.to.match( /---Tester---/s, 'tester step is not visible in the output' );
			expect( stdout ).not.to.match( /---Code Coverage---/s, 'code coverage step is not visible in the output' );
			expect( stdout ).not.to.match( /---CodeCov---/, 'codecov step is not visible in the output' );

			expect( stderr ).to.equal( '', 'stderr is empty' );

			// If process is killed, then it does not return exit code.
			expect( exitCode ).to.equal( null );
		} );
	} );
} );
