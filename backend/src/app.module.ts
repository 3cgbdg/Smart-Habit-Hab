import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProfilesModule } from './profiles/profiles.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { QuotesModule } from './quotes/quotes.module';
import { ExperimentsModule } from './experiments/experiments.module';
  import { HabitsModule } from './habits/habits.module';
import { HabitLogsModule } from './habit_logs/habit_logs.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'smart_habit',
      autoLoadEntities: true,
      synchronize: false,
      dropSchema: false,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '15m' }
      }),
    }),
    UsersModule,
    ExperimentsModule,
    HabitsModule,
    AuthModule,
    ProfilesModule,
    QuotesModule,
    HabitLogsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
