import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';

import * as argon2 from 'argon2';


@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, 
    private readonly prismaService: PrismaService
  ) {}

  async getTokens(userId: string) {
    const access_token = await this.jwtService.signAsync({
        sub: userId
    }, {
        secret: process.env.JWT_SECRET,
        expiresIn: '1h'
    });
    const refresh_token = await this.jwtService.signAsync({
        sub: userId
    }, {
        secret: process.env.JWT_SECRET,
        expiresIn: '14d'
    });

    await this.updateTokens(userId, access_token, refresh_token);

    return {
      access_token,
      refresh_token
    };
  }

  async updateTokens(userId: string, access_token: string, refresh_token: string) {
    await this.prismaService.authToken.create({
      data: {
        userId: userId,
        token: access_token
      }
    });

    const token = await this.hash(refresh_token);
    await this.prismaService.authUser.update({
      where: {
        id: userId
      },
      data: {
        refreshToken: token
      }
    })
  }

  async createUserIfNot(userId: string) {
    await this.prismaService.authUser.findFirstOrThrow({ 
      where: { 
        id: userId 
      } 
    }).catch(async e => {
      await this.prismaService.authUser.create({ 
        data: {
          id: userId,
          refreshToken: null
        } 
      });
    });
  }

  hash(data: string) {
    return argon2.hash(data);
  }

  verify(hash: string, plain: string) {
    return argon2.verify(hash, plain)
  }

  async logout(userId: string) {
    await this.prismaService.authUser.update({
      where: {
        id: userId
      },
      data: {
        refreshToken: null
      }
    });
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prismaService.authUser.findFirst({
      where: {
        id: userId
      }
    });
    
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }
    console.log(user.refreshToken)
    if (!(await this.verify(user.refreshToken, refreshToken))) { 
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.getTokens(userId);
    return tokens;
  }
  
}
