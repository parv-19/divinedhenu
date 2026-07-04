import { PrimaryButton, SecondaryButton } from '../components/common/Button.jsx';
import Container from '../components/common/Container.jsx';

export default function NotFound() {
  return (
    <section className="py-20">
      <Container className="text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-ritual-gold">404</span>
        <h1 className="mt-4 font-serif text-4xl text-ritual-text md:text-5xl">This ritual path is not available</h1>
        <p className="mx-auto mt-4 max-w-xl text-ritual-muted">
          The page may have moved, but the shop is still ready with incense, dhoop, havan cups, and gift sets.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <PrimaryButton to="/shop">Go to Shop</PrimaryButton>
          <SecondaryButton to="/">Return Home</SecondaryButton>
        </div>
      </Container>
    </section>
  );
}
