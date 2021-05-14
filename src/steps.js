/* istanbul ignore file */

import linter from './linter.js';
import tester from './tester.js';
import codeCoverage from './codeCoverage.js';
import codecov from './codecov.js';

const steps = [
	{
		id: 'lint',
		name: 'Linter',
		watchable: true,
		run( projectPath ) {
			return linter( projectPath );
		}
	},

	{
		id: 'test',
		name: 'Tester',
		watchable: true,
		run( projectPath ) {
			return tester( projectPath );
		}
	},

	{
		id: 'coverage',
		name: 'Code Coverage',
		watchable: true,
		run( projectPath ) {
			return codeCoverage( projectPath, global.__mltCoverage__ );
		}
	},

	{
		id: 'codecov',
		name: 'CodeCov',
		watchable: false,
		run( projectPath ) {
			return codecov( projectPath );
		}
	}
];

export default steps;
