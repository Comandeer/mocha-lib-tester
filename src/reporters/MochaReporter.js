/* eslint-disable no-console */

import { format } from 'util';
import { reporters } from 'mocha';

class MochaReporter extends reporters.Spec {
	constructor( runner ) {
		const output = [];
		const results = {};
		let ok = true;
		const originalConsoleLog = console.log;

		console.log = function( ...args ) {
			output.push( format( ...args ) );
		};

		super( runner );

		runner.on( 'test end', ( { file, state, title } ) => {
			if ( typeof results[ file ] === 'undefined' ) {
				results[ file ] = {};
			}

			results[ file ][ title ] = state;
		} );

		runner.once( 'fail', () => {
			ok = false;
		} );

		runner.once( 'end', () => {
			console.log = originalConsoleLog;

			runner.suite.results = {
				results,
				ok,
				reporter() {
					console.log( output.join( '\n' ) );
				}
			};
		} );
	}
}

export default MochaReporter;
