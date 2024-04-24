import { ENV } from './config'; // Do NOT remove!
import { logger } from './logger';
import { testLogsDatabase, testBytesDatabase } from './test';



const execute = async () => {
    logger.debug(`Environment: ${ENV}`);
    
    await testLogsDatabase();
    await testBytesDatabase();
}



execute()
    .catch((err) => {
        logger.fatal(err, `Uncaught error:`);
    });



export default execute;