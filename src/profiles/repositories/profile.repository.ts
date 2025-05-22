import { Injectable } from '@nestjs/common';

import type { IRegisterData } from '@otus-social/auth/interfaces/register-data.interface';
import { DatabaseService } from '@otus-social/database/database.service';
import { SQL } from '@otus-social/database/sql';
import type { IProfile } from '@otus-social/profiles/interfaces/profile.interface';
import { ProfileModel } from '@otus-social/profiles/models/profile.model';

@Injectable()
export class ProfileRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  public async create(
    userId: number,
    profileData: Omit<
      IRegisterData,
      'username' | 'email' | 'password' | 'confirmPassword'
    >,
  ): Promise<ProfileModel> {
    const result = await this.databaseService
      .getPool()
      .query<IProfile>(SQL.queries.createProfile, [
        userId,
        profileData.firstName,
        profileData.lastName,
        profileData.birthDate,
        profileData.gender,
        profileData.interests,
        profileData.city,
      ]);

    return ProfileModel.fromDatabase(result.rows[0]);
  }

  public async findByUserId(userId: number): Promise<ProfileModel | null> {
    const result = await this.databaseService
      .getPool()
      .query<IProfile>(SQL.queries.findProfileByUserId, [userId]);

    if (result.rows.length === 0) {
      return null;
    }

    return ProfileModel.fromDatabase(result.rows[0]);
  }
}
