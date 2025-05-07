import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProfileResponseDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  username: string;
}
