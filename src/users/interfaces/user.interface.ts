export interface IUser {
  id: number;
  username: string;
  email: string;
  password?: string;
  created_at: Date;
  updated_at: Date;
  first_name?: string;
  last_name?: string;
  birth_date?: Date;
  gender?: string;
  interests?: string[];
  city?: string;
}

export interface IUserWithoutPassword extends Omit<IUser, 'password'> {}
