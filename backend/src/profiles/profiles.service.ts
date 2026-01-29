import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfilesService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) { }

    async getOwnProfile(myId: string) {
        const user = await this.userRepository.findOne({ where: { id: myId }, select: { id: true, email: true } })
        if (user) {
            return user;
        }
        return null;
    }
}
