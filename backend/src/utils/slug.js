import slugify from 'slugify';

export const createSlug = (value) => slugify(value || '', { lower: true, strict: true });

export const createUniqueSlug = async (Model, value, existingId = null) => {
  const baseSlug = createSlug(value);
  let slug = baseSlug;
  let suffix = 1;

  while (await Model.exists({
    slug,
    ...(existingId ? { _id: { $ne: existingId } } : {}),
  })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
};
