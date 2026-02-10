import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) { }

    async doesUserExist(userId: string): Promise<boolean> {
        const userExists = await this.userRepository.exists({ where: { id: userId } });
        if (!userExists) {
            throw new NotFoundException("User not found");
        }
        return userExists;
    }
    async returnUserPassAndId(userId: string): Promise<{ password: string, id: string }> {
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
