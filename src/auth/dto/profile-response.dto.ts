import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProfileResponseDto {
  @IsNumber()
  @IsNotEmpty()
  public userId: number;

  @IsString()
  @IsNotEmpty()
  public username: string;
}
