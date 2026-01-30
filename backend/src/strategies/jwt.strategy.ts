import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService, @InjectRepository(User) private readonly userRepository: Repository<User>) {

        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => req.cookies?.['access_token'],
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET')!,
        });
    }

    async validate(payload: any) {
        const userId = await this.userRepository.findOne({ where: { id: payload.userId }, select: { id: true } });
        if (!userId)
            throw new NotFoundException();
        return userId;
    }
}