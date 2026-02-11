import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async findOrCreateGoogleUser(profile: any): Promise<User> {
        const { id, emails, name, photos } = profile;
        if (!emails || emails.length === 0) {
            throw new InternalServerErrorException('Google profile must include an email');
        }
        const email = emails[0].value;

        let user = await this.userRepository.findOne({
            where: [{ googleId: id }, { email }],
        });

        if (user) {
            if (!user.googleId) {
                user.googleId = id;
                user.firstName = name?.givenName;
                user.lastName = name?.familyName;
                user.imageUrl = photos?.[0]?.value;
                await this.userRepository.save(user);
            }
            return user;
        }

        user = this.userRepository.create({
            googleId: id,
            email,
            firstName: name?.givenName,
            lastName: name?.familyName,
            imageUrl: photos?.[0]?.value,
        });

        return this.userRepository.save(user);
    }

    async findById(id: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { id } });
    }

    async doesUserExist(userId: string): Promise<boolean> {
        const userExists = await this.userRepository.exists({ where: { id: userId } });
        if (!userExists) {
            throw new NotFoundException("User not found");
        }
        return userExists;
    }
    async returnUserPassAndId(userId: string): Promise<{ password: string | undefined, id: string }> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            select: { password: true, id: true },
        });
        if (!user) {
            throw new NotFoundException();
        }
        return { password: user.password, id: user.id };
    }

    async createAndReturnUserId(email: string, password: string): Promise<string> {
        const user = await this.userRepository.save({
            email,
            password,
        });
        if (!user) {
            throw new InternalServerErrorException();
        }
        return user.id;
    }
}



