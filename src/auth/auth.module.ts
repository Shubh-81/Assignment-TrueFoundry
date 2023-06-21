import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GithubStrategy } from './github.strategy';

@Module({
  imports: [PassportModule, ConfigModule],
  providers: [GithubStrategy, ConfigService],
})
export class AuthModule {}
