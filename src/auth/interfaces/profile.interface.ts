export interface IProfile {
  userId: number;
  username: string;
  firstName?: string;
  lastName?: string;
  birthDate?: Date;
  gender?: string;
  interests?: string[];
  city?: string;
}
