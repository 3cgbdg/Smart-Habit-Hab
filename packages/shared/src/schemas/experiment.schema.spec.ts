import { CreateExperimentSchema, ExperimentStatus, GetExperimentSchema } from './experiment.schema';

describe('CreateExperimentSchema', () => {
  const validData = {
    name: 'Cold Shower Experiment',
    habitId: '123e4567-e89b-12d3-a456-426614174000',
    variable: 'Morning energy levels',
    startDate: '2025-01-01',
    endDate: '2025-03-01',
  };

  it('should pass for valid input', () => {
    expect(() => CreateExperimentSchema.parse(validData)).not.toThrow();
  });

  it('should reject an empty name', () => {
    const result = CreateExperimentSchema.safeParse({ ...validData, name: '' });
    expect(result.success).toBe(false);
  });

  it('should reject a name longer than 255 characters', () => {
    const result = CreateExperimentSchema.safeParse({ ...validData, name: 'a'.repeat(256) });
    expect(result.success).toBe(false);
  });

  it('should reject a non-UUID habitId', () => {
    const result = CreateExperimentSchema.safeParse({ ...validData, habitId: 'not-a-uuid' });
    expect(result.success).toBe(false);
  });

  it('should transform empty string endDate to null', () => {
    const result = CreateExperimentSchema.parse({ ...validData, endDate: '' });
    expect(result.endDate).toBeNull();
  });

  it('should allow null endDate', () => {
    const result = CreateExperimentSchema.parse({ ...validData, endDate: null });
    expect(result.endDate).toBeNull();
  });

  it('should allow undefined endDate', () => {
    const dataWithoutEnd = {
      name: validData.name,
      habitId: validData.habitId,
      variable: validData.variable,
      startDate: validData.startDate,
    };
    const result = CreateExperimentSchema.parse(dataWithoutEnd);
    expect(result.endDate).toBeUndefined();
  });

  it('should reject an empty variable', () => {
    const result = CreateExperimentSchema.safeParse({ ...validData, variable: '' });
    expect(result.success).toBe(false);
  });

  it('should reject an empty startDate', () => {
    const result = CreateExperimentSchema.safeParse({ ...validData, startDate: '' });
    expect(result.success).toBe(false);
  });
});

describe('GetExperimentSchema', () => {
  const validData = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Cold Shower Experiment',
    habitId: '123e4567-e89b-12d3-a456-426614174001',
    variable: 'Morning energy levels',
    startDate: '2025-01-01',
    endDate: '2025-03-01',
    status: ExperimentStatus.RUNNING,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should pass for valid full experiment response', () => {
    expect(() => GetExperimentSchema.parse(validData)).not.toThrow();
  });

  it('should reject an invalid status enum value', () => {
    const result = GetExperimentSchema.safeParse({ ...validData, status: 'invalid_status' });
    expect(result.success).toBe(false);
  });

  it('should accept all valid ExperimentStatus values', () => {
    for (const status of Object.values(ExperimentStatus)) {
      const result = GetExperimentSchema.safeParse({ ...validData, status });
      expect(result.success).toBe(true);
    }
  });

  it('should allow optional successRate', () => {
    const result = GetExperimentSchema.parse({ ...validData, successRate: 87.5 });
    expect(result.successRate).toBe(87.5);
  });

  it('should allow optional duration', () => {
    const result = GetExperimentSchema.parse({ ...validData, duration: 30 });
    expect(result.duration).toBe(30);
  });
});
