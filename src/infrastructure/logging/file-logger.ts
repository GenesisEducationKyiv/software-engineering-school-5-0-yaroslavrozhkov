import * as fs from 'fs';
import * as path from 'path';

const logDir = path.resolve(__dirname, '../../logs');
const logFilePath = path.join(logDir, 'weather.log');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

export const fileLogger = (msg: string) => {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFilePath, `${timestamp} - ${msg}\n`);
};