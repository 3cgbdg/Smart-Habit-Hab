import { AuthFormSchema } from './auth.schema';

describe('AuthFormSchema', () => {
  const validData = {
    email: 'test@example.com',
    password: 'Password1',
  };

  it('should pass for valid email and password', () => {
    expect(() => AuthFormSchema.parse(validData)).not.toThrow();
  });

  it('should reject an invalid email', () => {
    const result = AuthFormSchema.safeParse({ ...validData, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('should reject a password shorter than 8 characters', () => {
    const result = AuthFormSchema.safeParse({ ...validData, password: 'Pa1' });
    expect(result.success).toBe(false);
  });

  it('should reject a password without a lowercase letter', () => {
    const result = AuthFormSchema.safeParse({ ...validData, password: 'PASSWORD1' });
    expect(result.success).toBe(false);
  });

  it('should reject a password without an uppercase letter', () => {
    const result = AuthFormSchema.safeParse({ ...validData, password: 'password1' });
    expect(result.success).toBe(false);
  });

  it('should reject a password without a number', () => {
    const result = AuthFormSchema.safeParse({ ...validData, password: 'PasswordABC' });
    expect(result.success).toBe(false);
  });

  it('should reject missing email', () => {
    const result = AuthFormSchema.safeParse({ password: validData.password });
    expect(result.success).toBe(false);
  });

  it('should reject missing password', () => {
    const result = AuthFormSchema.safeParse({ email: validData.email });
    expect(result.success).toBe(false);
  });
});
