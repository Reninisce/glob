import * as path from 'path';

import glob = require('bash-glob');
import micromatch = require('micromatch');

import { TPattern } from '../../../types/patterns';

const patterns: TPattern[] = ['**/*.md', '**/*.txt', '!**/*.txt'];

const options: glob.Options = {
	cwd: path.join(process.cwd(), process.env.BENCHMARK_CWD as string),
	globstar: true
};

console.time('timer');

glob(patterns, options, (err, matches) => {
	if (err) {
		console.error(err);
		process.exit(0);
	}

	// The bash-glob package does not support negative patterns
	const entries = micromatch(matches, patterns);

	console.info('files: ' + entries.length);
	console.timeEnd('timer');
});
