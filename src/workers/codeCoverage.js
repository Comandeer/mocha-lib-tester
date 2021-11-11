const { expose } = require( 'threads/worker' );

const isBuild = __dirname.endsWith( '/dist/workers' );
const codeCoveragePath = isBuild ? '../mocha-lib-tester.js' : '../index.js';
const { codeCoverage } = require( codeCoveragePath );

expose( ( projectPath, coverage ) => {
	return codeCoverage( projectPath, coverage );
} );
