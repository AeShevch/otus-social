import type { IProfile } from '@otus-social/profiles/interfaces/profile.interface';

export class ProfileModel implements IProfile {
  public id: number;
  public user_id: number;
  public first_name?: string;
  public last_name?: string;
  public birth_date?: Date;
  public gender?: string;
  public interests?: string[];
  public city?: string;

  constructor(partial: Partial<ProfileModel>) {
    Object.assign(this, partial);
  }

  public static fromDatabase(dbProfile: IProfile): ProfileModel {
    return new ProfileModel({
      id: dbProfile.id,
      user_id: dbProfile.user_id,
      first_name: dbProfile.first_name,
      last_name: dbProfile.last_name,
      birth_date: dbProfile.birth_date,
      gender: dbProfile.gender,
      interests: dbProfile.interests,
      city: dbProfile.city,
    });
  }
}
