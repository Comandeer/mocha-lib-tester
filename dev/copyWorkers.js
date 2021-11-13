/* eslint-disable no-console */

const { copyFileSync, readdirSync, mkdirSync } = require( 'fs' );
const { resolve: resolvePath, resolve } = require( 'path' );
const { green, yellow } = require( 'chalk' );

const cwd = process.cwd();
const srcDir = resolve( cwd, 'src', 'workers' );
const destDir = resolve( cwd, 'dist', 'workers' );
const workers = readdirSync( srcDir ).filter( ( file ) => {
	return file.endsWith( '.js' );
} );

console.log( yellow( 'Copying workers…' ) );

try {
	mkdirSync( destDir );
} catch {
	// Do nothing
}

workers.forEach( ( worker ) => {
	const srcPath = resolvePath( srcDir, worker );
	const destPath = resolvePath( destDir, worker );

	copyFileSync( srcPath, destPath );
} );

console.log( green( 'Workers copied' ) );
