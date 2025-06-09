import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '@otus-social/auth/auth.module';
import { DatabaseModule } from '@otus-social/database/database.module';
import { ProfilesModule } from '@otus-social/profiles/profiles.module';
import { UsersModule } from '@otus-social/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    ProfilesModule,
  ],
})
export class AppModule {}
