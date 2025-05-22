import { loadSqlFile } from '@otus-social/database/sql/queries-loader';

export const createTablesQueries = {
  users: loadSqlFile('users/create_users_table.sql'),
  profiles: loadSqlFile('profiles/create_profiles_table.sql'),
};
