import { resolve as resolvePath } from 'path';
import { addHook } from 'pirates';
const chaiPreamble = 'import{expect}from"chai";import{use as chaiUse}from"chai";import sinon from"sinon";import chaiAsPromised from"chai-as-promised";import sinonChai from"sinon-chai";import{noCallThru as pqNoCallThru}from"proxyquire";chaiUse(chaiAsPromised),chaiUse(sinonChai);const proxyquire=pqNoCallThru();';
const added = new Set();

function addChaiHook( projectPath ) {
	if ( added.has( projectPath ) ) {
		return;
	}

	const testsPath = resolvePath( projectPath, 'tests' );
	const fixturesPath = resolvePath( testsPath, 'fixtures' );
	addHook( ( code ) => {
		if ( code.startsWith( chaiPreamble ) ) {
			return code;
		}

		return `${chaiPreamble}${code}`;
	}, {
		exts: [ '.js' ],

		matcher( path ) {
			return path.startsWith( testsPath ) && !path.startsWith( fixturesPath );
		}

	} );
	added.add( projectPath );
}

export default addChaiHook;
