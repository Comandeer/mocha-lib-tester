import { exec } from 'child_process';
import { resolve as resolvePath } from 'path';

const mlt = resolvePath( __dirname, '..', '..', 'bin', 'mlt' );

function executeCLI( projectPath ) {
	return new Promise( ( resolve ) => {
		const mltProcess = exec( `node ${ mlt }`, {
			cwd: projectPath
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
