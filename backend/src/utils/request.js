export const parseBoolean = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'boolean') return value;
  return value === 'true' || value === '1';
};

export const parseNumber = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  const number = Number(value);
  return Number.isNaN(number) ? undefined : number;
};

export const parseArray = (value) => {
  if (value === undefined || value === null || value === '') return [];
  if (Array.isArray(value)) return value;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return String(value)
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
};

export const parseObject = (value) => {
  if (!value) return undefined;
  if (typeof value === 'object') return value;

  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
};

export const getPagination = (query) => {
  const page = Math.max(parseNumber(query.page) || 1, 1);
  const limit = Math.min(Math.max(parseNumber(query.limit) || 12, 1), 100);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const buildPaginationMeta = (total, page, limit) => ({
  total,
  page,
  limit,
  pages: Math.ceil(total / limit) || 1,
});
