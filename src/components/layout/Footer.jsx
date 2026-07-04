import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Container from '../common/Container.jsx';
import { publicApi } from '../../services/api.js';
import { transparentLogoUrl } from '../../utils/imageUrl.js';

const fallbackSettings = {
  brandName: 'DivineDhenu',
  footerText: 'Handcrafted fragrance for calm homes and sacred moments.',
  email: 'divinedhenu@gmail.com',
  phone: '+91 81402 43960',
  address: '',
  logo: {},
};

const policyLinks = [
  ['Terms and Conditions', '/terms-and-conditions'],
  ['Privacy Policy', '/privacy-policy'],
  ['Shipping Policy', '/shipping-policy'],
  ['Cancellation and Refund Policy', '/cancellation-and-refund-policy'],
  ['Pricing Policy', '/pricing-policy'],
];

export default function Footer() {
  const [settings, setSettings] = useState(fallbackSettings);

  useEffect(() => {
    publicApi.getSiteSettings()
      .then((data) => setSettings({
        ...fallbackSettings,
        ...data,
        brandName: data?.brandName === 'Aaroma Rituals' ? 'DivineDhenu' : data?.brandName || fallbackSettings.brandName,
      }))
      .catch(() => setSettings(fallbackSettings));
  }, []);

  const mapQuery = encodeURIComponent(settings.address || 'Ahmedabad, Gujarat, India');

  return (
    <footer className="bg-ritual-brown text-ritual-card">
      <Container className="grid gap-7 py-8 md:grid-cols-[1fr_1fr] md:gap-8 md:py-10 lg:grid-cols-[1fr_0.7fr_1.1fr]">
        <div>
          <div className="flex items-center gap-3">
            <img src={transparentLogoUrl(settings.navbarLogo?.url || '/divinedhenu-logo-mark.png')} alt="" className="h-14 w-14 object-contain brightness-0 invert" onError={(event) => { event.currentTarget.src = '/divinedhenu-logo-mark.png'; }} />
            <img src={transparentLogoUrl(settings.brandWordmark?.url || '/divinedhenu-wordmark.png')} alt={settings.brandName} className="h-8 w-auto max-w-[210px] brightness-0 invert" onError={(event) => { event.currentTarget.src = '/divinedhenu-wordmark.png'; }} />
          </div>
          <p className="mt-3 max-w-md text-sm leading-6 text-ritual-card/75">{settings.footerText}</p>

          <div className="mt-5 grid gap-3 text-sm text-ritual-card/75">
            {settings.address ? <ContactLine icon={MapPin} text={settings.address} /> : null}
            {settings.phone ? <ContactLine icon={Phone} text={settings.phone} href={`tel:${settings.phone}`} /> : null}
            {settings.email ? <ContactLine icon={Mail} text={settings.email} href={`mailto:${settings.email}`} /> : null}
          </div>

          <div className="mt-5 flex gap-2">
            {[
              [Instagram, settings.instagram],
              [Facebook, settings.facebook],
              [Youtube, settings.youtube],
            ].map(([Icon, href]) => href ? (
              <a key={href} href={href} className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-ritual-card/80 transition hover:border-ritual-gold hover:text-ritual-gold" target="_blank" rel="noreferrer">
                <Icon size={16} />
              </a>
            ) : null)}
          </div>
        </div>

        <div>
          <h2 className="font-serif text-xl text-ritual-card">Quick Links</h2>
          <div className="mt-4 grid gap-2 text-sm text-ritual-card/75">
            {policyLinks.map(([label, href]) => (
              <Link key={href} to={href} className="transition hover:text-ritual-gold">
                {label}
              </Link>
            ))}
            <Link to="/contact" className="transition hover:text-ritual-gold">Contact Us</Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-white/10 bg-white/5">
          <iframe
            title="DivineDhenu location"
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            className="h-52 w-full border-0 md:h-full md:min-h-64"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </Container>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-ritual-card/60">
        &copy; 2026 {settings.brandName}. All rights reserved.
      </div>
    </footer>
  );
}

function ContactLine({ icon: Icon, text, href }) {
  const content = (
    <>
      <Icon size={16} className="mt-0.5 shrink-0 text-ritual-gold" />
      <span className="leading-5">{text}</span>
    </>
  );

  return href ? (
    <a href={href} className="flex items-start gap-3 transition hover:text-ritual-gold">{content}</a>
  ) : (
    <div className="flex items-start gap-3">{content}</div>
  );
}
