import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import {
  ProfileResponseDto,
  ProfileSearchResponseDto,
  SearchProfilesDto,
} from '@otus-social/profiles/dto';
import { ProfilesService } from '@otus-social/profiles/profiles.service';

@ApiTags('Profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @ApiOperation({ summary: 'Search user profiles' })
  @ApiResponse({
    status: 200,
    description: 'Successful profile search',
    type: [ProfileSearchResponseDto],
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 500, description: 'Server error' })
  @ApiResponse({ status: 503, description: 'Server error' })
  @Get('search')
  public async searchProfiles(
    @Query() searchDto: SearchProfilesDto,
  ): Promise<ProfileSearchResponseDto[]> {
    const profiles = await this.profilesService.searchProfiles(
      searchDto.first_name,
      searchDto.last_name,
    );

    return plainToInstance(ProfileSearchResponseDto, profiles);
  }

  @ApiOperation({ summary: 'Get user profile by User ID' })
  @ApiResponse({
    status: 200,
    description: 'User profile data',
    type: ProfileResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':userId')
  public async getProfileByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<ProfileResponseDto> {
    const profileModel = await this.profilesService.getProfileByUserId(userId);

    if (!profileModel) {
      throw new NotFoundException('Profile not found for the given user ID');
    }

    return plainToInstance(ProfileResponseDto, profileModel);
  }
}
