import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async findOrCreateGoogleUser(profile: any): Promise<User> {
        const { id, emails, name, photos } = profile;
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
}
