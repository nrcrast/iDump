import * as fs from 'fs';

export async function checkFsExists(file: string): Promise<boolean> {
	return fs.promises.access(file, fs.constants.F_OK)
		.then(() => true)
		.catch(() => false)
}