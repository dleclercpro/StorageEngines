import { logger } from '../../logger';
import { LogType } from '../logs/Log';
import LogParser from '../logs/LogParser';
import LineDatabase from './LineDatabase';

export class LogDatabase<V> {
    private db: LineDatabase;
    private parser: LogParser<V>;

    public constructor(db: LineDatabase) {
        this.db = db;
        this.parser = new LogParser<V>(db.getSeparator());
    }

    public async has(key: string) {
        const log = await this.get(key);

        if (log === null) {
            return false;
        }

        return true;
    }

    public async get(key: string) {
        const line = await this.db.get(key);
        
        if (line === null) {
            return null;
        }

        try {
            const log = this.parser.parse(line);

            if (log.getType() === LogType.Delete) {
                logger.trace(`Key '${log.getKey()}' was deleted at: ${log.getTimestamp().toUTCString()}`);
                return null;
            }
            return log;

        } catch (err: unknown) {
            if (err instanceof Error) {
                logger.error(`Could not parse log line: ${line}`);
            } else {
                logger.fatal(`Unknown error`, err);
            }
            return null;
        }
    }

    public async add(key: string, value: string) {
        return this.db.add(key, value);
    }

    public async remove(key: string) {
        return this.db.remove(key);
    }
}

export default LogDatabase;