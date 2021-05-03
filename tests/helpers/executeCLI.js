import { exec } from 'child_process';
import { resolve as resolvePath } from 'path';

const mlt = resolvePath( __dirname, '..', '..', 'bin', 'mlt' );

function executeCLI( projectPath, {
	additionalArguments = ''
} = {} ) {
	return new Promise( ( resolve ) => {
		if ( additionalArguments ) {
			additionalArguments = ` ${ additionalArguments }`;
		}

		const mltProcess = exec( `node ${ mlt }${ additionalArguments }`, {
			cwd: projectPath,
			env: Object.assign( {}, process.env, {
				// We don't want any garbage in codecov reports.
				NO_CODECOV: true
			} )
		}, ( error, stdout, stderr ) => {
			resolve( {
				exitCode: mltProcess.exitCode,
				stdout,
				stderr
			} );
		} );
	} );
}

export default executeCLI;
