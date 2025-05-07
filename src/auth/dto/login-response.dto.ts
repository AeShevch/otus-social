import { IsNotEmpty, IsString } from 'class-validator';

export class LoginResponseDto {
  @IsString()
  @IsNotEmpty()
  public access_token: string;
}
