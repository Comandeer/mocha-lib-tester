import { promisify } from 'util';
import glob from 'glob';

const globPromise = promisify( glob );

export default globPromise;
