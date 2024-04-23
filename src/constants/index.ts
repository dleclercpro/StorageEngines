import path from 'path';

export const NEWLINE = '\n';
export const SEPARATOR = ':';
export const LOG_FILE_EXT = '.log';

export const ROOT_DIR = path.resolve(path.join(__dirname, '../..'));
export const DATA_DIR = path.join(ROOT_DIR, 'data');