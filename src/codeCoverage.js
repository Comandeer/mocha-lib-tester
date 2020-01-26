import { createCoverageMap } from 'istanbul-lib-coverage';
import codeCoverageReporter from './reporters/codeCoverage.js';

function codeCoverage( projectPath, data ) {
	if ( typeof projectPath !== 'string' || projectPath.length === 0 ) {
		throw new TypeError( 'Provided path must be a non-empty string' );
	}

	if ( !data || typeof data !== 'object' || Array.isArray( data ) ) {
		throw new TypeError( 'Provided code coverage data must be an object' );
	}

	const coverageMap = createCoverageMap( data );

	return Promise.resolve( {
		name: 'code coverage',
		ok: true,
		results: {},
		reporter: codeCoverageReporter( coverageMap, projectPath )
	} );
}

export default codeCoverage;
