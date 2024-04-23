import { SEPARATOR } from "../../constants";

export enum LogType {
    Set = 'SET',
    Delete = 'DELETE',
};

type LogArgs <V> = {
    type: LogType,
    timestamp: Date,
    key: string,
    value: V,
};

class Log<V> {
    protected type: LogType;
    protected timestamp: Date;
    protected key: string;
    protected value: V;

    public constructor({ type, timestamp, key, value }: LogArgs<V>) {
        this.type = type;
        this.timestamp = timestamp;
        this.key = key;
        this.value = value;
    }

    public toString() {
        return [this.timestamp.getTime(), this.type, this.key, this.value].join(SEPARATOR);
    }

    public getType() {
        return this.type;
    }

    public getTimestamp() {
        return this.timestamp;
    }

    public getKey() {
        return this.key;
    }

    public getValue() {
        return this.value;
    }
}

export default Log;