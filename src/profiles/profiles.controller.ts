import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
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

import { ProfileResponseDto } from '@otus-social/profiles/dto';
import { ProfilesService } from '@otus-social/profiles/profiles.service';

@ApiTags('Profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

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
  @Get('user/:userId')
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
