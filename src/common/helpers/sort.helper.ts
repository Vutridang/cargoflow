import { SortOrder } from 'mongoose';

export function buildSort(
  sortBy = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc',
): Record<string, SortOrder> {
  return {
    [sortBy]: sortOrder === 'asc' ? 1 : -1,
  };
}