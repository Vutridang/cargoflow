// src/common/helpers/filter.helper.ts

export function buildFilter(
  filters: Record<string, unknown>,
) {
  return Object.fromEntries(
    Object.entries(filters).filter(
      ([, value]) =>
        value !== undefined &&
        value !== null &&
        value !== '',
    ),
  );
}