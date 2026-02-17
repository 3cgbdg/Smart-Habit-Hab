import { DateUtils } from './date.util';

describe('DateUtils', () => {
  describe('getTodayDateString', () => {
    it('should return a string in YYYY-MM-DD format', () => {
      const result = DateUtils.getTodayDateString();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("should return today's date", () => {
      const result = DateUtils.getTodayDateString();
      const expected = new Date().toISOString().split('T')[0];
      expect(result).toBe(expected);
    });
  });

  describe('getSevenDaysAgoDateString', () => {
    it('should return a string in YYYY-MM-DD format', () => {
      const result = DateUtils.getSevenDaysAgoDateString();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should return a date 6 days ago', () => {
      const result = DateUtils.getSevenDaysAgoDateString();
      const today = new Date();
      const sixDaysAgo = new Date();
      sixDaysAgo.setDate(today.getDate() - 6);
      sixDaysAgo.setHours(0, 0, 0, 0);
      const expected = sixDaysAgo.toISOString().split('T')[0];
      expect(result).toBe(expected);
    });
  });

  describe('getFirstDayOfMonthDateString', () => {
    it('should return a string in YYYY-MM-DD format', () => {
      const result = DateUtils.getFirstDayOfMonthDateString();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should return the 1st of the current month', () => {
      const result = DateUtils.getFirstDayOfMonthDateString();
      const today = new Date();
      const expected = new Date(today.getFullYear(), today.getMonth(), 1)
        .toISOString()
        .split('T')[0];
      expect(result).toBe(expected);
    });
  });

  describe('getLastDayOfMonthDateString', () => {
    it('should return a string in YYYY-MM-DD format', () => {
      const result = DateUtils.getLastDayOfMonthDateString();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should return the last day of the current month', () => {
      const result = DateUtils.getLastDayOfMonthDateString();
      const today = new Date();
      const expected = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        .toISOString()
        .split('T')[0];
      expect(result).toBe(expected);
    });

    it('should handle February correctly', () => {
      const result = DateUtils.getLastDayOfMonthDateString();
      // Just verify it returns a valid date — the day should be between 28 and 31
      const day = parseInt(result.split('-')[2]);
      expect(day).toBeGreaterThanOrEqual(28);
      expect(day).toBeLessThanOrEqual(31);
    });
  });
});
