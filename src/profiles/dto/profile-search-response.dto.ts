import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class ProfileSearchResponseDto {
  @ApiProperty({
    description: 'User identifier',
    example: 'e4d2e6b0-cde2-42c5-aac3-0b8316f21e58',
  })
  @Expose()
  public id: string;

  @ApiProperty({
    description: 'First name',
    example: 'John',
  })
  @Expose()
  public first_name: string;

  @ApiProperty({
    description: 'Last name',
    example: 'Doe',
  })
  @Expose()
  public second_name: string;

  @ApiProperty({
    description: 'Birth date',
    example: '2017-02-01',
    format: 'date',
  })
  @Expose()
  @Transform(
    ({ value }: { value: Date }) =>
      new Date(value)?.toISOString()?.split('T')[0],
  )
  public birthdate: string;

  @ApiProperty({
    description: 'Biography and interests',
    example: 'Hobbies, interests, etc.',
  })
  @Expose()
  public biography: string;

  @ApiProperty({
    description: 'City',
    example: 'Moscow',
  })
  @Expose()
  public city: string;
}
