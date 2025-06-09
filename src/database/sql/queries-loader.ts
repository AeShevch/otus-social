import { readFileSync } from 'fs';
import { existsSync } from 'fs';
import { join } from 'path';

export class SqlLoader {
  private static sqlDir: string;

  public static load(fileName: string): string {
    const filePath = join(this.getSqlDir(), fileName);

    try {
      return readFileSync(filePath, 'utf-8');
    } catch (error) {
      if (error instanceof Error && 'code' in error) {
        const systemError = error as NodeJS.ErrnoException;

        switch (systemError.code) {
          case 'ENOENT':
            throw new ReferenceError(`SQL file not found: ${filePath}`);
          case 'EACCES':
            throw new Error(`Access denied reading SQL file: ${filePath}`);
          case 'EISDIR':
            throw new TypeError(
              `Expected file but found directory: ${filePath}`,
            );
        }
      }

      throw new Error(
        `Failed to read SQL file: ${filePath}. ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private static getSqlDir(): string {
    if (this.sqlDir) {
      return this.sqlDir;
    }

    const devPath = join(process.cwd(), 'src', 'database', 'sql', 'queries');
    if (existsSync(devPath)) {
      this.sqlDir = devPath;
      return devPath;
    }

    const prodPath = join(process.cwd(), 'dist', 'database', 'sql', 'queries');
    if (existsSync(prodPath)) {
      this.sqlDir = prodPath;
      return prodPath;
    }

    throw new ReferenceError(
      'SQL queries directory not found. Expected paths: src/database/sql/queries or dist/database/sql/queries',
    );
  }
}
