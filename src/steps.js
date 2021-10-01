/* istanbul ignore file */

import { spawn } from 'threads';
import { Thread } from 'threads';
import { Worker } from 'threads';
import tester from './tester.js';
import codeCoverage from './codeCoverage.js';
import codecov from './codecov.js';

const steps = [
	{
		id: 'lint',
		name: 'Linter',
		watchable: true,
		run( projectPath ) {
			return spawnWorker( './workers/linter.js', projectPath );
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

async function spawnWorker( workerPath, ...workerArgs ) {
	const worker = new Worker( workerPath );
	const workerAPI = await spawn( worker );
	const result = await workerAPI( ...workerArgs );

	await Thread.terminate( workerAPI );

	return result;
}

export default steps;
