import { ENV } from './config'; // Do NOT remove!
import { logger } from './logger';
import LogDatabase from './models/databases/LogDatabase';
import { DATA_DIR } from './constants';
import LogParser from './models/logs/LogParser';



const execute = async () => {
    logger.debug(`Environment: ${ENV}`);

    const db = new LogDatabase(DATA_DIR);

    await db.set('test', '0');
    const line = await db.get('test');
    
    if (line) {
        const parser = new LogParser();
        const log = parser.parse(line);
        logger.debug(log.toString());
    }
}



// Run server
execute()
    .catch((err) => {
        logger.fatal(err, `Uncaught error:`);
    });



export default execute;