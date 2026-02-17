import { Test, TestingModule } from '@nestjs/testing';
import { StreakService } from './streak.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Habit } from './entities/habit.entity';

const mockHabitRepository = () => ({
  increment: jest.fn(),
  update: jest.fn(),
});

describe('StreakService', () => {
  let service: StreakService;
  let habitRepo: ReturnType<typeof mockHabitRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StreakService,
        { provide: getRepositoryToken(Habit), useFactory: mockHabitRepository },
      ],
    }).compile();

    service = module.get<StreakService>(StreakService);
    habitRepo = module.get(getRepositoryToken(Habit));
  });

  afterEach(() => jest.clearAllMocks());

  describe('incrementStreak', () => {
    it('should call increment on the repository', async () => {
      habitRepo.increment.mockResolvedValue({ affected: 1 });

      await service.incrementStreak('habit-123');

      expect(habitRepo.increment).toHaveBeenCalledWith({ id: 'habit-123' }, 'streak', 1);
    });

    it('should use the EntityManager repository when provided', async () => {
      const mockRepo = { increment: jest.fn().mockResolvedValue({ affected: 1 }) };
      const mockManager = { getRepository: jest.fn().mockReturnValue(mockRepo) };

      await service.incrementStreak('habit-123', mockManager as never);

      expect(mockManager.getRepository).toHaveBeenCalledWith(Habit);
      expect(mockRepo.increment).toHaveBeenCalledWith({ id: 'habit-123' }, 'streak', 1);
      expect(habitRepo.increment).not.toHaveBeenCalled();
    });
  });

  describe('resetStreak', () => {
    it('should set streak to 0 via update', async () => {
      habitRepo.update.mockResolvedValue({ affected: 1 });

      await service.resetStreak('habit-123');

      expect(habitRepo.update).toHaveBeenCalledWith({ id: 'habit-123' }, { streak: 0 });
    });

    it('should use the EntityManager repository when provided', async () => {
      const mockRepo = { update: jest.fn().mockResolvedValue({ affected: 1 }) };
      const mockManager = { getRepository: jest.fn().mockReturnValue(mockRepo) };

      await service.resetStreak('habit-123', mockManager as never);

      expect(mockManager.getRepository).toHaveBeenCalledWith(Habit);
      expect(mockRepo.update).toHaveBeenCalledWith({ id: 'habit-123' }, { streak: 0 });
    });
  });
});
