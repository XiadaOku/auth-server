import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';
import { LocalStrategy } from './strategies/local/local.service';
import { GoogleStrategy } from './strategies/google/google.service';
import { AuthService } from './auth/auth.service';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies/jwt/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { VkStrategy } from './strategies/vk/vk.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET
    })
  ],
  controllers: [AppController],
  providers: [PrismaService, AuthService, AccessTokenStrategy, RefreshTokenStrategy, LocalStrategy, GoogleStrategy, VkStrategy],
})
export class AppModule {}
