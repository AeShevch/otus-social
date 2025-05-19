import { loadSqlFile } from '@otus-social/database/sql/queries-loader';

export const createTablesQueries = {
  users: loadSqlFile('create_users_table.sql'),
};
