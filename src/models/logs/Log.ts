export enum LogType {
    Set = 'set',
    Delete = 'delete',
};

type LogArgs <V> = {
    type: LogType,
    key: string,
    value: V,
};

class Log<V> {
    protected type: LogType;
    protected key: string;
    protected value: V;

    public constructor({ type, key, value }: LogArgs<V>) {
        this.type = type;
        this.key = key;
        this.value = value;
    }

    public toString() {
        return `${this.key}: ${this.value}`;
    }

    public getKey() {
        return this.key;
    }

    public getValue() {
        return this.value;
    }
}

export default Log;