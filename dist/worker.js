const { parentPort, workerData } = require( 'worker_threads' );
const { linter } = require( './mocha-lib-tester.js' );

( async function() {
	const projectPath = workerData;
	const results = await linter( projectPath );

	parentPort.postMessage( results );
}() );
