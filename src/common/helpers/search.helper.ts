export function buildSearchFilter(
  field: string,
  value?: string,
) {
  if (!value) {
    return {};
  }

  return {
    [field]: {
      $regex: value,
      $options: 'i',
    },
  };
}