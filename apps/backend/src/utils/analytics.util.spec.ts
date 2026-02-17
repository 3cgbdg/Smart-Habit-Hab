import { AnalyticsUtils } from './analytics.util';

describe('AnalyticsUtils', () => {
  describe('calculatePlaceholderConsistencyBoost', () => {
    it('should return a number between 5 and 19', () => {
      for (let i = 0; i < 100; i++) {
        const result = AnalyticsUtils.calculatePlaceholderConsistencyBoost();
        expect(result).toBeGreaterThanOrEqual(5);
        expect(result).toBeLessThanOrEqual(19);
      }
    });

    it('should return an integer', () => {
      for (let i = 0; i < 20; i++) {
        const result = AnalyticsUtils.calculatePlaceholderConsistencyBoost();
        expect(Number.isInteger(result)).toBe(true);
      }
    });
  });
});
