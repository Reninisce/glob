import * as assert from 'assert';

import Settings from '../settings';
import * as tests from '../tests/index';
import { PatternsGroup } from '../types/index';
import * as manager from './tasks';

describe('Managers → Task', () => {
	describe('.generate', () => {
		it('should return task with negative patterns from «ignore» option', () => {
			const settings = new Settings({ ignore: ['*.txt'] });

			const expected = [
				tests.task.builder().base('a').positive('a/*').negative('*.md').negative('*.txt').build()
			];

			const actual = manager.generate(['a/*', '!*.md'], settings);

			assert.deepStrictEqual(actual, expected);
		});

		it('should return static and dynamic tasks', () => {
			const settings = new Settings({ ignore: ['*.txt'] });

			const expected = [
				tests.task.builder().base('a').static().positive('a/file.json').negative('b/*.md').negative('*.txt').build(),
				tests.task.builder().base('b').positive('b/*').negative('b/*.md').negative('*.txt').build()
			];

			const actual = manager.generate(['a/file.json', 'b/*', '!b/*.md'], settings);

			assert.deepStrictEqual(actual, expected);
		});

		it('should return only dynamic tasks when the `caseSensitiveMatch` option is enabled', () => {
			const settings = new Settings({ caseSensitiveMatch: false });

			const expected = [
				tests.task.builder().base('a').positive('a/file.json').negative('b/*.md').build(),
				tests.task.builder().base('b').positive('b/*').negative('b/*.md').build()
			];

			const actual = manager.generate(['a/file.json', 'b/*', '!b/*.md'], settings);

			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('.convertPatternsToTasks', () => {
		it('should return one task when positive patterns have a global pattern', () => {
			const expected = [
				tests.task.builder().base('.').positive('*').negative('*.md').build()
			];

			const actual = manager.convertPatternsToTasks(['*'], ['*.md'], /* dynamic */ true);

			assert.deepStrictEqual(actual, expected);
		});

		it('should return two tasks', () => {
			const expected = [
				tests.task.builder().base('a').positive('a/*').negative('b/*.md').build(),
				tests.task.builder().base('b').positive('b/*').negative('b/*.md').build()
			];

			const actual = manager.convertPatternsToTasks(['a/*', 'b/*'], ['b/*.md'], /* dynamic */ true);

			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('.getPositivePatterns', () => {
		it('should return only positive patterns', () => {
			const expected = ['*'];

			const actual = manager.getPositivePatterns(['*', '!*.md']);

			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('.getNegativePatternsAsPositive', () => {
		it('should return negative patterns as positive', () => {
			const expected = ['*.md'];

			const actual = manager.getNegativePatternsAsPositive(['*', '!*.md'], []);

			assert.deepStrictEqual(actual, expected);
		});

		it('should return negative patterns as positive with patterns from ignore option', () => {
			const expected = ['*.md', '*.txt', '*.json'];

			const actual = manager.getNegativePatternsAsPositive(['*', '!*.md'], ['*.txt', '!*.json']);

			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('.groupPatternsByBaseDirectory', () => {
		it('should return empty object', () => {
			const expected: PatternsGroup = {};

			const actual = manager.groupPatternsByBaseDirectory([]);

			assert.deepStrictEqual(actual, expected);
		});

		it('should return grouped patterns', () => {
			const expected: PatternsGroup = {
				'.': ['*'],
				a: ['a/*']
			};

			const actual = manager.groupPatternsByBaseDirectory(['*', 'a/*']);

			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('.convertPatternGroupsToTasks', () => {
		it('should return two tasks', () => {
			const expected = [
				tests.task.builder().base('a').positive('a/*').negative('b/*.md').build(),
				tests.task.builder().base('b').positive('b/*').negative('b/*.md').build()
			];

			const actual = manager.convertPatternGroupsToTasks({ a: ['a/*'], b: ['b/*'] }, ['b/*.md'], /* dynamic */ true);

			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('.convertPatternGroupToTask', () => {
		it('should return created dynamic task', () => {
			const expected = tests.task.builder().base('.').positive('*').negative('*.md').build();

			const actual = manager.convertPatternGroupToTask('.', ['*'], ['*.md'], /* dynamic */ true);

			assert.deepStrictEqual(actual, expected);
		});

		it('should return created static task', () => {
			const expected = tests.task.builder().base('.').static().positive('.gitignore').negative('.git*').build();

			const actual = manager.convertPatternGroupToTask('.', ['.gitignore'], ['.git*'], /* dynamic */ false);

			assert.deepStrictEqual(actual, expected);
		});

		it('should normalize the base path', () => {
			const expected = tests.task.builder().base('root/directory').build();

			const actual = manager.convertPatternGroupToTask('root/directory', [], [], /* dynamic */ true);

			assert.deepStrictEqual(actual, expected);
		});
	});
});
