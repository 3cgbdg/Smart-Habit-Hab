import { Test, TestingModule } from '@nestjs/testing';
import { HabitLogsService } from './habit_logs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HabitLog, Status } from './entities/habit_log.enitity';
import { NotFoundException } from '@nestjs/common';
import { createMockHabitLog } from 'src/__test-utils__/factories';

const mockHabitLogRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  insert: jest.fn(),
  findOne: jest.fn(),
  createQueryBuilder: jest.fn(),
});

const mockQueryBuilder = () => {
  const qb: Record<string, jest.Mock> = {
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    getRawMany: jest.fn().mockResolvedValue([]),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    whereInIds: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue(undefined),
  };
  return qb;
};

describe('HabitLogsService', () => {
  let service: HabitLogsService;
  let habitLogRepo: ReturnType<typeof mockHabitLogRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HabitLogsService,
        { provide: getRepositoryToken(HabitLog), useFactory: mockHabitLogRepository },
      ],
    }).compile();

    service = module.get<HabitLogsService>(HabitLogsService);
    habitLogRepo = module.get(getRepositoryToken(HabitLog));
  });

  afterEach(() => jest.clearAllMocks());

  // ─── create ───────────────────────────────────────────────────────────────

  describe('create', () => {
    it('should create and save a log entry', async () => {
      const log = createMockHabitLog();
      habitLogRepo.create.mockReturnValue(log);
      habitLogRepo.save.mockResolvedValue(log);

      const result = await service.create(log.habitId, log.date, log.status);

      expect(habitLogRepo.create).toHaveBeenCalledWith({
        habitId: log.habitId,
        date: log.date,
        status: log.status,
      });
      expect(result).toEqual(log);
    });
  });

  // ─── createBulk ───────────────────────────────────────────────────────────

  describe('createBulk', () => {
    it('should call insert with array of logs', async () => {
      const logs = [createMockHabitLog(), createMockHabitLog()];
      habitLogRepo.insert.mockResolvedValue(undefined);

      await service.createBulk(logs);

      expect(habitLogRepo.insert).toHaveBeenCalledWith(logs);
    });
  });

  // ─── changeStatus ─────────────────────────────────────────────────────────

  describe('changeStatus', () => {
    it('should find/create today log and change its status', async () => {
      const log = createMockHabitLog({ status: Status.PENDING });
      habitLogRepo.findOne.mockResolvedValue(log);
      habitLogRepo.save.mockResolvedValue({ ...log, status: Status.COMPLETED });

      const result = await service.changeStatus(log.habitId, Status.COMPLETED);

      expect(habitLogRepo.save).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return true without saving if status is already the same', async () => {
      const log = createMockHabitLog({ status: Status.COMPLETED });
      habitLogRepo.findOne.mockResolvedValue(log);

      const result = await service.changeStatus(log.habitId, Status.COMPLETED);

      expect(habitLogRepo.save).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });

  // ─── completeLog / skipLog ────────────────────────────────────────────────

  describe('completeLog', () => {
    it('should call changeStatus with COMPLETED', async () => {
      const log = createMockHabitLog({ status: Status.PENDING });
      habitLogRepo.findOne.mockResolvedValue(log);
      habitLogRepo.save.mockResolvedValue(log);

      const result = await service.completeLog('habit-id');

      expect(result).toBe(true);
    });
  });

  describe('skipLog', () => {
    it('should call changeStatus with SKIPPED', async () => {
      const log = createMockHabitLog({ status: Status.PENDING });
      habitLogRepo.findOne.mockResolvedValue(log);
      habitLogRepo.save.mockResolvedValue(log);

      const result = await service.skipLog('habit-id');

      expect(result).toBe(true);
    });
  });

  // ─── ifLogExistsAndReturn ─────────────────────────────────────────────────

  describe('ifLogExistsAndReturn', () => {
    it('should return an existing log', async () => {
      const log = createMockHabitLog();
      habitLogRepo.findOne.mockResolvedValue(log);

      const result = await service.ifLogExistsAndReturn(log.habitId, log.date);

      expect(result).toEqual(log);
    });

    it('should throw NotFoundException when log does not exist', async () => {
      habitLogRepo.findOne.mockResolvedValue(null);

      await expect(service.ifLogExistsAndReturn('no-habit', '2025-01-01')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ─── updateStatuses ───────────────────────────────────────────────────────

  describe('updateStatuses', () => {
    it('should batch update PENDING logs to SKIPPED', async () => {
      const qb = mockQueryBuilder();
      // First call returns 2 raw IDs, second call returns empty to stop
      qb.getRawMany
        .mockResolvedValueOnce([{ id: 'log-1' }, { id: 'log-2' }])
        .mockResolvedValueOnce([]);

      // Make update().set().whereInIds().execute() chain work
      const updateQb = {
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        whereInIds: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(undefined),
      };
      habitLogRepo.createQueryBuilder
        .mockReturnValueOnce(qb) // for select query
        .mockReturnValueOnce(updateQb) // for update query
        .mockReturnValueOnce(qb) // for select query (second batch)
        .mockReturnValueOnce(updateQb);

      // Wire select qb
      Object.assign(qb, {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
      });

      await service.updateStatuses();

      expect(habitLogRepo.createQueryBuilder).toHaveBeenCalled();
    });
  });
});
