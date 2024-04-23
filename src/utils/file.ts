import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const fsCreateDir = promisify(fs.mkdir);
const fsReadDir = promisify(fs.readdir);
const fsDeleteDir = promisify(fs.rmdir);
const fsReadFile = promisify(fs.readFile);
const fsDeleteFile = promisify(fs.rm);
const fsAppendFile = promisify(fs.appendFile);
const fsWriteFile = promisify(fs.writeFile);

export const doesFileExist = (filepath: string) => {
    return fs.existsSync(filepath);
}

export const readDir = async (dir: string) => {
    return fsReadDir(dir);
}

export const deleteDir = async (dir: string) => {
    return fsDeleteDir(dir);
}

export const readFile = async (filepath: string) => {
    return fsReadFile(filepath, { encoding: 'utf-8' });
}

export const createFile = async (filepath: string) => {
    const dir = path.dirname(filepath);
    await fsCreateDir(dir, { recursive: true });
    return fsWriteFile(filepath, '', { encoding: 'utf-8' });
}

export const appendToFile = async (filepath: string, data: string) => {
    if (!doesFileExist(filepath)) {
        await createFile(filepath);
    }
    return fsAppendFile(filepath, data, { encoding: 'utf-8' });
}

export const deleteFile = async (filepath: string) => {
    return fsDeleteFile(filepath);
}