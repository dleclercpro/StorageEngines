import path from 'path';
import { DATA_DIR, NEWLINE, SEPARATOR } from '../../constants';
import { logger } from '../../logger';
import { appendToFile, readDir, readFile } from '../../utils/file';
import { getCurrentDateUTC, isValidDate } from '../../utils/time';
import { LogType } from '../logs/Log';

export interface IKeyValueDatabase<V> {
    has(key: string): Promise<boolean>;
    get(key: string): Promise<V | null>;
    set(key: string, value: V): Promise<void>;
    delete(key: string): Promise<void>;
}



export class LogDatabase implements IKeyValueDatabase<string> {
    protected dir: string;
    protected format: string;

    public constructor(dir: string, format: string = 'YYYY-MM-DD') {
        this.dir = dir;
        this.format = format;
    }

    public async start() {

    }

    public async stop() {

    }

    public async has(key: string) {
        logger.debug(`Looking for: ${key}`);

        const files = await readDir(this.dir);
        const dateFiles = files.filter(file => {
            const filename = path.parse(file).name;
            return isValidDate(filename);
        });
        const sortedDateFiles = dateFiles.sort((a: string, b: string) => {
            if (new Date(a) < new Date(b)) return -1;
            if (new Date(a) > new Date(b)) return 1;
            return 0;
        });

        logger.debug(`Found ${sortedDateFiles.length} date files in: ${this.dir}`);

        return this.get(key) !== null;
    }

    public async get(key: string) {
        const filepath = path.join(DATA_DIR, `${getCurrentDateUTC()}.log`);

        const file = await readFile(filepath);
        const lines = file
            .split(NEWLINE)
            .filter(line => line !== '');

        const processedLines = lines
            .map((line, i) => {
                const index = i;
                const [timestamp, type, key, value] = line.split(SEPARATOR);

                return {
                    index,
                    type: type as LogType,
                    timestamp: new Date(timestamp),
                    key,
                    value,
                };
            });

        // Search for key from end to start
        const processedLine = processedLines
            .reverse()
            .find(line => line.key === key);

        if (processedLine) {
            logger.debug(`Found value for key '${key}' with index ${processedLine.index}: ${processedLine.value}`);
            return lines[processedLine.index];
        }
        
        logger.warn(`Could not find value for key: ${key}`);
        return null;
    }

    public async set(key: string, value: string) {
        const now = new Date().getTime();
        const filepath = path.join(DATA_DIR, `${getCurrentDateUTC()}.log`);

        const line = `${now}:${LogType.Set}:${key}:${value}`;

        await appendToFile(filepath, line + NEWLINE);
    }

    public async delete(key: string) {
        const now = new Date().getTime();
        const filepath = path.join(DATA_DIR, `${getCurrentDateUTC()}.log`);

        const line = `${now}:${LogType.Delete}:${key}`;

        await appendToFile(filepath, line + NEWLINE);
    }

    public async size() {
        const values = await this.getAll();

        return values.length;
    }

    public async getAll() {
        return [];
    }
}

export default LogDatabase;