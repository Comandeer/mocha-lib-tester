import { resolve as resolvePath } from 'path';
import libReport from 'istanbul-lib-report';
import reports from 'istanbul-reports';

function codeCoverageReporter( projectPath ) {
	return function( coverageMap ) {
		const configWatermarks = {
			statements: [ 50, 80 ],
			functions: [ 50, 80 ],
			branches: [ 50, 80 ],
			lines: [ 50, 80 ]
		};
		const context = libReport.createContext( {
			dir: resolvePath( projectPath, '.coverage' ),
			defaultSummarizer: 'nested',
			watermarks: configWatermarks,
			coverageMap
		} );
		const lcovReport = reports.create( 'lcovonly' );
		const textReport = reports.create( 'text' );

		lcovReport.execute( context );
		textReport.execute( context );
	};
}

export default codeCoverageReporter;
