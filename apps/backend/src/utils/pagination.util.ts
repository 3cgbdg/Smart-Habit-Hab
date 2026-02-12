import { SelectQueryBuilder, ObjectLiteral } from 'typeorm';

export interface PaginationResult<T> {
  items: T[];
  total: number;
}

export class PaginationUtils {
  static async paginate<T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    page: number,
    itemsPerPage: number,
  ): Promise<PaginationResult<T>> {
    const total = await qb.getCount();

    const items = await qb
      .skip((page - 1) * itemsPerPage)
      .take(itemsPerPage)
      .getMany();

    return { items, total };
  }
}
