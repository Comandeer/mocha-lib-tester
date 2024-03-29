# @comandeer/mocha-lib-tester

![Build Status](https://github.com/Comandeer/mocha-lib-tester/workflows/CI/badge.svg) [![codecov](https://codecov.io/gh/Comandeer/mocha-lib-tester/branch/main/graph/badge.svg)](https://codecov.io/gh/Comandeer/mocha-lib-tester) [![npm (scoped)](https://img.shields.io/npm/v/@comandeer/mocha-lib-tester.svg)](https://npmjs.com/package/@comandeer/mocha-lib-tester)

Super opinionated test library using [Mocha](https://github.com/mochajs/mocha), [Babel](https://github.com/babel/babel), [Chai](https://github.com/chaijs/chai), [Sinon](https://github.com/sinonjs/sinon), [sinon-chai](https://github.com/domenic/sinon-chai), [proxyquire](https://github.com/thlorenz/proxyquire) and [IstanbulJS](https://github.com/istanbuljs/istanbuljs).

## ☠️ Project is deprecated! ☠️

Version 0.7.0, released on 2022-11-11, is the last version of the project, as the experiment showed that the whole approach to building this test library was quite flawed. It became apparent especially when I tried to make it work with native ESM.

Personally I'm recommending [`ava`](https://github.com/avajs/ava) and if I were going to write a test library again, I would definitely take inspiration from it.

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

### Run only selected steps

You can also run only selected steps, e.g.

```bash
mlt test coverage
```

The above command will run only Mocha tests and display code coverage info.

### Available steps

|    Id    |      Name     |                   Description                  |
|:--------:|:-------------:|:----------------------------------------------:|
|   lint   |     Linter    |          Runs ESLint against the code.         |
|   test   |     Tester    |          Runs tests against the code.          |
| coverage | Code Coverage | Gathers and displays info about code coverage. |
| codecov  | CodeCov       | Uploads info about code coverage to CodeCov.   |

### Watch mode

The command also allows to run tests in a watch mode, which reruns tests every time any file changes in your project's `src/` and `tests/` directories. To use the watch mode just add `--watch` argument:

```bash
mlt --watch
```

You can also watch only selected steps, e.g.

```bash
mlt test --watch
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
