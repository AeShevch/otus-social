import type { IProfileSearch } from '@otus-social/profiles/interfaces/profile-search.interface';

export class ProfileSearchModel implements IProfileSearch {
  public id: number;
  public first_name?: string;
  public second_name?: string;
  public birthdate?: Date;
  public biography?: string;
  public city?: string;

  constructor(partial: Partial<ProfileSearchModel>) {
    Object.assign(this, partial);
  }

  public static fromDatabase(dbProfile: IProfileSearch): ProfileSearchModel {
    return new ProfileSearchModel({
      id: dbProfile.id,
      first_name: dbProfile.first_name,
      second_name: dbProfile.second_name,
      birthdate: dbProfile.birthdate,
      biography: dbProfile.biography,
      city: dbProfile.city,
    });
  }
}
