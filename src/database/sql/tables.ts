import { SqlLoader } from '@otus-social/database/sql/queries-loader';

export const createTablesQueries = {
  users: SqlLoader.load('users/create_users_table.sql'),
  profiles: SqlLoader.load('profiles/create_profiles_table.sql'),
};
