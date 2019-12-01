/* eslint-disable no-console */

import { format } from 'util';
import { reporters } from 'mocha';

const { Base, Spec } = reporters;

class MochaReporter extends Spec {
	constructor( runner ) {
		const output = [];
		const results = {};
		let ok = true;
		const originalConsoleLog = Base.consoleLog;

		Base.consoleLog = function( ...args ) {
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
			Base.consoleLog = originalConsoleLog;

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
