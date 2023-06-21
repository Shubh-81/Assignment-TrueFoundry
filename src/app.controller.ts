import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  @Get('auth/github')
  @UseGuards(AuthGuard('github'))
  githubAuth() {}

  @Get('auth/github/callback')
  @UseGuards(AuthGuard('github'))
  githubAuthCallback() {}

  @Get()
  getHello(): string {
    return 'Hello, World!';
  }
}
