import { Injectable } from '@nestjs/common';

import type { IRegisterData } from '@otus-social/auth/interfaces/register-data.interface';
import { DatabaseService } from '@otus-social/database/database.service';
import { SQL } from '@otus-social/database/sql';
import type { IUser } from '@otus-social/users/interfaces/user.interface';
import { UserModel } from '@otus-social/users/models/user.model';

@Injectable()
export class UserRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  public async findById(id: number): Promise<UserModel | null> {
    const result = await this.databaseService
      .getPool()
      .query<IUser>(SQL.queries.findUserById, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return UserModel.fromDatabase(result.rows[0]);
  }

  public async findByUsername(username: string): Promise<UserModel | null> {
    const result = await this.databaseService
      .getPool()
      .query<IUser>(SQL.queries.findUserByUsername, [username]);

    if (result.rows.length === 0) {
      return null;
    }

    return UserModel.fromDatabase(result.rows[0]);
  }

  public async findByEmail(email: string): Promise<UserModel | null> {
    const result = await this.databaseService
      .getPool()
      .query<IUser>(SQL.queries.findUserByEmail, [email]);

    if (result.rows.length === 0) {
      return null;
    }

    return UserModel.fromDatabase(result.rows[0]);
  }

  public async create(
    userData: IRegisterData,
    hashedPassword: string,
  ): Promise<UserModel> {
    const result = await this.databaseService
      .getPool()
      .query<IUser>(SQL.queries.createUser, [
        userData.username,
        userData.email,
        hashedPassword,
        userData.firstName,
        userData.lastName,
        userData.birthDate,
        userData.gender,
        userData.interests,
        userData.city,
      ]);

    return UserModel.fromDatabase(result.rows[0]);
  }
}
