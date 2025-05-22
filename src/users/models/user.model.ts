import type {
  IUser,
  IUserWithoutPassword,
} from '@otus-social/users/interfaces/user.interface';

export class UserModel implements IUser {
  public id: number;
  public username: string;
  public email: string;
  public password?: string;
  public created_at: Date;
  public updated_at: Date;
  public first_name: string;
  public last_name: string;
  public birth_date: Date;
  public gender: string;
  public interests: string[];
  public city: string;

  constructor(partial: Partial<UserModel>) {
    Object.assign(this, partial);
  }

  public static fromDatabase(dbUser: IUser): UserModel {
    return new UserModel({
      id: dbUser.id,
      username: dbUser.username,
      email: dbUser.email,
      password: dbUser.password,
      created_at: dbUser.created_at,
      updated_at: dbUser.updated_at,
      first_name: dbUser.first_name,
      last_name: dbUser.last_name,
      birth_date: dbUser.birth_date,
      gender: dbUser.gender,
      interests: dbUser.interests,
      city: dbUser.city,
    });
  }

  public toResponse(): IUserWithoutPassword {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      created_at: this.created_at,
      updated_at: this.updated_at,
      first_name: this.first_name,
      last_name: this.last_name,
      birth_date: this.birth_date,
      gender: this.gender,
      interests: this.interests,
      city: this.city,
    };
  }
}
