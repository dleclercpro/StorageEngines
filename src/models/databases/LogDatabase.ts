import { logger } from '../../logger';
import { readDir } from '../../utils/file';

export interface IKeyValueDatabase<V> {
    has(key: string): Promise<boolean>;
    get(key: string): Promise<V | null>;
    set(key: string, value: V): Promise<void>;
    delete(key: string): Promise<void>;
}



export class LogDatabase<V> implements IKeyValueDatabase<V> {
    protected dir: string;

    public constructor(dir: string) {
        this.dir = dir;

        logger.debug(this.dir);
    }

    public async start() {

    }

    public async stop() {

    }

    public async has(key: string) {
        const files = await readDir(this.dir);

        logger.debug(files);

        return false;
    }

    public async get(key: string) {
        return null;
    }

    public async set(key: string, value: V) {

    }

    public async delete(key: string) {

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