import { BatchUtils } from './batch.util';

describe('BatchUtils', () => {
  describe('processInBatches', () => {
    it('should process a single batch of items', async () => {
      const items = [{ id: '1' }, { id: '2' }];
      const fetcher = jest.fn().mockResolvedValueOnce(items).mockResolvedValueOnce([]);
      const processor = jest.fn().mockResolvedValue(undefined);

      await BatchUtils.processInBatches(fetcher, processor, 10);

      expect(fetcher).toHaveBeenCalledWith(null);
      expect(processor).toHaveBeenCalledWith(items);
      expect(processor).toHaveBeenCalledTimes(1);
    });

    it('should process multiple batches using cursor pagination', async () => {
      const batch1 = [{ id: '1' }, { id: '2' }, { id: '3' }];
      const batch2 = [{ id: '4' }, { id: '5' }];
      const fetcher = jest.fn().mockResolvedValueOnce(batch1).mockResolvedValueOnce(batch2);
      const processor = jest.fn().mockResolvedValue(undefined);

      await BatchUtils.processInBatches(fetcher, processor, 3);

      expect(fetcher).toHaveBeenCalledTimes(2);
      expect(fetcher).toHaveBeenNthCalledWith(1, null);
      expect(fetcher).toHaveBeenNthCalledWith(2, '3');
      expect(processor).toHaveBeenCalledTimes(2);
      expect(processor).toHaveBeenNthCalledWith(1, batch1);
      expect(processor).toHaveBeenNthCalledWith(2, batch2);
    });

    it('should stop when fetcher returns empty array', async () => {
      const fetcher = jest.fn().mockResolvedValueOnce([]);
      const processor = jest.fn();

      await BatchUtils.processInBatches(fetcher, processor);

      expect(fetcher).toHaveBeenCalledTimes(1);
      expect(processor).not.toHaveBeenCalled();
    });

    it('should stop when batch is smaller than batchSize', async () => {
      const batch = [{ id: '1' }, { id: '2' }];
      const fetcher = jest.fn().mockResolvedValueOnce(batch);
      const processor = jest.fn().mockResolvedValue(undefined);

      await BatchUtils.processInBatches(fetcher, processor, 5);

      expect(fetcher).toHaveBeenCalledTimes(1);
      expect(processor).toHaveBeenCalledTimes(1);
    });
  });

  describe('processRemainingInBatches', () => {
    it('should process until fetcher returns empty', async () => {
      const batch1 = [{ id: '1' }];
      const batch2 = [{ id: '2' }];
      const fetcher = jest
        .fn()
        .mockResolvedValueOnce(batch1)
        .mockResolvedValueOnce(batch2)
        .mockResolvedValueOnce([]);
      const processor = jest.fn().mockResolvedValue(undefined);

      await BatchUtils.processRemainingInBatches(fetcher, processor);

      expect(fetcher).toHaveBeenCalledTimes(3);
      expect(processor).toHaveBeenCalledTimes(2);
    });

    it('should handle empty first fetch', async () => {
      const fetcher = jest.fn().mockResolvedValueOnce([]);
      const processor = jest.fn();

      await BatchUtils.processRemainingInBatches(fetcher, processor);

      expect(fetcher).toHaveBeenCalledTimes(1);
      expect(processor).not.toHaveBeenCalled();
    });
  });
});
