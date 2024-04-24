import { ENV } from './config'; // Do NOT remove!
import { logger } from './logger';
import LogDatabase from './models/databases/LogDatabase';
import { DATA_DIR } from './constants';
import LineDatabase from './models/databases/LineDatabase';
import BytesDatabase from './models/databases/BytesDatabase';



// Test databases
const testLogsDatabase = async () => {
    const logsDatabase = new LogDatabase<string>(new LineDatabase(DATA_DIR));

    const key = 'test';

    await logsDatabase.add(key, '0');
    let log = await logsDatabase.get(key);
    logger.info(`Log entry: ${log?.toString() ?? null}`);
    
    await logsDatabase.remove(key);
    log = await logsDatabase.get(key);
    logger.info(`Log entry: ${log?.toString() ?? null}`);
}



const testBytesDatabase = async () => {
    const bytesDb = new BytesDatabase();

    const key = 'test';
    
    bytesDb.add(key, '0');
    logger.info(`Bytes DB: ${bytesDb.toString()}`);

    const value = await bytesDb.get(key);
    logger.info(`Bytes for key '${key}': ${value ?? null}`);
}



const execute = async () => {
    logger.debug(`Environment: ${ENV}`);
    
    await testLogsDatabase();
    // await testBytesDatabase();
}



// Run server
execute()
    .catch((err) => {
        logger.fatal(err, `Uncaught error:`);
    });



export default execute;