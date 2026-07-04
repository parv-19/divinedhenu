export default function SectionHeading({ eyebrow, title, subtitle, align = 'center' }) {
  const alignment = align === 'left' ? 'items-start text-left' : 'items-center text-center';
  return (
    <div className={`mb-10 flex max-w-3xl flex-col ${alignment}`}>
      {eyebrow ? (
        <span className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-ritual-gold">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="font-serif text-3xl text-ritual-text sm:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-4 text-base leading-7 text-ritual-muted">{subtitle}</p> : null}
    </div>
  );
}
