import { writeFile } from 'fs/promises';

function touch( path ) {
	return writeFile( path, '\n', 'utf8' );
}

export default touch;
