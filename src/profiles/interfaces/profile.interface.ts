export interface IProfile {
  id: number;
  user_id: number;
  first_name?: string;
  last_name?: string;
  birth_date?: Date;
  gender?: string;
  interests?: string[];
  city?: string;
}
