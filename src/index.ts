import { ENV } from './config'; // Do NOT remove!
import { logger } from './logger';
import LogDatabase from './models/databases/LogDatabase';
import { DATA_DIR } from './constants';



const execute = async () => {
    logger.debug(`Environment: ${ENV}`);

    const db = new LogDatabase(DATA_DIR);

    db.has('test');
}



// Run server
execute()
    .catch((err) => {
        logger.fatal(err, `Uncaught error:`);
    });



export default execute;