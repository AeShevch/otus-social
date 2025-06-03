import { SqlLoader } from '@otus-social/database/sql/queries-loader';
import { createTablesQueries } from '@otus-social/database/sql/tables';

export const SQL = {
  tables: createTablesQueries,
  queries: {
    createUser: SqlLoader.load('users/create_user.sql'),
    findUserByEmail: SqlLoader.load('users/find_user_by_email.sql'),
    findUserByUsername: SqlLoader.load('users/find_user_by_username.sql'),
    findUserById: SqlLoader.load('users/find_user_by_id.sql'),

    createProfile: SqlLoader.load('profiles/create_profile.sql'),
    findProfileByUserId: SqlLoader.load('profiles/find_profile_by_user_id.sql'),
    searchProfiles: SqlLoader.load('profiles/search_profiles.sql'),
  },
};
