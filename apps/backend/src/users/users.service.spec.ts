import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { createMockUser } from 'src/__test-utils__/factories';

const mockUserRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  exists: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let userRepo: ReturnType<typeof mockUserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useFactory: mockUserRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepo = module.get(getRepositoryToken(User));
  });

  afterEach(() => jest.clearAllMocks());

  // ─── findOrCreateGoogleUser ────────────────────────────────────────────────

  describe('findOrCreateGoogleUser', () => {
    const googleProfile = {
      sub: 'google-id-123',
      email: 'google@test.com',
      given_name: 'John',
      family_name: 'Doe',
      picture: 'https://photo.url/me.jpg',
    };

    it('should create a new user when none exists', async () => {
      const newUser = createMockUser({ email: googleProfile.email });
      userRepo.findOne.mockResolvedValue(null);
      userRepo.create.mockReturnValue(newUser);
      userRepo.save.mockResolvedValue(newUser);

      const result = await service.findOrCreateGoogleUser(googleProfile);

      expect(userRepo.findOne).toHaveBeenCalled();
      expect(userRepo.create).toHaveBeenCalled();
      expect(userRepo.save).toHaveBeenCalled();
      expect(result).toEqual(newUser);
    });

    it('should return existing user when found by googleId/email', async () => {
      const existingUser = createMockUser({
        googleId: 'google-id-123',
        email: googleProfile.email,
      });
      userRepo.findOne.mockResolvedValue(existingUser);

      const result = await service.findOrCreateGoogleUser(googleProfile);

      expect(userRepo.create).not.toHaveBeenCalled();
      expect(result).toEqual(existingUser);
    });

    it('should update googleId on existing email-only user', async () => {
      const existingUser = createMockUser({ email: googleProfile.email, googleId: undefined });
      const savedUser = {
        ...existingUser,
        googleId: googleProfile.sub,
        firstName: googleProfile.given_name,
        lastName: googleProfile.family_name,
        imageUrl: googleProfile.picture,
      };
      userRepo.findOne.mockResolvedValue(existingUser);
      userRepo.save.mockResolvedValue(savedUser);

      const result = await service.findOrCreateGoogleUser(googleProfile);

      expect(userRepo.save).toHaveBeenCalled();
      expect(result).toEqual(savedUser);
    });
    it('should throw InternalServerErrorException when email is missing', async () => {
      await expect(service.findOrCreateGoogleUser({ sub: 'some-id' })).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  // ─── findById ─────────────────────────────────────────────────────────────

  describe('findById', () => {
    it('should return a user by id', async () => {
      const user = createMockUser();
      userRepo.findOne.mockResolvedValue(user);

      const result = await service.findById(user.id);

      expect(userRepo.findOne).toHaveBeenCalledWith({ where: { id: user.id } });
      expect(result).toEqual(user);
    });

    it('should return null when user not found', async () => {
      userRepo.findOne.mockResolvedValue(null);

      const result = await service.findById('non-existent-id');

      expect(result).toBeNull();
    });
  });

  // ─── doesUserExist ────────────────────────────────────────────────────────

  describe('doesUserExist', () => {
    it('should return true when user exists', async () => {
      userRepo.exists.mockResolvedValue(true);

      const result = await service.doesUserExist('some-id');

      expect(result).toBe(true);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      userRepo.exists.mockResolvedValue(false);

      await expect(service.doesUserExist('ghost-id')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── findByEmailWithPassword ──────────────────────────────────────────────

  describe('findByEmailWithPassword', () => {
    it('should return password and id for an existing user', async () => {
      userRepo.findOne.mockResolvedValue({ id: 'abc', password: 'hashed' });

      const result = await service.findByEmailWithPassword('user@test.com');

      expect(result).toEqual({ id: 'abc', password: 'hashed' });
    });

    it('should throw NotFoundException for an unknown email', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(service.findByEmailWithPassword('ghost@test.com')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ─── createAndReturnUserId ────────────────────────────────────────────────

  describe('createAndReturnUserId', () => {
    it('should save a user and return the id', async () => {
      const user = createMockUser();
      userRepo.save.mockResolvedValue(user);

      const result = await service.createAndReturnUserId('user@test.com', 'hashed_pass');

      expect(userRepo.save).toHaveBeenCalledWith({
        email: 'user@test.com',
        password: 'hashed_pass',
      });
      expect(result).toBe(user.id);
    });

    it('should throw InternalServerErrorException when save returns null', async () => {
      userRepo.save.mockResolvedValue(null);

      await expect(service.createAndReturnUserId('user@test.com', 'hashed_pass')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
