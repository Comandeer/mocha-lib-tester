import Logger from '../../src/Logger.js';

class DummyLogger extends Logger {
	log() {}

	onStart() {}

	onStepStart() {}

	onStepEnd() {}

	onEnd() {}

	onError() {}
}

export default DummyLogger;
