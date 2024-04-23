import fs from 'fs';
import { promisify } from 'util';

const fsReadDir = promisify(fs.readdir);
const fsDeleteDir = promisify(fs.rmdir);
const fsReadFile = promisify(fs.readFile);
const fsDeleteFile = promisify(fs.rm);
const fsAppendFile = promisify(fs.appendFile);
const fsWriteFile = promisify(fs.writeFile);

export const readDir = async (dir: string) => {
    return fsReadDir(dir);
}

export const deleteDir = async (dir: string) => {
    return fsDeleteDir(dir);
}

export const doesFileExist = (filepath: string) => {
    return fs.existsSync(filepath);
}

export const readFile = async (filepath: string) => {
    return fsReadFile(filepath, { encoding: 'utf-8' });
}

export const createFile = async (filepath: string) => {
    return fsWriteFile(filepath, '', { encoding: 'utf-8' });
}

export const appendToFile = async (filepath: string, data: string) => {
    return fsAppendFile(filepath, data, { encoding: 'utf-8' });
}

export const deleteFile = async (filepath: string) => {
    return fsDeleteFile(filepath);
}