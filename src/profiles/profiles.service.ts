import { Injectable } from '@nestjs/common';

import type { IRegisterData } from '@otus-social/auth/interfaces/register-data.interface';
import type { ProfileModel } from '@otus-social/profiles/models/profile.model';
import { ProfileRepository } from '@otus-social/profiles/repositories/profile.repository';

@Injectable()
export class ProfilesService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  public async createProfile(
    userId: number,
    profileData: Omit<
      IRegisterData,
      'username' | 'email' | 'password' | 'confirmPassword'
    >,
  ): Promise<ProfileModel> {
    return this.profileRepository.create(userId, profileData);
  }

  public async getProfileByUserId(
    userId: number,
  ): Promise<ProfileModel | null> {
    return this.profileRepository.findByUserId(userId);
  }
}
