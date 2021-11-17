/* istanbul ignore file */

import { get } from 'https';
import { exec } from 'child_process';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { resolve as resolvePath } from 'path';
import isCI from 'is-ci';
import npmRunPath from 'npm-run-path';

const streamPipeline = promisify( pipeline );

async function codecov( projectPath ) {
	if ( typeof projectPath !== 'string' || projectPath.length === 0 ) {
		throw new TypeError( 'Provided path must be a non-empty string' );
	}

	const resultsTemplate = {
		name: 'codecov'
	};

	if ( !isCI || process.env.NO_CODECOV ) {
		return Object.assign( {}, resultsTemplate, {
			ok: true,
			results: {
				skipped: true
			}
		} );
	}

	const codecovPath = await fetchUploader( process.platform, projectPath );
	const { exitCode, stdout, stderr } = await executeCLI( codecovPath, projectPath );

	return Object.assign( {}, resultsTemplate, {
		ok: exitCode === 0,
		results: {
			stdout,
			stderr
		}
	} );
}

async function fetchUploader( platform, projectPath ) {
	const supportedPlatforms = [
		'linux',
		'darwin',
		'win32'
	];

	if ( !supportedPlatforms.includes( platform ) ) {
		platform = 'linux';
	}

	const platformNames = {
		linux: 'linux',
		darwin: 'macos',
		win32: 'windows'
	};
	const platformFiles = {
		linux: 'codecov',
		darwin: 'codecov',
		win32: 'codecov.exe'
	};

	const platformName = platformNames[ platform ];
	const platformFile = platformFiles[ platform ];
	const uploaderURL = `https://uploader.codecov.io/latest/${ platformName }/${ platformFile }`;

	try {
		const uploaderData = await getPromise( uploaderURL );
		const uploaderPath = resolvePath( projectPath, platformFile );
		const uploaderFileStream = createWriteStream( uploaderPath );

		await streamPipeline( uploaderData, uploaderFileStream );

		return uploaderPath;
	} catch ( error ) {
		throw new Error( 'Can\'t download Codecov uploader' );
	}
}

function getPromise( url ) {
	return new Promise( ( resolve, reject ) => {
		get( url, ( response ) => {
			if ( response.statusCode !== 200 ) {
				return reject();
			}

			resolve( response );
		} ).on( 'error', reject );
	} );
}

function executeCLI( cliPath, projectPath ) {
	return new Promise( ( resolve ) => {
		const codecovProcess = exec( cliPath, {
			cwd: projectPath,
			env: npmRunPath.env()
		}, ( error, stdout, stderr ) => {
			resolve( {
				exitCode: codecovProcess.exitCode,
				stdout,
				stderr
			} );
		} );
	} );
}

export default codecov;
