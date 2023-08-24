import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from "passport-vkontakte";
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma.service';


@Injectable()
export class VkStrategy extends PassportStrategy(Strategy, 'vk') {
    constructor(private readonly authService: AuthService) {
        super({
            clientID: process.env.VKONTAKTE_APP_ID, 
            clientSecret: process.env.VKONTAKTE_APP_SECRET,
            callbackURL: "http://localhost:3000/auth/vk/callback",
        }, verify);
    }
}


const verify = function(accessToken, refreshToken, params, profile, done) {
    const authService = new AuthService(new JwtService(), new PrismaService());
    const id = profile.id.toString();
    const user = authService.createUserIfNot(id);
    const tokens = authService.getTokens(id);
    return done(null, tokens);
}
