import { Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccessTokenGuard } from './guards/access.guard';
import { AuthService } from './auth/auth.service';
import { RefreshTokenGuard } from './guards/refresh.guard';

@Controller('auth')
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  getHello(@Req() req) {
    return req.user;
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  async logout(@Req() req) {
    await this.authService.logout(req.user['sub']);
  }

  @UseGuards(AuthGuard('local'))
  @Post('local')
  async login(@Req() req) {
    return await req.user;
  }

  @Get('google')
  @UseGuards(AuthGuard("google"))
  async googleAuth(@Req() req) {}

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleCallback(@Req() req) {
    return await req.user;
  }

  @Get('vk')
  @UseGuards(AuthGuard('vk'))
  async vkAuth(@Req() req) {}

  @Get('vk/callback')
  @UseGuards(AuthGuard('vk'))
  async vkCallback(@Req() req) {
    return await req.user;
  }

  @UseGuards(AccessTokenGuard)
  @Get('user')
  async getUser(@Req() req) {
    return await req.user['sub'];
  }
}
