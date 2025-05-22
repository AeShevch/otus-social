import { loadSqlFile } from '@otus-social/database/sql/queries-loader';
import { createTablesQueries } from '@otus-social/database/sql/tables';

export const SQL = {
  tables: createTablesQueries,
  queries: {
    createUser: loadSqlFile('users/create_user.sql'),
    findUserByEmail: loadSqlFile('users/find_user_by_email.sql'),
    findUserByUsername: loadSqlFile('users/find_user_by_username.sql'),
    findUserById: loadSqlFile('users/find_user_by_id.sql'),

    createProfile: loadSqlFile('profiles/create_profile.sql'),
    findProfileByUserId: loadSqlFile('profiles/find_profile_by_user_id.sql'),
  },
};
