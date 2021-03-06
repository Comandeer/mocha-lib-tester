import babelRegister from '@babel/register';
import preset from '@babel/preset-env';

function addBabelHook() {
	babelRegister( {
		cache: false,
		babelrc: false,
		presets: [
			[
				preset,
				{
					targets: {
						node: '12.0.0'
					}
				}
			]
		]
	} );
}

export default addBabelHook;
