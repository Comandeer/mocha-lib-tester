import { resolve as resolvePath } from 'path';
import { createInstrumenter } from 'istanbul-lib-instrument';
import { addHook } from 'pirates';

function addIstanbulHook( projectPath ) {
	const srcPath = resolvePath( projectPath, 'src' );
	const instrumenter = createInstrumenter( {
		coverageVariable: '__mltCoverage__'
	} );

	addHook(
		( code, fileName ) => {
			return instrumenter.instrumentSync( code, fileName );
		},

		{
			exts: [ '.js' ],
			matcher( path ) {
				return path.startsWith( srcPath );
			}
		}
	);
}

export default addIstanbulHook;
