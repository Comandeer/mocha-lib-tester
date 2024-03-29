# @comandeer/mocha-lib-tester Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

---

## [0.7.0] – 2022-11-11
### Added
* [#95]: support for Node 18.

### Changed
* [#97]: **BREAKING CHANGE**: export workers from `./workers/*` subpaths.
* [#99]: **BREAKING CHANGE**: updated dependencies, including major versions:
	* `glob`: 7.2.0 → 8.0.3,
	* `mocha`: 9.1.3 → 10.0.0,
	* `sinon`: 12.0.1 → 14.0.0,
	* `@comandeer/eslint-config`: 0.4.0 → 0.8.0.

### Fixed
* [#102]: dynamic imports were not preserved, making importing ESM files impossible.

### Removed
* [#95]: **BREAKING CHANGE**: support for Node &lt; 16.12.0.

## [0.6.0] – 2021-11-18
### Added
* [#81]: **BREAKING CHANGE**: run steps in worker threads.

### Changed
* **BREAKING CHANGE**: update public exports.
* **BREAKING CHANGE**: update flow of steps.
* [#82]: **BREAKING CHANGE**: makes API fully asynchronous.
* [#84]: **BREAKING CHANGE**: update dependencies:
	* `sinon` to 12.x,
	* `eslint` to 8.x,
	* `istanbul-lib-instrument` to 5.x.
* [#91]: **BREAKING CHANGE**: switch to new Codecov uploader.

## [0.5.0] – 2021-06-29
### Added
* [#72]: spinners for every step to indicate progress.

## [0.4.1] – 2021-06-27
### Added
* [#74]: missing docs for the watch mode.

## [0.4.0] – 2021-06-27
### Added
* [#57]: support for watch mode.
* [#70]: support for Node 16.

### Changed
* **BREAKING CHANGE**: updated dependencies:
	* `mocha` to `9.x`,
	* `sinon` to `11.x`,
	* `@comandeer/eslint-config` to `0.4.x`,
	* `yargs` to `17.x`.

## [0.3.0] – 2021-05-20
### Added
* [#65]: support for providing the steps to run as CLI arguments.

### Changed
* **BREAKING CHANGE**: update public API.
* **BREAKING CHANGE**: update step definition to include `id` property.
* **BREAKING CHANGE**: updated Sinon to v10.0.0.

## [0.2.2] – 2021-02-22
### Fixed
* [#62]: Wrong path to CodeCov binary.

## [0.2.1] – 2021-02-22
### Fixed
* [#60]: CodeCov reporter does not log `stderr` output.

## [0.2.0] – 2021-02-22
### Changed
* [#47]: Much more usable and readable results thanks to massive refactor.
* [#48]: Improved Chai preamble.

## 0.1.0 – 2020-10-17
### Added
* First working version, yay!

[#47]: https://github.com/Comandeer/mocha-lib-tester/issues/47
[#48]: https://github.com/Comandeer/mocha-lib-tester/issues/48
[#57]: https://github.com/Comandeer/mocha-lib-tester/issues/57
[#60]: https://github.com/Comandeer/mocha-lib-tester/issues/60
[#62]: https://github.com/Comandeer/mocha-lib-tester/issues/62
[#65]: https://github.com/Comandeer/mocha-lib-tester/issues/65
[#70]: https://github.com/Comandeer/mocha-lib-tester/issues/70
[#72]: https://github.com/Comandeer/mocha-lib-tester/issues/72
[#74]: https://github.com/Comandeer/mocha-lib-tester/issues/74
[#81]: https://github.com/Comandeer/mocha-lib-tester/issues/81
[#82]: https://github.com/Comandeer/mocha-lib-tester/issues/82
[#84]: https://github.com/Comandeer/mocha-lib-tester/issues/84
[#91]: https://github.com/Comandeer/mocha-lib-tester/issues/91
[#95]: https://github.com/Comandeer/mocha-lib-tester/issues/95
[#97]: https://github.com/Comandeer/mocha-lib-tester/issues/97
[#99]: https://github.com/Comandeer/mocha-lib-tester/issues/99
[#102]: https://github.com/Comandeer/mocha-lib-tester/issues/102

[0.7.0]: https://github.com/Comandeer/mocha-lib-tester/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/Comandeer/mocha-lib-tester/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/Comandeer/mocha-lib-tester/compare/v0.4.1...v0.5.0
[0.4.1]: https://github.com/Comandeer/mocha-lib-tester/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/Comandeer/mocha-lib-tester/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/Comandeer/mocha-lib-tester/compare/v0.2.2...v0.3.0
[0.2.2]: https://github.com/Comandeer/mocha-lib-tester/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/Comandeer/mocha-lib-tester/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/Comandeer/mocha-lib-tester/compare/v0.1.0...v0.2.0
