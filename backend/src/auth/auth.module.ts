import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';


@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule { }
