import { ENV } from './config'; // Do NOT remove!
import { logger } from './logger';



const execute = async () => {
    logger.debug(`Environment: ${ENV}`);
}



// Run server
execute()
    .catch((err) => {
        logger.fatal(err, `Uncaught error:`);
    });



export default execute;