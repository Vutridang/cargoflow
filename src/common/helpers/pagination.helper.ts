export function buildPagination(page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  return {
    skip,
    limit,
  };
}

export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number,
) {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}