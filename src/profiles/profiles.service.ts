import { Injectable } from '@nestjs/common';

import type { IRegisterData } from '@otus-social/auth/interfaces/register-data.interface';
import type { ProfileSearchModel } from '@otus-social/profiles/models/profile-search.model';
import type { ProfileModel } from '@otus-social/profiles/models/profile.model';
import { ProfileRepository } from '@otus-social/profiles/repositories/profile.repository';

@Injectable()
export class ProfilesService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  public createProfile(
    userId: number,
    profileData: Omit<
      IRegisterData,
      'username' | 'email' | 'password' | 'confirmPassword'
    >,
  ): Promise<ProfileModel> {
    return this.profileRepository.create(userId, profileData);
  }

  public getProfileByUserId(userId: number): Promise<ProfileModel | null> {
    return this.profileRepository.findByUserId(userId);
  }

  public searchProfiles(
    firstName: string,
    lastName: string,
  ): Promise<ProfileSearchModel[]> {
    return this.profileRepository.searchProfiles(firstName, lastName);
  }
}
