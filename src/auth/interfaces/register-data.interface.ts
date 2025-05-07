export interface IRegisterData {
  username: string;
  email: string;
  password: string;
}

export interface IRegisterResponse {
  id: number;
  username: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}
