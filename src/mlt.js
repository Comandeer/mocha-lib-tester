/* istanbul ignore file */
import linter from './linter.js';
import tester from './tester.js';
import codeCoverage from './codeCoverage.js';
import codecov from './codecov.js';
import Runner from './Runner.js';
import Logger from './Logger.js';

async function mlt( steps = [ 'lint', 'test', 'coverage', 'codecov' ] ) {
	const projectPath = process.cwd();
	const defaultSteps = [
		{
			id: 'lint',
			name: 'Linter',
			run() {
				return linter( projectPath );
			}
		},

		{
			id: 'test',
			name: 'Tester',
			run() {
				return tester( projectPath );
			}
		},

		{
			id: 'coverage',
			name: 'Code Coverage',
			run() {
				return codeCoverage( projectPath, global.__mltCoverage__ );
			}
		},

		{
			id: 'codecov',
			name: 'CodeCov',
			run() {
				return codecov( projectPath );
			}
		}
	];
	const filteredSteps = steps.map( ( id ) => {
		const step = defaultSteps.find( ( { id: stepId} ) => {
			return stepId === id;
		} );

		return step || id;
	} );
	const invalidSteps = filteredSteps.filter( ( step ) => {
		return typeof step === 'string';
	} );

	if ( invalidSteps.length > 0 ) {
		const stepNames = invalidSteps.map( ( step ) => {
			return `"${ step }"`;
		} ).join( ', ' );

		throw new TypeError( `Provided step names (${ stepNames }) are incorrect` );
	}

	const runner = new Runner();

	new Logger( runner );
	runner.addSteps( filteredSteps );

	const result = await runner.run();
	const exitCode = result ? 0 : 1;

	return exitCode;
}

export default mlt;
