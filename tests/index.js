import * as pkg from '../src/index.js';

describe( 'index', () => {
	it( 'exports a function', () => {
		const expectedExports = [
			'mlt',
			'linter',
			'tester'
		];
		const actualExports = Object.keys( pkg );

		expect( actualExports ).to.deep.equal( expectedExports );
	} );
} );
