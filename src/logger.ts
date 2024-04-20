import pino from 'pino';
import { PROD } from './config';

const DEV_OPTIONS = {
    level: 'debug',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
        },
    },
};

const PROD_OPTIONS = {
    level: 'debug',
};

export const logger = pino(PROD ? PROD_OPTIONS : DEV_OPTIONS);