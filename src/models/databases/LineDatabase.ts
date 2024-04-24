import path from 'path';
import { DATA_DIR, LOG_EXT, NEW_LINE } from '../../constants';
import { logger } from '../../logger';
import { appendToFile, readDir, readFile } from '../../utils/file';
import { toUTC, isValidDate } from '../../utils/time';
import { LogType } from '../logs/Log';
import { unique } from '../../utils/array';

export class LineDatabase {
    private dir: string;
    private separator: string;

    public constructor(dir: string, separator: string) {
        this.dir = dir;
        this.separator = separator;
    }

    private async listLogFiles() {
        const filenames = await readDir(this.dir);
        if (unique(filenames).length !== filenames.length) {
            throw new Error('Duplicate files are not allowed!');
        }

        const filteredFilenames = filenames
            .filter(file => {
                const date = path.parse(file).name;
                const ext = path.extname(file);
                
                return isValidDate(date) && ext === LOG_EXT;
            });
        if (unique(filteredFilenames).length !== filteredFilenames.length) {
            throw new Error('Filenames with same date are not allowed!');
        }

        return filteredFilenames;
    }

    private sortLogFilenames(filenames: string[]) {
        const sortedFilenames = filenames
            .sort((filenameA: string, filenameB: string) => {
                const a = new Date(path.parse(filenameA).name);
                const b = new Date(path.parse(filenameB).name);

                if (a < b) return -1;
                if (a > b) return 1;
                return 0;
            });
        logger.trace(`Found ${sortedFilenames.length} date file(s) in directory: ${this.dir}`);

        return sortedFilenames.reverse();
    }

    public async has(key: string) {
        return this.get(key) !== null;
    }

    public async get(key: string) {
        logger.trace(`Looking for key: ${key}`);

        const filenames = this.sortLogFilenames(await this.listLogFiles());

        // Look in time-descending order
        for (const filename of filenames) {
            logger.trace(`Looking for key '${key}' in file: ${filename}`);
            const file = await readFile(path.join(DATA_DIR, filename));
            
            const lines = file
                .split(NEW_LINE)
                .filter(line => line !== '');
            const processedLines = lines
                .map((line, i) => {
                    const index = i;
                    const [timestamp, type, key, value] = line.split(this.separator);
    
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
                logger.trace(`Found ${processedLine.type} key '${key}' with index [${processedLine.index}]: ${processedLine.value}`);
                return lines[processedLine.index];
            }
        }

        logger.warn(`Could not find value for key: ${key}`);
        return null;
    }

    public getSeparator() {
        return this.separator;
    }

    private async set(type: LogType, key: string, value: string) {
        const now = new Date();
        const filepath = path.join(DATA_DIR, toUTC(now) + LOG_EXT);

        const line = [now.getTime(), type, key, value].join(this.separator);

        await appendToFile(filepath, line + NEW_LINE);
    }

    public async add(key: string, value: string) {
        return this.set(LogType.Set, key, value);
    }

    public async remove(key: string) {
        return this.set(LogType.Delete, key, 'NULL');
    }
}

export default LineDatabase;