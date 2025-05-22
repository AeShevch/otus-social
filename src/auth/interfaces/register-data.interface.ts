export interface IRegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  gender?: string;
  interests?: string[];
  city?: string;
}

export interface IRegisterResponse {
  id: number;
  username: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}
