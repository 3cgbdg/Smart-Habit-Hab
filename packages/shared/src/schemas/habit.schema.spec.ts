import { CreateHabitSchema, GetHabitSchema } from './habit.schema';

describe('CreateHabitSchema', () => {
  const validData = {
    name: 'Morning Run',
    description: 'Run 5km every morning',
    isActive: true,
  };

  it('should pass for valid input', () => {
    expect(() => CreateHabitSchema.parse(validData)).not.toThrow();
  });

  it('should reject a name shorter than 3 characters', () => {
    const result = CreateHabitSchema.safeParse({ ...validData, name: 'ab' });
    expect(result.success).toBe(false);
  });

  it('should reject a name longer than 255 characters', () => {
    const result = CreateHabitSchema.safeParse({ ...validData, name: 'a'.repeat(256) });
    expect(result.success).toBe(false);
  });

  it('should default isActive to true when not provided', () => {
    const result = CreateHabitSchema.parse({ name: 'Test Habit' });
    expect(result.isActive).toBe(true);
  });

  it('should allow optional description', () => {
    const result = CreateHabitSchema.parse({ name: 'Test Habit', isActive: false });
    expect(result.description).toBeUndefined();
  });
});

describe('GetHabitSchema', () => {
  const validData = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Morning Run',
    description: 'Run 5km',
    isActive: true,
    streak: 7,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should pass for a valid full habit response', () => {
    expect(() => GetHabitSchema.parse(validData)).not.toThrow();
  });

  it('should reject an invalid UUID id', () => {
    const result = GetHabitSchema.safeParse({ ...validData, id: 'not-a-uuid' });
    expect(result.success).toBe(false);
  });

  it('should reject a non-number streak', () => {
    const result = GetHabitSchema.safeParse({ ...validData, streak: 'high' });
    expect(result.success).toBe(false);
  });

  it('should allow optional completionRate', () => {
    const result = GetHabitSchema.parse({ ...validData, completionRate: 75.5 });
    expect(result.completionRate).toBe(75.5);
  });
});
