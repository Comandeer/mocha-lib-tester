/* istanbul ignore file */
import linter from './linter.js';
import tester from './tester.js';
import codeCoverage from './codeCoverage.js';
import codecov from './codecov.js';
import Runner from './Runner.js';
import Logger from './Logger.js';

async function mlt() {
	const projectPath = process.cwd();
	const steps = [
		{
			name: 'Linter',
			run() {
				return linter( projectPath );
			}
		},

		{
			name: 'Tester',
			run() {
				return tester( projectPath );
			}
		},

		{
			name: 'Code Coverage',
			run() {
				return codeCoverage( projectPath, global.__mltCoverage__ );
			}
		},

		{
			name: 'CodeCov',
			run() {
				return codecov( projectPath );
			}
		}
	];
	const runner = new Runner();

	new Logger( runner );
	runner.addSteps( steps );

	const result = await runner.run();
	const exitCode = result ? 0 : 1;

	return exitCode;
}

export default mlt;
