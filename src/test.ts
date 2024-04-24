import { logger } from './logger';
import LogDatabase from './models/databases/LogDatabase';
import { DATA_DIR, SEPARATOR } from './constants';
import LineDatabase from './models/databases/LineDatabase';
import BytesDatabase from './models/databases/BytesDatabase';



export const testLogsDatabase = async () => {
    const db = new LogDatabase<string>(new LineDatabase(DATA_DIR, SEPARATOR));

    const key = 'test';

    await db.add(key, '0');
    let log = await db.get(key);
    logger.info(`Log entry: ${log?.toString() ?? null}`);
    
    await db.remove(key);
    log = await db.get(key);
    logger.info(`Log entry: ${log?.toString() ?? null}`);
}



export const testBytesDatabase = async () => {
    const db = new BytesDatabase(SEPARATOR);

    const key1 = 'test1';
    const key2 = 'test2';
    
    // Add two values
    db.add(key1, '1');
    db.add(key2, '2');
    logger.info(`Bytes DB: ${db.toString()}`);

    // Retrieve first value
    const value1 = await db.get(key1);
    logger.info(`Data for key '${key1}': ${value1 ?? null}`);

    // Retrieve second value
    const value2 = await db.get(key2);
    logger.info(`Data for key '${key2}': ${value2 ?? null}`);

    // Overwrite first value
    db.add(key1, '3');

    // Retrieve it
    const value3 = await db.get(key1);
    logger.info(`Data for key '${key1}': ${value3 ?? null}`);
}