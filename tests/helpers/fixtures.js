import { resolve as resolvePath } from 'path';
import { copy, remove } from 'fs-extra';

const FIXTURES_PATH = resolvePath( __dirname, '..', 'fixtures' );
const TEMP_PATH = resolvePath( process.cwd(), '.fixtures-temp' );

async function prepareCLIFixture( name ) {
	const srcPath = resolvePath( FIXTURES_PATH, name );
	const distPath = resolvePath( TEMP_PATH, name );

	await copy( srcPath, distPath );

	return distPath;
}

function cleanupFixtures() {
	return remove( TEMP_PATH );
}

export { prepareCLIFixture };
export { cleanupFixtures };
