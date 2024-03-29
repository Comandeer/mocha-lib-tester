import { createCoverageMap } from 'istanbul-lib-coverage';

async function codeCoverage( projectPath, data ) {
	if ( typeof projectPath !== 'string' || projectPath.length === 0 ) {
		throw new TypeError( 'Provided path must be a non-empty string' );
	}

	if ( !data || typeof data !== 'object' || Array.isArray( data ) ) {
		throw new TypeError( 'Provided code coverage data must be an object' );
	}

	const coverageMap = createCoverageMap( data );

	return {
		name: 'code coverage',
		ok: true,
		results: coverageMap
	};
}

export default codeCoverage;
