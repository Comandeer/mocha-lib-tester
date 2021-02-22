# @comandeer/mocha-lib-tester

![Build Status](https://github.com/Comandeer/mocha-lib-tester/workflows/CI/badge.svg) [![Dependency Status](https://david-dm.org/Comandeer/mocha-lib-tester.svg)](https://david-dm.org/Comandeer/mocha-lib-tester) [![devDependencies Status](https://david-dm.org/Comandeer/mocha-lib-tester/dev-status.svg)](https://david-dm.org/Comandeer/mocha-lib-tester?type=dev) [![codecov](https://codecov.io/gh/Comandeer/mocha-lib-tester/branch/main/graph/badge.svg)](https://codecov.io/gh/Comandeer/mocha-lib-tester) [![npm (scoped)](https://img.shields.io/npm/v/@comandeer/mocha-lib-tester.svg)](https://npmjs.com/package/@comandeer/mocha-lib-tester)

Super opinionated test library using [Mocha](https://github.com/mochajs/mocha), [Babel](https://github.com/babel/babel), [Chai](https://github.com/chaijs/chai), [Sinon](https://github.com/sinonjs/sinon), [sinon-chai](https://github.com/domenic/sinon-chai), [proxyquire](https://github.com/thlorenz/proxyquire) and [IstanbulJS](https://github.com/istanbuljs/istanbuljs).

## How does it work?


## Installation

```bash
npm install @comandeer/mocha-lib-tester --save-dev
```

## Usage

Just make it a npm script:

```json
"scripts": {
	"test": "mlt"
}
```

## Configuration

No configuration. Consider it a feature.

## Enabling Intellisense

For now to enable Intellisense for tests, you need to add `jsconfig.json` file to your project:

```json
{
	"compilerOptions": {
		"typeRoots": [
			"./node_modules/@types",
			"./node_modules/@comandeer"
		]
	}
}
```

## License

See [LICENSE](./LICENSE) file for details.
