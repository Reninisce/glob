import * as path from 'path';

/**
 * Returns «true» if the last partial of the path starting with a period.
 */
export function isDotDirectory(filepath: string): boolean {
	return path.basename(filepath).startsWith('.');
}

/**
 * Convert a windows-like path to a unix-style path.
 */
export function unixify(filepath: string): string {
	return filepath.replace(/\\/g, '/');
}

/**
 * Returns normalized absolute path of provided filepath.
 */
export function makeAbsolute(cwd: string, filepath: string): string {
	if (path.isAbsolute(filepath)) {
		return filepath;
	}

	return path.resolve(cwd, filepath);
}
