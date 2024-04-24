import { ENV } from './config'; // Do NOT remove!
import { logger } from './logger';
import LogDatabase from './models/databases/LogDatabase';
import { DATA_DIR, SEPARATOR } from './constants';
import LineDatabase from './models/databases/LineDatabase';
import BytesDatabase from './models/databases/BytesDatabase';



// Test databases
const testLogsDatabase = async () => {
    const logsDatabase = new LogDatabase<string>(new LineDatabase(DATA_DIR, SEPARATOR));

    const key = 'test';

    await logsDatabase.add(key, '0');
    let log = await logsDatabase.get(key);
    logger.info(`Log entry: ${log?.toString() ?? null}`);
    
    await logsDatabase.remove(key);
    log = await logsDatabase.get(key);
    logger.info(`Log entry: ${log?.toString() ?? null}`);
}



const testBytesDatabase = async () => {
    const bytesDb = new BytesDatabase(SEPARATOR);

    const key1 = 'test1';
    const key2 = 'test2';
    
    bytesDb.add(key1, '1');
    bytesDb.add(key2, '2');
    logger.info(`Bytes DB: ${bytesDb.toString()}`);

    const value1 = await bytesDb.get(key1);
    logger.info(`Bytes for key '${key1}': ${value1 ?? null}`);

    const value2 = await bytesDb.get(key2);
    logger.info(`Bytes for key '${key2}': ${value2 ?? null}`);
}



const execute = async () => {
    logger.debug(`Environment: ${ENV}`);
    
    // await testLogsDatabase();
    await testBytesDatabase();
}



// Run server
execute()
    .catch((err) => {
        logger.fatal(err, `Uncaught error:`);
    });



export default execute;