import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { createMockUser } from 'src/__test-utils__/factories';

// Mock google-auth-library at module level so dynamic import resolves the mock
jest.mock('google-auth-library', () => ({
  OAuth2Client: jest.fn().mockImplementation(() => ({
    verifyIdToken: jest.fn().mockRejectedValue(new Error('invalid token')),
  })),
}));

const mockUserRepository = () => ({ findOne: jest.fn() });
const mockUsersService = () => ({
  createAndReturnUserId: jest.fn(),
  findByEmailWithPassword: jest.fn(),
  doesUserExist: jest.fn(),
  findOrCreateGoogleUser: jest.fn(),
});
const mockJwtService = () => ({
  signAsync: jest.fn(),
  decode: jest.fn(),
});
const mockConfigService = () => ({
  get: jest.fn().mockImplementation((key: string) => {
    const config: Record<string, string> = {
      JWT_REFRESH_SECRET: 'refresh_secret',
      GOOGLE_CLIENT_ID: 'google-client-id',
      NODE_ENV: 'test',
    };
    return config[key];
  }),
});

describe('AuthService', () => {
  let service: AuthService;
  let usersService: ReturnType<typeof mockUsersService>;
  let jwtService: ReturnType<typeof mockJwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useFactory: mockUserRepository },
        { provide: UsersService, useFactory: mockUsersService },
        { provide: JwtService, useFactory: mockJwtService },
        { provide: ConfigService, useFactory: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => jest.clearAllMocks());

  // ─── signup ───────────────────────────────────────────────────────────────

  describe('signup', () => {
    it('should hash password and return access and refresh tokens', async () => {
      usersService.createAndReturnUserId.mockResolvedValue('user-id-1');
      jwtService.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      const result = await service.signup({ email: 'a@b.com', password: 'Password1' });

      expect(usersService.createAndReturnUserId).toHaveBeenCalled();
      expect(result).toEqual({ access_token: 'access-token', refresh_token: 'refresh-token' });
    });
  });

  // ─── login ────────────────────────────────────────────────────────────────

  describe('login', () => {
    it('should return tokens for valid credentials', async () => {
      const hashed = await bcrypt.hash('Password1', 10);
      usersService.findByEmailWithPassword.mockResolvedValue({ id: 'user-1', password: hashed });
      jwtService.signAsync.mockResolvedValueOnce('access').mockResolvedValueOnce('refresh');

      const result = await service.login({ email: 'a@b.com', password: 'Password1' });

      expect(result).toEqual({ access_token: 'access', refresh_token: 'refresh' });
    });

    it('should throw Unauthorized for invalid password', async () => {
      const hashed = await bcrypt.hash('CorrectPass1', 10);
      usersService.findByEmailWithPassword.mockResolvedValue({ id: 'user-1', password: hashed });

      await expect(service.login({ email: 'a@b.com', password: 'WrongPass1' })).rejects.toThrow(
        new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED),
      );
    });
  });

  // ─── createTokenForAccess ─────────────────────────────────────────────────

  describe('createTokenForAccess', () => {
    it('should return a signed access JWT', async () => {
      jwtService.signAsync.mockResolvedValue('access-jwt');

      const result = await service.createTokenForAccess('user-123');

      expect(jwtService.signAsync).toHaveBeenCalledWith({ userId: 'user-123' });
      expect(result).toBe('access-jwt');
    });
  });

  // ─── createTokenForRefresh ────────────────────────────────────────────────

  describe('createTokenForRefresh', () => {
    it('should return a signed refresh JWT with refresh secret', async () => {
      jwtService.signAsync.mockResolvedValue('refresh-jwt');

      const result = await service.createTokenForRefresh('user-123');

      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { userId: 'user-123' },
        { secret: 'refresh_secret', expiresIn: '7d' },
      );
      expect(result).toBe('refresh-jwt');
    });
  });

  // ─── createTokenForRefreshWithCheckUser ───────────────────────────────────

  describe('createTokenForRefreshWithCheckUser', () => {
    it('should call doesUserExist before issuing token', async () => {
      usersService.doesUserExist.mockResolvedValue(true);
      jwtService.signAsync.mockResolvedValue('token');

      await service.createTokenForRefreshWithCheckUser('user-123');

      expect(usersService.doesUserExist).toHaveBeenCalledWith('user-123');
    });
  });

  // ─── findOrCreateGoogleUser ───────────────────────────────────────────────

  describe('findOrCreateGoogleUser', () => {
    it('should delegate to UsersService', async () => {
      const mockUser = createMockUser();
      usersService.findOrCreateGoogleUser.mockResolvedValue(mockUser);

      const result = await service.findOrCreateGoogleUser({ email: 'g@g.com' });

      expect(usersService.findOrCreateGoogleUser).toHaveBeenCalledWith({ email: 'g@g.com' });
      expect(result).toEqual(mockUser);
    });
  });

  // ─── getJwtPayloadFromRefreshToken ────────────────────────────────────────

  describe('getJwtPayloadFromRefreshToken', () => {
    it('should return decoded payload for a valid token', () => {
      jwtService.decode.mockReturnValue({ userId: 'user-123' });

      const result = service.getJwtPayloadFromRefreshToken('valid-refresh-token');

      expect(result).toEqual({ userId: 'user-123' });
    });

    it('should throw Unauthorized when decode returns null/falsy', () => {
      jwtService.decode.mockReturnValue(null);

      expect(() => service.getJwtPayloadFromRefreshToken('bad-token')).toThrow(
        new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED),
      );
    });
  });

  // ─── verifyGoogleToken ────────────────────────────────────────────────────

  describe('verifyGoogleToken', () => {
    it('should throw HttpException when google-auth-library throws', async () => {
      await expect(service.verifyGoogleToken('bad-token')).rejects.toThrow(HttpException);
    });

    it('should throw with UNAUTHORIZED status when token is invalid', async () => {
      try {
        await service.verifyGoogleToken('bad-token');
        fail('Expected error to be thrown');
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect((err as HttpException).getStatus()).toBe(HttpStatus.UNAUTHORIZED);
      }
    });
  });
});
