# @comandeer/mocha-lib-tester Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

---

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

[0.5.0]: https://github.com/Comandeer/mocha-lib-tester/compare/v0.4.1...v0.5.0
[0.4.1]: https://github.com/Comandeer/mocha-lib-tester/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/Comandeer/mocha-lib-tester/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/Comandeer/mocha-lib-tester/compare/v0.2.2...v0.3.0
[0.2.2]: https://github.com/Comandeer/mocha-lib-tester/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/Comandeer/mocha-lib-tester/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/Comandeer/mocha-lib-tester/compare/v0.1.0...v0.2.0
