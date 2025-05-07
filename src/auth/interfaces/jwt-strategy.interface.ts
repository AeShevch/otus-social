export interface IJwtPayload {
  sub: number;
  username: string;
}

export interface IValidatedPayload {
  userId: number;
  username: string;
}
