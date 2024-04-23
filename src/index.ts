import { ENV } from './config'; // Do NOT remove!
import { logger } from './logger';
import LogDatabase from './models/databases/LogDatabase';
import { DATA_DIR } from './constants';
import LineDatabase from './models/databases/LineDatabase';



const execute = async () => {
    logger.debug(`Environment: ${ENV}`);

    const db = new LogDatabase<string>(new LineDatabase(DATA_DIR));

    await db.add('test', '0');
    let log = await db.get('test');
    logger.info(`Log entry: ${log?.toString() ?? null}`);
    
    await db.remove('test');
    log = await db.get('test');
    logger.info(`Log entry: ${log?.toString() ?? null}`);
}



// Run server
execute()
    .catch((err) => {
        logger.fatal(err, `Uncaught error:`);
    });



export default execute;