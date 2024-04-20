import { loadEnvironment } from './utils/env';
import { Environment } from './types';

// Environment
export const ENV = loadEnvironment();
export const DEV = ENV === Environment.Development;
export const PROD = ENV === Environment.Production;