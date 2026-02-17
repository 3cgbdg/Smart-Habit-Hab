import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesService } from './profiles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { createMockUser } from 'src/__test-utils__/factories';

const mockUserRepository = () => ({
  findOne: jest.fn(),
  merge: jest.fn(),
  save: jest.fn(),
});

describe('ProfilesService', () => {
  let service: ProfilesService;
  let userRepo: ReturnType<typeof mockUserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilesService,
        { provide: getRepositoryToken(User), useFactory: mockUserRepository },
      ],
    }).compile();

    service = module.get<ProfilesService>(ProfilesService);
    userRepo = module.get(getRepositoryToken(User));
  });

  afterEach(() => jest.clearAllMocks());

  // ─── getOwnProfile ────────────────────────────────────────────────────────

  describe('getOwnProfile', () => {
    it('should return selected user fields', async () => {
      const user = createMockUser();
      userRepo.findOne.mockResolvedValue(user);

      const result = await service.getOwnProfile(user.id);

      expect(userRepo.findOne).toHaveBeenCalledWith({
        where: { id: user.id },
        select: expect.objectContaining({ id: true, email: true }),
      });
      expect(result).toEqual(user);
    });
  });

  // ─── updateProfile ────────────────────────────────────────────────────────

  describe('updateProfile', () => {
    it('should update basic fields and return success message', async () => {
      const user = createMockUser({ email: 'old@test.com' });
      // First findOne: load user. Second findOne: email uniqueness check → null means not taken
      userRepo.findOne.mockResolvedValueOnce(user).mockResolvedValueOnce(null);
      userRepo.merge.mockImplementation((src: User) => src);
      userRepo.save.mockResolvedValue(user);

      const result = await service.updateProfile(user.id, {
        email: 'new@test.com',
        darkMode: true,
        emailNotifications: false,
      });

      expect(userRepo.save).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Profile updated successfully' });
    });

    it('should throw BadRequestException when user not found', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(service.updateProfile('non-existent', { darkMode: false })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should change password when currentPassword is valid', async () => {
      const rawPassword = 'CurrentPass1';
      const hashed = await bcrypt.hash(rawPassword, 10);
      const user = createMockUser({ password: hashed });
      userRepo.findOne.mockResolvedValue(user);
      userRepo.merge.mockImplementation((src: User) => src);
      userRepo.save.mockResolvedValue(user);

      const result = await service.updateProfile(user.id, {
        newPassword: 'NewSecurePass1',
        currentPassword: rawPassword,
      });

      expect(result).toEqual({ message: 'Profile updated successfully' });
      expect(userRepo.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException when currentPassword is missing', async () => {
      const user = createMockUser({ password: 'hashed_password' });
      userRepo.findOne.mockResolvedValue(user);

      await expect(service.updateProfile(user.id, { newPassword: 'NewPass1' })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw UnauthorizedException for wrong currentPassword', async () => {
      const hashed = await bcrypt.hash('correctPassword', 10);
      const user = createMockUser({ password: hashed });
      userRepo.findOne.mockResolvedValue(user);

      await expect(
        service.updateProfile(user.id, {
          newPassword: 'NewPass1',
          currentPassword: 'wrongPassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw BadRequestException when user has no password and tries to change it', async () => {
      const user = createMockUser({ password: undefined });
      userRepo.findOne.mockResolvedValue(user);

      await expect(
        service.updateProfile(user.id, {
          newPassword: 'NewPass1',
          currentPassword: 'anything',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should prevent duplicate email by throwing BadRequestException', async () => {
      const user = createMockUser({ email: 'user@test.com' });
      const otherUser = createMockUser({ email: 'taken@test.com' });
      // First findOne returns current user, second returns the conflicting user
      userRepo.findOne.mockResolvedValueOnce(user).mockResolvedValueOnce(otherUser);

      await expect(service.updateProfile(user.id, { email: 'taken@test.com' })).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
