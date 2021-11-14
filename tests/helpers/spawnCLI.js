import { resolve as resolvePath } from 'path';
import spawn from 'cross-spawn';

const mlt = resolvePath( __dirname, '..', '..', 'bin', 'mlt' );

function spawnCLI( projectPath, {
	args = [],
	delayedCallback = {},
	killAfter = null
} = {} ) {
	return new Promise( ( resolve, reject ) => {
		let stdout = '';
		let stderr = '';
		let delayedCallbackPromise;
		const mltProcess = spawn( mlt, args, {
			cwd: projectPath,
			env: Object.assign( {}, process.env, {
				// We don't want any garbage in codecov reports.
				NO_CODECOV: true
			} )
		} );

		mltProcess.on( 'error', reject );

		mltProcess.stdout.on( 'data', ( data ) => {
			stdout += data;
		} );

		mltProcess.stderr.on( 'data', ( data ) => {
			stderr += data;
		} );

		mltProcess.on( 'exit', ( code ) => {
			resolve( {
				stdout,
				stderr,
				exitCode: code
			} );
		} );

		if ( delayedCallback.callback ) {
			setTimeout( () => {
				delayedCallbackPromise = delayedCallback.callback( mltProcess );
			}, delayedCallback.timeout || 0 );
		}

		if ( typeof killAfter === 'number' ) {
			setTimeout( async () => {
				if ( delayedCallbackPromise ) {
					await delayedCallbackPromise;

					mltProcess.kill( 'SIGINT' );
				}

				mltProcess.kill( 'SIGINT' );
			}, killAfter );
		}
	} );
}

export default spawnCLI;
