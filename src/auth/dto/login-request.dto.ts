import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
  @IsNotEmpty()
  @IsString()
  public username: string;

  @IsNotEmpty()
  @IsString()
  public password: string;
}
