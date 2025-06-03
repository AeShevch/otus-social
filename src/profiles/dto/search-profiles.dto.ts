import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SearchProfilesDto {
  @ApiProperty({
    description: 'Part of first name to search',
    example: 'Const',
  })
  @IsNotEmpty()
  @IsString()
  public first_name: string;

  @ApiProperty({
    description: 'Part of last name to search',
    example: 'Osi',
  })
  @IsNotEmpty()
  @IsString()
  public last_name: string;
}
