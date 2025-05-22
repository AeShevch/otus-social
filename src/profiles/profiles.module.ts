import { Module } from '@nestjs/common';

import { DatabaseModule } from '@otus-social/database/database.module';
import { ProfilesController } from '@otus-social/profiles/profiles.controller';
import { ProfilesService } from '@otus-social/profiles/profiles.service';
import { ProfileRepository } from '@otus-social/profiles/repositories/profile.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [ProfilesController],
  providers: [ProfilesService, ProfileRepository],
  exports: [ProfilesService],
})
export class ProfilesModule {}
