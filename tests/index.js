import * as pkg from '../src/index.js';

describe( 'index', () => {
	it( 'exports all steps + mlt', () => {
		const expectedExports = [
			'mlt',
			'linter',
			'tester',
			'codeCoverage',
			'codecov'
		];
		const actualExports = Object.keys( pkg );

		expect( actualExports ).to.have.members( expectedExports );
	} );
} );
