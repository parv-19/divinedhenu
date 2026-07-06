import { Gift, HandHeart, PackageCheck, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import Container from '../components/common/Container.jsx';
import SectionHeading from '../components/common/SectionHeading.jsx';
import { PrimaryButton } from '../components/common/Button.jsx';
import SEO, { localBusinessJsonLd } from '../components/common/SEO.jsx';
import { publicApi } from '../services/api.js';

const fallbackAboutImage = '/divinedhenu-logo-mark.png';
const fallbackContent = {
  aboutEyebrow: 'DivineDhenu',
  aboutHeroTitle: 'Fragrance for the Spaces That Hold You',
  aboutHeroDescription: 'We create refined ritual fragrances for modern Indian homes, where prayer corners, work desks, and quiet evenings all deserve a moment of intention.',
  aboutButtonText: 'Begin Your Ritual',
  aboutButtonLink: '/shop',
  aboutStoryTitle: 'A Softer Way to Come Home',
  aboutStoryDescription: 'DivineDhenu was created to bring mindful ritual moments into modern homes. Each blend is imagined around the feeling it should leave behind: calmer rooms, focused mornings, devotional corners, and gifts that carry real meaning.',
  aboutValue1: 'Calm over chaos',
  aboutValue2: 'Ritual over routine',
  aboutValue3: 'Craft over mass production',
  aboutValue4: 'Gifting with meaning',
  aboutProcessTitle: 'Our Process',
  aboutProcessDescription: 'From aroma direction to gift-ready packing, each step is designed to feel thoughtful and quietly premium.',
  aboutProcessStep1: 'Select aroma direction',
  aboutProcessStep2: 'Blend ritual notes',
  aboutProcessStep3: 'Hand-pack with care',
  aboutProcessStep4: 'Deliver gift-ready',
};

export default function About() {
  const [aboutImage, setAboutImage] = useState(fallbackAboutImage);
  const [content, setContent] = useState(fallbackContent);

  useEffect(() => {
    publicApi.getSiteSettings()
      .then((settings) => {
        setAboutImage(settings?.aboutImage?.url || '');
        setContent({ ...fallbackContent, ...settings });
      })
      .catch(() => {
        setAboutImage(fallbackAboutImage);
        setContent(fallbackContent);
      });
  }, []);

  const values = [content.aboutValue1, content.aboutValue2, content.aboutValue3, content.aboutValue4].filter(Boolean);
  const processSteps = [
    [content.aboutProcessStep1, Sparkles],
    [content.aboutProcessStep2, HandHeart],
    [content.aboutProcessStep3, PackageCheck],
    [content.aboutProcessStep4, Gift],
  ].filter(([title]) => title);

  return (
    <>
      <SEO
        title="About DivineDhenu | Ritual Fragrance Brand from Ahmedabad, Gujarat"
        description="Learn about DivineDhenu, an Ahmedabad-based ritual fragrance brand creating dhoop, incense, havan cups and meaningful gifting products for homes across Gujarat."
        path="/about"
        keywords="about DivineDhenu, Ahmedabad fragrance brand, Gujarat dhoop brand, ritual fragrance India, puja products Ahmedabad"
        jsonLd={localBusinessJsonLd}
      />
      <section className="py-16 md:py-20">
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            {content.aboutEyebrow ? <span className="text-xs font-semibold uppercase tracking-[0.28em] text-ritual-gold">{content.aboutEyebrow}</span> : null}
            {content.aboutHeroTitle ? <h1 className="mt-5 font-serif text-5xl leading-tight md:text-6xl">{content.aboutHeroTitle}</h1> : null}
            {content.aboutHeroDescription ? <p className="mt-6 text-lg leading-8 text-ritual-muted">{content.aboutHeroDescription}</p> : null}
            {content.aboutButtonText && content.aboutButtonLink ? <PrimaryButton to={content.aboutButtonLink} className="mt-8">{content.aboutButtonText}</PrimaryButton> : null}
          </div>
          {aboutImage ? (
            <div className="aspect-[4/3] overflow-hidden rounded-lg shadow-lift">
              <img src={aboutImage} alt="Divine Dhenu" className="h-full w-full object-cover object-center" onError={(event) => { event.currentTarget.src = fallbackAboutImage; }} />
            </div>
          ) : null}
        </Container>
      </section>

      {content.aboutStoryTitle || content.aboutStoryDescription || values.length ? (
        <section className="bg-ritual-card/60 py-16">
          <Container>
            <SectionHeading title={content.aboutStoryTitle} subtitle={content.aboutStoryDescription} />
            {values.length ? (
              <div className="grid gap-5 md:grid-cols-4">
                {values.map((value) => (
                  <div key={value} className="rounded-lg border border-ritual-border bg-ritual-card p-6 text-center font-serif text-xl shadow-soft">
                    {value}
                  </div>
                ))}
              </div>
            ) : null}
          </Container>
        </section>
      ) : null}

      <section className="py-16">
        <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-ritual-gold">Purity, Tradition & Spirituality</span>
            <h2 className="mt-4 font-serif text-4xl leading-tight">Pure Puja Materials Rooted in Gir Cow Tradition</h2>
            <p className="mt-5 text-sm leading-7 text-ritual-muted">
              DivineDhenu is a bridge between ancient Indian culture and the modern lifestyle. Operated by N.K. Enterprise, we create 100% pure, chemical-free puja materials using sacred Gir cow dung, Panchagavya wisdom, natural herbs and essential oils.
            </p>
            <p className="mt-4 text-sm leading-7 text-ritual-muted">
              From Ahmedabad and Gandhinagar to Bhavnagar, Junagadh, Amreli, Botad, Gadhada, Salangpur and homes across Gujarat, our mission is to bring a temple-like sacred environment into every home.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              'Pure Gir cow dung as the foundation of traditional dhoop products',
              'Bamboo-less agarbatti and incense sticks for mindful puja use',
              'Free from charcoal, harsh chemicals and synthetic shortcuts',
              'Natural fragrance from herbs and essential oils for peace and focus',
            ].map((item) => (
              <div key={item} className="rounded-lg border border-ritual-border bg-ritual-card p-5 text-sm leading-6 shadow-soft">
                {item}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {content.aboutProcessTitle || content.aboutProcessDescription || processSteps.length ? (
        <section className="py-16">
          <Container>
            <SectionHeading title={content.aboutProcessTitle} subtitle={content.aboutProcessDescription} />
            {processSteps.length ? (
              <div className="grid gap-5 md:grid-cols-4">
                {processSteps.map(([title, Icon]) => (
                  <div key={title} className="rounded-lg border border-ritual-border bg-ritual-card p-6 shadow-soft">
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-ritual-gold/15 text-ritual-gold">
                      <Icon size={22} />
                    </div>
                    <h3 className="mt-5 font-serif text-xl">{title}</h3>
                  </div>
                ))}
              </div>
            ) : null}
          </Container>
        </section>
      ) : null}
    </>
  );
}
