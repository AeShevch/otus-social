export interface IValidatedUser {
  userId: number;
  username: string;
}

export interface IJwtResponse {
  user_id: number;
  access_token: string;
}
