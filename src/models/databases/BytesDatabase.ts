import { BYTES_DATABASE_MAX_SIZE, NEW_LINE } from '../../constants';
import { logger } from '../../logger';
import HashIndex from '../HashIndex';

export const generateEmptyDatabase = (size: number = BYTES_DATABASE_MAX_SIZE) => {
    if (size > BYTES_DATABASE_MAX_SIZE) {
      throw new Error(`Maximum database size exceeded: ${size}B > ${BYTES_DATABASE_MAX_SIZE}B`);
    }

    logger.trace(`Generating empty database of ${size}B...`);
    const db = new Uint8Array(size);
    
    logger.trace(`Done!`);
    return db;
}



export class BytesDatabase {
    private db: Uint8Array;
    private separator: string;
    private size: number;
    private hashIndex: HashIndex;

    public constructor(db: Uint8Array = generateEmptyDatabase(), separator: string = NEW_LINE, size: number = 0, hashIndex: HashIndex = new HashIndex()) {
        this.db = db;
        this.separator = separator
        this.size = size;
        this.hashIndex = hashIndex;
    }

    public toString() {
        return this.db.slice(0, this.size);
    }

    public getSize() {
        return this.size;
    }

    public getHashIndex() {
        return this.hashIndex;
    }

    public get(key: string) {
        logger.trace(`Retrieving key '${key}' from database.`);

        const index = this.hashIndex.get(key);

        if (index === null) {
            logger.warn(`Key '${key}' does not exist in the hash index!`);
            return null;
        }

        const startIndex = index;
        let endIndex = index;

        const keyAsArray: string[] = [];
        while (String.fromCharCode(this.db[index]) !== this.separator) {
            keyAsArray.push(String.fromCharCode(this.db[index]));
            endIndex += 1;
        }
        endIndex += 1;

        const valueAsArray: string[] = [];
        while (String.fromCharCode(this.db[index]) !== this.separator) {
            valueAsArray.push(String.fromCharCode(this.db[index]));
            endIndex += 1;
        }
        endIndex += 1;

        const [_, value] = this.db.slice(startIndex, endIndex + 1)
            .join()
            .split(this.separator);

        logger.trace(`Found value for key '${key}' between bytes ${startIndex} and ${endIndex}: ${value}`);

        return value;
    }

    private addSeparator() {
        this.set(this.size, this.separator);
        this.size += 1;
    }

    private addChar(char: string) {
        if (char === this.separator) {
            throw new Error(`Cannot write separator '${this.separator}' as a value to the database!'`);
        }

        this.set(this.size, char);
        this.size += 1;
    }

    private set(index: number, char: string) {
        this.db[index] = char.charCodeAt(0);
    }

    public add(key: string, value: string) {
        const keyAsArray = key.split('').filter(c => c !== '');
        const valueAsArray = value.split('').filter(c => c !== '');

        const keySize = keyAsArray.length;
        const valueSize = valueAsArray.length;

        // Store beginning of key in database content in hash index
        this.hashIndex.set(key, this.size);

        logger.trace(`Writing ${keySize} bytes key: ${key}`);
        for (const c of keyAsArray) {
            this.addChar(c);
        }
        this.addSeparator();

        logger.trace(`Writing ${valueSize} bytes value: ${value}`);
        for (const c of valueAsArray) {
            this.addChar(c);
        }
        this.addSeparator();

        logger.trace(`Key '${key}' successfully added to database.`);
    }

    public remove(key: string) {
        
    }
}

export default BytesDatabase;