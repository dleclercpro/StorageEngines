import { BYTES_DATABASE_MAX_SIZE } from '../../constants';
import { logger } from '../../logger';
import HashIndex from '../HashIndex';

export const generateEmptyDatabase = (size: number = BYTES_DATABASE_MAX_SIZE) => {
    if (size > BYTES_DATABASE_MAX_SIZE) {
      throw new Error(`Maximum database size exceeded: ${size}B > ${BYTES_DATABASE_MAX_SIZE}B`);
    }

    logger.trace(`Generating empty database of ${size}B...`);
    const db = new Array(size);

    return db;
}



export class BytesDatabase {
    private db: number[];
    private separator: string;
    private size: number;
    private hashIndex: HashIndex;

    public constructor(separator: string) {
        this.db = generateEmptyDatabase();
        this.separator = separator;
        this.size = 0;
        this.hashIndex = new HashIndex();
    }

    public toString() {
        return this.db
            .slice(0, this.size)
            .map((charCode: number) => String.fromCharCode(charCode))
            .join('');
    }

    public getSize() {
        return this.size;
    }

    public getHashIndex() {
        return this.hashIndex;
    }

    private getKeyValuePairSize(index: number) {
        const pairSizeAsArray: string[] = [];
        
        let i = -1;

        while (true) {
            i += 1;

            const char = String.fromCharCode(this.db[index + i]);

            // Once we reach the separator, we have read the actual size in bytes of the
            // key-value pair content in the database
            if (char === this.separator) {

                // In case the first character was a separator, there was an issue
                // with the byte encoding
                if (i === 0) {
                    throw new Error('Database encoding error!');
                }

                // Otherwise, we've found the bytes associated to the key-value pair size
                break;
            }

            pairSizeAsArray.push(char);
        }
        const pairSize = parseInt(pairSizeAsArray.join(''), 10);

        const startIndex = index + pairSizeAsArray.length + 1; // Don't forget the separator between the key-value pair length and the rest of the data
        const endIndex = startIndex + pairSize + 1 // Don't forget the separator between the key and value!;

        logger.trace(`Key-value data found between bytes ${startIndex} and ${endIndex}.`);

        return {
            startIndex,
            endIndex,
            size: pairSize,
        };
    }

    public get(key: string) {
        logger.trace(`Retrieving key '${key}' from database.`);

        const index = this.hashIndex.get(key);

        if (index === null) {
            logger.warn(`Key '${key}' does not exist in the hash index!`);
            return null;
        }
        logger.trace(`Key '${key}' exists in hash index: ${index}`);

        const { startIndex, endIndex } = this.getKeyValuePairSize(index);

        const [existingKey, value] = this.db
            .slice(startIndex, endIndex + 1)
            .map((charCode: number) => String.fromCharCode(charCode))
            .join('')
            .split(this.separator);

        if (key !== existingKey) {
            throw new Error('Invalid database encoding: mismatch between requested and existing keys.');
        }

        return value;
    }

    private set(index: number, charCode: number) {
        this.db[index] = charCode;
    }

    public add(key: string, value: string) {
        const keyAsArray = key.split('').filter(c => c !== '');
        const keySize = keyAsArray.length;

        const valueAsArray = value.split('').filter(c => c !== '');
        const valueSize = valueAsArray.length;

        const pairSize = keySize + valueSize;
        const pairSizeAsArray = String(pairSize).split('');

        // Store beginning of key in database content in hash index
        this.hashIndex.set(key, this.size);

        logger.trace(`Writing size of key-value pair: ${keySize + valueSize}B`);
        pairSizeAsArray.forEach(c => this.addChar(c));
        this.addSeparator();

        logger.trace(`Writing ${keySize} bytes key: ${key}`);
        keyAsArray.forEach(c => this.addChar(c));
        this.addSeparator();

        logger.trace(`Writing ${valueSize} bytes value: ${value}`);
        valueAsArray.forEach(c => this.addChar(c));
        this.addSeparator();

        logger.trace(`Key '${key}' successfully added to database.`);
    }

    private addChar(char: string) {
        if (char === this.separator) {
            throw new Error(`Cannot write separator '${this.separator}' as a value to the database!'`);
        }

        this.set(this.size, char.charCodeAt(0));
        this.size += 1;
    }

    private addSeparator() {
        this.set(this.size, this.separator.charCodeAt(0));
        this.size += 1;
    }

    public remove(key: string) {
        throw new Error('Not implemented!');
    }
}

export default BytesDatabase;