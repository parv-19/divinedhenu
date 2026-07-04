export function transparentLogoUrl(url) {
  if (!url?.includes('/image/upload/')) return url;

  return url.replace(
    '/image/upload/',
    '/image/upload/e_trim/e_make_transparent:10,f_png/',
  );
}
