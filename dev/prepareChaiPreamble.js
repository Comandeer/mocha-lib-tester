/* eslint-disable no-console */

const { readFileSync, writeFileSync } = require( 'fs' );
const { resolve: resolvePath } = require( 'path' );
const { execSync } = require( 'child_process' );
const { minify } = require( 'terser' );
const { transform } = require( '@babel/core' );
const {
	variableDeclaration,
	variableDeclarator,
	identifier,
	templateLiteral,
	templateElement
} = require( '@babel/types' );
const { ESLint } = require( 'eslint' );

main();

async function main() {
	try {
		const hooksPath = resolvePath( __dirname, '..', 'src', 'hooks' );
		const preamblePath = resolvePath( hooksPath, 'chaiPreamble.js' );
		const preamble = readFileSync( preamblePath, 'utf8' );
		const minifiedPreamble = await minifyPreamble( preamble );
		const hookPath = resolvePath( hooksPath, 'chai.js' );
		const hook = readFileSync( hookPath, 'utf8' );
		const transformedHook = await generateCodeWithPreamble( hook, minifiedPreamble );

		writeFileSync( hookPath, transformedHook, 'utf8' );
		await fixCodeStyle( hookPath );
		await commitChanges( hookPath );
	} catch ( error ) {
		console.error( error );
	}
}

async function minifyPreamble( preamble ) {
	const { code } = await minify( preamble );

	return code;
}

async function generateCodeWithPreamble( code, preamble ) {
	// If we replace const with another const with the same name, visitor will be visiting it forever.
	// We need to break from that insane loop!
	let visited = false;

	const transformedCode = await transform( code, {
		plugins: [
			function embedPreamble() {
				return {
					visitor: {
						VariableDeclaration( path ) {
							const [ declaration ] = path.node.declarations;

							if ( declaration.id.name !== 'chaiPreamble' || visited ) {
								return;
							}

							const newDeclaration = createPreambleDeclaration( preamble );
							path.replaceWith( newDeclaration );

							visited = true;
						}
					}
				};
			}
		]
	} );

	return transformedCode.code;
}

function createPreambleDeclaration( preamble ) {
	return variableDeclaration( 'const', [
		variableDeclarator( identifier( 'chaiPreamble' ), templateLiteral( [
			templateElement( {
				raw: preamble
			}, true )
		], [] ) )
	] );
}

async function fixCodeStyle( filePath ) {
	const eslint = new ESLint( {
		useEslintrc: false,
		baseConfig: {
			extends: '@comandeer/eslint-config'
		},
		fix: true
	} );
	const results = await eslint.lintFiles( [ filePath ] );

	await ESLint.outputFixes( results );
}

function commitChanges( filePath ) {
	// Neat trick: git diff --exit-code returns 1 if there are changes in the given file.
	try {
		const diffCommand = `git diff --exit-code ${ filePath }`;
		execSync( diffCommand );
	} catch {
		const commitCommand = `git add ${ filePath } && git commit -m "refactor(hooks): update preamble in chai hook"`;
		execSync( commitCommand );
	}
}
