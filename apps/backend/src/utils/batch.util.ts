import { OPTIMIZATION_CONSTANTS } from 'src/constants/optimization';

export class BatchUtils {
  // for cases where items are being added to the set
  // (e.g. creating new habit logs for a new day).
  static async processInBatches<T extends { id: string }>(
    fetcher: (lastId: string | null) => Promise<T[]>,
    processor: (items: T[]) => Promise<void>,
    batchSize: number = OPTIMIZATION_CONSTANTS.BATCH_SIZE,
  ): Promise<void> {
    let lastId: string | null = null;
    while (true) {
      const items = await fetcher(lastId);
      if (items.length === 0) break;

      await processor(items);

      if (items.length < batchSize) break;
      lastId = items[items.length - 1].id;
    }
  }

  // for cases where items are being removed from the set
  // (e.g. updating status from PENDING to something else).
  static async processRemainingInBatches<T>(
    fetcher: () => Promise<T[]>,
    processor: (items: T[]) => Promise<void>,
  ): Promise<void> {
    while (true) {
      const items = await fetcher();
      if (items.length === 0) break;
      await processor(items);
    }
  }
}
