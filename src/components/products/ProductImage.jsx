export default function ProductImage({ image, className = '' }) {
  const isUrl = typeof image === 'string' && /^https?:\/\//.test(image);

  return (
    <div
      className={`image-placeholder relative overflow-hidden bg-ritual-border ${className}`}
      style={{
        backgroundImage: isUrl ? `url(${image})` : image,
        backgroundSize: isUrl ? 'cover' : undefined,
      }}
      aria-hidden="true"
    >
      {!isUrl ? (
        <>
          <div className="absolute inset-x-6 bottom-5 h-10 rounded-full bg-white/25 blur-xl" />
          <div className="absolute left-1/2 top-1/2 h-24 w-16 -translate-x-1/2 -translate-y-1/2 rounded-t-full rounded-b-lg border border-white/35 bg-white/20 shadow-soft backdrop-blur-sm" />
        </>
      ) : null}
    </div>
  );
}
