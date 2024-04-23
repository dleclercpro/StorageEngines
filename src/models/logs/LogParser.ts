import { SEPARATOR } from '../../constants';
import Log, { LogType } from './Log';

class LogParser<V> {

    public constructor() {

    }

    public parse(logString: string, separator: string = SEPARATOR) {
        const parts = logString.split(separator);
        if (parts.length < 4) {
            throw new Error(`Log string is not in the expected format: ${logString}`);
        }

        const timestamp = new Date(parseInt(parts[0], 10));
        if (isNaN(timestamp.getTime())) {
            throw new Error(`Invalid timestamp in log string: ${logString}`);
        }

        const type = parts[1] as LogType;
        const key = parts[2];
        const value = parts.slice(3).join(separator) as unknown as V; // Assume the remaining part is the value, rejoining any colons.

        return new Log<V>({ type, timestamp, key, value });
    }
}

export default LogParser;