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
    });
  }

  public toResponse(): IUserWithoutPassword {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
