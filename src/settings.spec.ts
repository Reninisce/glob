import * as assert from 'assert';

import Settings from './settings';

describe('Settings', () => {
	it('should return instance with default values', () => {
		const settings = new Settings();

		assert.strictEqual(settings.concurrency, Infinity);
		assert.strictEqual(settings.cwd, process.cwd());
		assert.ok(settings.deep);
		assert.deepStrictEqual(settings.ignore, []);
		assert.ok(!settings.dot);
		assert.ok(!settings.stats);
		assert.ok(settings.onlyFiles);
		assert.ok(!settings.onlyDirectories);
		assert.ok(settings.followSymbolicLinks);
		assert.ok(!settings.throwErrorOnBrokenSymbolicLink);
		assert.ok(settings.unique);
		assert.ok(!settings.markDirectories);
		assert.ok(!settings.absolute);
		assert.ok(settings.brace);
		assert.ok(settings.globstar);
		assert.ok(settings.extglob);
		assert.ok(settings.caseSensitiveMatch);
		assert.ok(!settings.matchBase);
		assert.strictEqual(settings.transform, null);
	});

	it('should return instance with custom values', () => {
		const settings = new Settings({
			onlyFiles: false
		});

		assert.ok(!settings.onlyFiles);
	});

	it('should set the "onlyFiles" option when the "onlyDirectories" is enabled', () => {
		const settings = new Settings({
			onlyDirectories: true
		});

		assert.ok(!settings.onlyFiles);
		assert.ok(settings.onlyDirectories);
	});

	it('should set the "throwErrorOnBrokenSymbolicLink" option to "true" when the "stats" option is enabled', () => {
		const settings = new Settings({
			stats: true
		});

		assert.ok(settings.stats);
		assert.ok(settings.throwErrorOnBrokenSymbolicLink);
	});
});
