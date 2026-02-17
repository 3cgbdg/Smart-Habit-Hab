import { UpdateProfileSchema, GetProfileSchema } from './profile.schema';

describe('UpdateProfileSchema', () => {
  const baseData = {
    email: 'user@test.com',
    darkMode: false,
    emailNotifications: true,
  };

  it('should pass for valid basic update (no password change)', () => {
    expect(() => UpdateProfileSchema.parse(baseData)).not.toThrow();
  });

  it('should reject an invalid email', () => {
    const result = UpdateProfileSchema.safeParse({ ...baseData, email: 'bad-email' });
    expect(result.success).toBe(false);
  });

  it('should reject newPassword shorter than 6 characters', () => {
    const result = UpdateProfileSchema.safeParse({
      ...baseData,
      newPassword: 'abc',
      currentPassword: 'OldPass1',
    });
    expect(result.success).toBe(false);
  });

  it('should require currentPassword when newPassword is set', () => {
    const result = UpdateProfileSchema.safeParse({
      ...baseData,
      newPassword: 'NewPass123',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join('.'));
      expect(paths).toContain('currentPassword');
    }
  });

  it('should pass when both newPassword and currentPassword are provided', () => {
    const result = UpdateProfileSchema.safeParse({
      ...baseData,
      newPassword: 'NewPass123',
      currentPassword: 'OldPass1',
    });
    expect(result.success).toBe(true);
  });

  it('should pass when newPassword is undefined (no password change)', () => {
    const result = UpdateProfileSchema.safeParse({ ...baseData });
    expect(result.success).toBe(true);
  });

  it('should allow all optional fields to be omitted', () => {
    const result = UpdateProfileSchema.safeParse({});
    expect(result.success).toBe(true);
  });
});

describe('GetProfileSchema', () => {
  const validProfile = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'user@test.com',
    darkMode: false,
    emailNotifications: true,
  };

  it('should pass for a valid profile', () => {
    expect(() => GetProfileSchema.parse(validProfile)).not.toThrow();
  });

  it('should reject an invalid UUID id', () => {
    const result = GetProfileSchema.safeParse({ ...validProfile, id: 'not-uuid' });
    expect(result.success).toBe(false);
  });

  it('should reject an invalid email', () => {
    const result = GetProfileSchema.safeParse({ ...validProfile, email: 'bad' });
    expect(result.success).toBe(false);
  });

  it('should reject a non-boolean darkMode', () => {
    const result = GetProfileSchema.safeParse({ ...validProfile, darkMode: 'yes' });
    expect(result.success).toBe(false);
  });
});
