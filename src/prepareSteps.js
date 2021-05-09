import linter from './linter.js';
import tester from './tester.js';
import codeCoverage from './codeCoverage.js';
import codecov from './codecov.js';

function prepareSteps( projectPath, {
	requestedSteps,
	isWatch = false
} = {} ) {
	const defaultSteps = [
		{
			id: 'lint',
			name: 'Linter',
			watchable: true,
			run() {
				return linter( projectPath );
			}
		},

		{
			id: 'test',
			name: 'Tester',
			watchable: true,
			run() {
				return tester( projectPath );
			}
		},

		{
			id: 'coverage',
			name: 'Code Coverage',
			watchable: true,
			run() {
				return codeCoverage( projectPath, global.__mltCoverage__ );
			}
		},

		{
			id: 'codecov',
			name: 'CodeCov',
			watchable: false,
			run() {
				return codecov( projectPath );
			}
		}
	];
	const filteredSteps = requestedSteps.map( ( id ) => {
		const step = defaultSteps.find( ( step ) => {
			return step.id === id;
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

	if ( isWatch ) {
		const watchableSteps = filteredSteps.filter( ( step ) => {
			return step.watchable;
		} );

		return watchableSteps;
	}

	return filteredSteps;
}

export default prepareSteps;
