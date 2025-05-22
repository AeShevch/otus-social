import { readFileSync } from 'fs';
import { existsSync } from 'fs';
import { join } from 'path';

function getSqlDir(): string {
  const devPath = join(process.cwd(), 'src', 'database', 'sql', 'queries');
  if (existsSync(devPath)) {
    return devPath;
  }

  const prodPath = join(process.cwd(), 'dist', 'database', 'sql', 'queries');
  if (existsSync(prodPath)) {
    return prodPath;
  }

  throw new Error('SQL queries directory not found');
}

const SQL_DIR = getSqlDir();

export function loadSqlFile(fileName: string): string {
  const filePath = join(SQL_DIR, fileName);

  try {
    return readFileSync(filePath, 'utf-8');
  } catch {
    throw new Error(`Failed to read SQL file: ${filePath}`);
  }
}
