import { Test, TestingModule } from '@nestjs/testing';
import { ExperimentsService } from './experiments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Experiment } from './entities/experiments.entity';
import { AnalysisService } from 'src/analysis/analysis.service';
import { NotFoundException } from '@nestjs/common';
import { createMockExperiment } from 'src/__test-utils__/factories';
import { EXPERIMENT_CONSTANTS } from 'src/constants/experiments';

const mockExperimentRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  findAndCount: jest.fn(),
  remove: jest.fn(),
  createQueryBuilder: jest.fn(),
});

const mockAnalysisService = () => ({
  getBulkSuccessRates: jest.fn(),
  getSuccessRate: jest.fn(),
});

describe('ExperimentsService', () => {
  let service: ExperimentsService;
  let experimentRepo: ReturnType<typeof mockExperimentRepository>;
  let analysisService: ReturnType<typeof mockAnalysisService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExperimentsService,
        { provide: getRepositoryToken(Experiment), useFactory: mockExperimentRepository },
        { provide: AnalysisService, useFactory: mockAnalysisService },
      ],
    }).compile();

    service = module.get<ExperimentsService>(ExperimentsService);
    experimentRepo = module.get(getRepositoryToken(Experiment));
    analysisService = module.get(AnalysisService);
  });

  afterEach(() => jest.clearAllMocks());

  // ─── createExperiment ─────────────────────────────────────────────────────

  describe('createExperiment', () => {
    it('should create and save an experiment and return success message', async () => {
      const exp = createMockExperiment();
      experimentRepo.create.mockReturnValue(exp);
      experimentRepo.save.mockResolvedValue(exp);

      const result = await service.createExperiment('user-1', {
        name: exp.name,
        habitId: exp.habitId,
        variable: exp.variable,
        startDate: exp.startDate,
        endDate: null,
      });

      expect(experimentRepo.save).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Successfully created experiment' });
    });
  });

  // ─── findMyExperiments ────────────────────────────────────────────────────

  describe('findMyExperiments', () => {
    it('should return paginated experiments with success rates', async () => {
      const exp = createMockExperiment();
      experimentRepo.findAndCount.mockResolvedValue([[exp], 1]);
      analysisService.getBulkSuccessRates.mockResolvedValue({ [exp.habitId]: 80 });

      const result = await service.findMyExperiments('user-1', 1, 4, false);

      expect(result.data.data).toHaveLength(1);
      expect(result.data.data[0].successRate).toBe(80);
      expect(result.data.total).toBe(1);
    });

    it('should return 0 successRate for experiments not in rates map', async () => {
      const exp = createMockExperiment({ habitId: 'some-habit-id' });
      experimentRepo.findAndCount.mockResolvedValue([[exp], 1]);
      analysisService.getBulkSuccessRates.mockResolvedValue({});

      const result = await service.findMyExperiments('user-1', 1, 4, false);

      expect(result.data.data[0].successRate).toBe(0);
    });

    it('should return empty list when no experiments', async () => {
      experimentRepo.findAndCount.mockResolvedValue([[], 0]);
      analysisService.getBulkSuccessRates.mockResolvedValue({});

      const result = await service.findMyExperiments('user-1', 1, 4, false);

      expect(result.data.data).toHaveLength(0);
      expect(result.data.total).toBe(0);
    });
  });

  // ─── findLatestExperiments ────────────────────────────────────────────────

  describe('findLatestExperiments', () => {
    it('should return raw query results', async () => {
      const rawResults = [{ id: 'e1', name: 'Exp 1', duration: 10 }];
      const qb = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(rawResults),
      };
      experimentRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findLatestExperiments('user-1');

      expect(result.data).toEqual(rawResults);
    });
  });

  // ─── findOne ──────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('should return experiment with success rate', async () => {
      const exp = createMockExperiment({ endDate: '2025-06-01' });
      const qb = {
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(exp),
      };
      experimentRepo.createQueryBuilder.mockReturnValue(qb);
      analysisService.getSuccessRate.mockResolvedValue(75);

      const result = await service.findOne('user-1', exp.id);

      expect(result.data.successRate).toBe(75);
    });

    it('should throw NotFoundException when experiment not found', async () => {
      const qb = {
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      experimentRepo.createQueryBuilder.mockReturnValue(qb);

      await expect(service.findOne('user-1', 'bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── update ───────────────────────────────────────────────────────────────

  describe('update', () => {
    it('should update experiment and return success message', async () => {
      const exp = createMockExperiment();
      experimentRepo.findOne.mockResolvedValue(exp);
      experimentRepo.save.mockResolvedValue(exp);

      const result = await service.update('user-1', exp.id, {
        name: 'Updated Name',
        habitId: exp.habitId,
        variable: exp.variable,
        startDate: exp.startDate,
        endDate: null,
      });

      expect(result).toEqual({ message: 'Successfully updated experiment' });
    });

    it('should throw NotFoundException for invalid id', async () => {
      experimentRepo.findOne.mockResolvedValue(null);

      await expect(
        service.update('user-1', 'bad-id', {
          name: 'Name',
          habitId: 'h1',
          variable: 'v1',
          startDate: '2025-01-01',
          endDate: null,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ─── remove ───────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('should delete experiment and return success message', async () => {
      const exp = createMockExperiment();
      experimentRepo.findOne.mockResolvedValue(exp);
      experimentRepo.remove.mockResolvedValue(exp);

      const result = await service.remove('user-1', exp.id);

      expect(experimentRepo.remove).toHaveBeenCalledWith(exp);
      expect(result).toEqual({ message: 'Successfully deleted experiment' });
    });

    it('should throw NotFoundException for invalid id', async () => {
      experimentRepo.findOne.mockResolvedValue(null);

      await expect(service.remove('user-1', 'bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  // ─── getLimit (private via findMyExperiments call) ────────────────────────

  describe('getLimit behaviour', () => {
    it('should cap to MAX_ANALYTICS_LIMIT when analytics=true', async () => {
      experimentRepo.findAndCount.mockResolvedValue([[], 0]);
      analysisService.getBulkSuccessRates.mockResolvedValue({});

      await service.findMyExperiments('user-1', 1, 999, true);

      expect(experimentRepo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ take: EXPERIMENT_CONSTANTS.MAX_ANALYTICS_LIMIT }),
      );
    });

    it('should cap to MAX_LIMIT when analytics=false', async () => {
      experimentRepo.findAndCount.mockResolvedValue([[], 0]);
      analysisService.getBulkSuccessRates.mockResolvedValue({});

      await service.findMyExperiments('user-1', 1, 999, false);

      expect(experimentRepo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ take: EXPERIMENT_CONSTANTS.MAX_LIMIT }),
      );
    });
  });
});
