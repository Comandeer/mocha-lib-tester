import { promises as fsPromises } from 'fs';

const { writeFile } = fsPromises;

function touch( path ) {
	return writeFile( path, '\n', 'utf8' );
}

export default touch;
