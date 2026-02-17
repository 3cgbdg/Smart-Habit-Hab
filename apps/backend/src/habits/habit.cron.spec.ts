import { Test, TestingModule } from '@nestjs/testing';
import { HabitCron } from './habit.cron';
import { HabitsService } from './habits.service';

const mockHabitsService = () => ({
  createDailyLogs: jest.fn(),
  updateLogsStatus: jest.fn(),
});

describe('HabitCron', () => {
  let cron: HabitCron;
  let habitsService: ReturnType<typeof mockHabitsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HabitCron, { provide: HabitsService, useFactory: mockHabitsService }],
    }).compile();

    cron = module.get<HabitCron>(HabitCron);
    habitsService = module.get(HabitsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('handleDailyLogs', () => {
    it('should call habitsService.createDailyLogs()', async () => {
      habitsService.createDailyLogs.mockResolvedValue(undefined);

      await cron.handleDailyLogs();

      expect(habitsService.createDailyLogs).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateLogsStatus', () => {
    it('should call habitsService.updateLogsStatus()', async () => {
      habitsService.updateLogsStatus.mockResolvedValue(undefined);

      await cron.updateLogsStatus();

      expect(habitsService.updateLogsStatus).toHaveBeenCalledTimes(1);
    });
  });
});
