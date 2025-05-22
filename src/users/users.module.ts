import { Module } from '@nestjs/common';

import { DatabaseModule } from '@otus-social/database/database.module';
import { UserRepository } from '@otus-social/users/repositories/user.repository';
import { UsersController } from '@otus-social/users/users.controller';
import { UsersService } from '@otus-social/users/users.service';

@Module({
  imports: [DatabaseModule],
  providers: [UsersService, UserRepository],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
