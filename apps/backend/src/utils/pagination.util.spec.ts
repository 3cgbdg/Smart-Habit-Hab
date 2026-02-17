import { PaginationUtils } from './pagination.util';

describe('PaginationUtils', () => {
  const createMockQueryBuilder = (items: { id: string }[], total: number) => {
    const qb = {
      getCount: jest.fn().mockResolvedValue(total),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(items),
    };
    return qb as unknown as Parameters<typeof PaginationUtils.paginate>[0];
  };

  describe('paginate', () => {
    it('should return correct items and total for page 1', async () => {
      const items = [{ id: '1' }, { id: '2' }];
      const qb = createMockQueryBuilder(items, 10);

      const result = await PaginationUtils.paginate(qb, 1, 2);

      expect(result.items).toEqual(items);
      expect(result.total).toBe(10);
    });

    it('should calculate correct skip/take values', async () => {
      const qb = createMockQueryBuilder([], 0);

      await PaginationUtils.paginate(qb, 3, 10);

      expect((qb as any).skip).toHaveBeenCalledWith(20); // (3 - 1) * 10
      expect((qb as any).take).toHaveBeenCalledWith(10);
    });

    it('should return empty items when no results', async () => {
      const qb = createMockQueryBuilder([], 0);

      const result = await PaginationUtils.paginate(qb, 1, 10);

      expect(result.items).toEqual([]);
      expect(result.total).toBe(0);
    });

    it('should handle page 1 with skip 0', async () => {
      const qb = createMockQueryBuilder([{ id: '1' }], 1);

      await PaginationUtils.paginate(qb, 1, 5);

      expect((qb as any).skip).toHaveBeenCalledWith(0); // (1 - 1) * 5
      expect((qb as any).take).toHaveBeenCalledWith(5);
    });
  });
});
