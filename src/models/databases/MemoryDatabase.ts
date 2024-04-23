export interface IKeyValueDatabase<V> {
    has(key: string): Promise<boolean>;
    get(key: string): Promise<V | null>;
    set(key: string, value: V): Promise<void>;
    delete(key: string): Promise<void>;
}



export class MemoryDatabase<R> implements IKeyValueDatabase<R> {
    protected db = new Map<string, R>();

    public async start() {

    }

    public async stop() {

    }

    public async has(id: string) {
        return this.db.has(id);
    }

    public async get(id: string) {
        return this.db.get(id) ?? null;
    }

    public async set(id: string, value: R) {
        this.db.set(id, value);
    }

    public async delete(id: string) {
        const prevValue = this.db.get(id) ?? null;

        if (prevValue) {
            this.db.delete(id);
        }
    }

    public async size() {
        const values = await this.getAll();

        return values.length;
    }

    public async getAll() {
        return Object.values(this.db);
    }
}