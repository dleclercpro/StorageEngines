import { logger } from '../logger';

export class HashIndex {
    private index: Record<string, number>;

    public constructor() {
        this.index = {};
    }

    public get(key: string) {
        const value = this.index[key];

        if (value === undefined) {
            return null;
        }

        return value;
    }

    public set(key: string, value: number) {
        logger.trace(`Adding key '${key}' to hash index: ${value}`);

        this.index[key] = value;
    }

    public delete(key: string) {
        delete this.index[key];
    }
}

export default HashIndex;