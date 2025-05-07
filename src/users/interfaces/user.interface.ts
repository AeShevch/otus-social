export interface IUser {
  id: number;
  username: string;
  email: string;
  password?: string;
  created_at: Date;
  updated_at: Date;
} 

export interface IUserWithoutPassword extends Omit<IUser, 'password'> {}