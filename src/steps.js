/* istanbul ignore file */

import { spawn } from 'threads';
import { Thread } from 'threads';
import { Worker } from 'threads';
import linterReporter from './reporters/linter';
import codeCoverageReporter from './reporters/codeCoverage';
import codeCoverage from './codeCoverage.js';
import codecov from './codecov.js';

const steps = [
	{
		id: 'lint',
		name: 'Linter',
		watchable: true,
		run( projectPath ) {
			return spawnWorker( './workers/linter.js', projectPath );
		},
		report: linterReporter
	},

	{
		id: 'test',
		name: 'Tester',
		watchable: true,
		run( projectPath ) {
			return spawnWorker( './workers/tester.js', projectPath );
		},
		report( { output }, logger ) {
			logger.log( output );
		}
	},

	{
		id: 'coverage',
		name: 'Code Coverage',
		watchable: true,
		requires: [
			'test'
		],
		run( projectPath, { test: { coverage } } ) {
			return codeCoverage( projectPath, coverage );
		},
		report: codeCoverageReporter
	},

	{
		id: 'codecov',
		name: 'CodeCov',
		watchable: false,
		run( projectPath ) {
			return codecov( projectPath );
		},
		report() {}
	}
];

async function spawnWorker( workerPath, ...workerArgs ) {
	const worker = new Worker( workerPath );
	const workerAPI = await spawn( worker );
	const result = await workerAPI( ...workerArgs );

	await Thread.terminate( workerAPI );

	return result;
}

export default steps;
