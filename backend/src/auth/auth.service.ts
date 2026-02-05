import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { GeneralAuthDto } from './dto/general-auth.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) { }

  async signup(
    dto: GeneralAuthDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    // hashing password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userRepository.save({
      email: dto.email,
      password: hashedPassword,
    });
    if (!user) {
      throw new InternalServerErrorException();
    }

    return this.loginWithUser(user);
  }

  async login(
    dto: GeneralAuthDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      select: { id: true, password: true },
    });
    if (!user) {
      throw new NotFoundException();
    }
    const isGood = await bcrypt.compare(dto.password, user.password!);
    if (!isGood) throw new InternalServerErrorException();

    return this.loginWithUser(user);
  }

  async loginWithUser(
    user: Partial<User>,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const access_token = this.jwtService.sign({ userId: user.id });
    const refresh_token = this.jwtService.sign(
      { userId: user.id },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );

    return { access_token, refresh_token };
  }

  async createTokenForRefresh(user: User): Promise<string> {
    const token = await this.jwtService.signAsync({ userId: user.id });
    return token;
  }
}
