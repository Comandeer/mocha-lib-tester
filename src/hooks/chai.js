import { resolve as resolvePath } from 'path';
import { addHook } from 'pirates';

const chaiPreamble = 'import { expect } from \'chai\';\n';

function addChaiHook( projectPath ) {
	const testsPath = resolvePath( projectPath, 'tests' );
	const fixturesPath = resolvePath( testsPath, 'fixtures' );

	addHook(
		( code ) => {
			return `${ chaiPreamble }${ code }`;
		},

		{
			exts: [ '.js' ],
			matcher( path ) {
				return path.startsWith( testsPath ) && !path.startsWith( fixturesPath );
			}
		}
	);
}

export default addChaiHook;
