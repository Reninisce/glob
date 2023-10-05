import * as assert from 'assert';
import * as stream from 'stream';

import * as util from './stream';

describe('Utils → Stream', () => {
	describe('.merge', () => {
		it('should merge two streams into one stream', () => {
			const first = new stream.PassThrough();
			const second = new stream.PassThrough();

			const expected = 2;

			const mergedStream = util.merge([first, second]);

			const actual = mergedStream.listenerCount('close');

			assert.strictEqual(actual, expected);
		});

		it('should propagate errors into merged stream', (done) => {
			const first = new stream.PassThrough();
			const second = new stream.PassThrough();

			const expected = [1, 2, 3];

			const mergedStream = util.merge([first, second]);

			const actual: number[] = [];

			mergedStream.on('error', (error: number) => actual.push(error));

			mergedStream.once('finish', () => {
				assert.deepStrictEqual(actual, expected);

				done();
			});

			first.emit('error', 1);
			second.emit('error', 2);
			mergedStream.emit('error', 3);
		});
	});
});
