import babelRegister from '@babel/register';
import preset from '@babel/preset-env';

function addBabelHook() {
	babelRegister( {
		babelrc: false,
		presets: [
			[
				preset,
				{
					targets: {
						node: '8.0.0'
					}
				}
			]
		]
	} );
}

export default addBabelHook;
