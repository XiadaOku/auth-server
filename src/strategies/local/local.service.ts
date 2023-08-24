import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma.service';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
      private readonly authService: AuthService,
      private readonly prismaService: PrismaService
    ) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.createUserIfNot(username);
    const local = await this.createLocalIfNot(username, password);

    if (!(await this.authService.verify(local.password, password))) {
      throw new BadRequestException('Password is incorrect');
    }

    const tokens = await this.authService.getTokens(username);
    return tokens;
  }

  async createLocalIfNot(username: string, password: string) {
    var local = await this.prismaService.local.findFirst({
      where: {
        userId: username
      }
    })

    if (!local) {
      local = await this.prismaService.local.create({
        data: {
          userId: username,
          password: await this.authService.hash(password)
        }
      });
    }
    
    return local;
  }
}
