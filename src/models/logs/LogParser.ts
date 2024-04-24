import Log, { LogType } from './Log';

class LogParser<V> {
    private separator: string;

    public constructor(separator: string) {
        this.separator = separator;
    }

    public parse(logString: string) {
        const parts = logString.split(this.separator);
        if (parts.length < 4) {
            throw new Error(`Log string is not in the expected format: ${logString}`);
        }

        const timestamp = new Date(parseInt(parts[0], 10));
        if (isNaN(timestamp.getTime())) {
            throw new Error(`Invalid timestamp in log string: ${logString}`);
        }

        const type = parts[1] as LogType;
        const key = parts[2];
        const value = parts.slice(3).join(this.separator) as unknown as V; // Assume the remaining part is the value, rejoining any colons.

        return new Log<V>({ type, timestamp, key, value });
    }
}

export default LogParser;