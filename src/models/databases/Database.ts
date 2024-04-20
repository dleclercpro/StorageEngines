import { Logger } from 'pino';
import { logger } from '../../logger';

export interface DatabaseOptions {
    host: string,
    port: number,
    name: string,
}

abstract class Database {
    protected host: string;
    protected port: number;
    protected name: string;

    protected logger: Logger;

    protected abstract getURI(): string;
    protected abstract getAnonymousURI(): string;

    public constructor(options: DatabaseOptions) {
        const { host, port, name } = options;

        this.host = host;
        this.port = port;
        this.name = name;

        this.logger = logger;
    }

    public async start() {

    }

    public async stop() {
        
    }
}

export default Database;