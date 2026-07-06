import { useEffect } from 'react';

const SITE_URL = 'https://www.divinedhenu.com';
const DEFAULT_IMAGE = `${SITE_URL}/divinedhenu-logo-mark.png`;
const DEFAULT_TITLE = 'DivineDhenu | Pure Puja Materials, Dhoop and Bamboo-less Agarbatti';
const DEFAULT_DESCRIPTION = 'Shop 100% pure, chemical-free puja materials, bamboo-less agarbatti, Gir cow dung dhoop, incense and natural fragrance products from DivineDhenu in Ahmedabad, Gandhinagar and Gujarat.';
const DEFAULT_KEYWORDS = 'DivineDhenu, pure puja materials, chemical-free incense, bamboo-less agarbatti, Gir cow dung products, natural fragrance, essential oils, herbs, Ahmedabad, Gandhinagar, Gujarat, Bhavnagar, Junagadh, Amreli, Botad, Gadhada, Salangpur, cow dung dhoop, agarbatti, dhoop, puja samagri';

const setMeta = (selector, attributes) => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    if (value) element.setAttribute(key, value);
  });
};

const setLink = (rel, href) => {
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }

  element.setAttribute('href', href);
};

const setJsonLd = (id, value) => {
  let element = document.getElementById(id);
  if (!element) {
    element = document.createElement('script');
    element.id = id;
    element.type = 'application/ld+json';
    document.head.appendChild(element);
  }

  element.textContent = JSON.stringify(value);
};

export default function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
  keywords = DEFAULT_KEYWORDS,
  jsonLd,
  noIndex = false,
}) {
  useEffect(() => {
    const canonicalUrl = `${SITE_URL}${path === '/' ? '' : path}`;

    document.title = title;
    setMeta('meta[name="description"]', { name: 'description', content: description });
    setMeta('meta[name="keywords"]', { name: 'keywords', content: keywords });
    setMeta('meta[name="robots"]', { name: 'robots', content: noIndex ? 'noindex,nofollow' : 'index,follow' });
    setMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    setMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    setMeta('meta[property="og:type"]', { property: 'og:type', content: type });
    setMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    setMeta('meta[property="og:image"]', { property: 'og:image', content: image || DEFAULT_IMAGE });
    setMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'DivineDhenu' });
    setMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    setMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image || DEFAULT_IMAGE });
    setLink('canonical', canonicalUrl);

    if (jsonLd) setJsonLd('page-json-ld', jsonLd);
  }, [description, image, jsonLd, keywords, noIndex, path, title, type]);

  return null;
}

export const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: 'DivineDhenu',
  url: SITE_URL,
  image: DEFAULT_IMAGE,
  description: DEFAULT_DESCRIPTION,
  email: 'divinedhenu@gmail.com',
  telephone: '+918140243960',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Titanium City Center Mall, G-604, 100 Feet Rd, Anandnagar',
    addressLocality: 'Ahmedabad',
    addressRegion: 'Gujarat',
    postalCode: '380058',
    addressCountry: 'IN',
  },
  areaServed: ['Ahmedabad', 'Gandhinagar', 'Gujarat', 'India'],
  legalName: 'N.K. Enterprise',
  slogan: 'Purity, Tradition and Spirituality',
  sameAs: ['https://www.instagram.com/divinedhenu'],
};

export const siteSearchJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'DivineDhenu',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/shop?search={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export const seoDefaults = {
  siteUrl: SITE_URL,
  defaultImage: DEFAULT_IMAGE,
  defaultTitle: DEFAULT_TITLE,
  defaultDescription: DEFAULT_DESCRIPTION,
  defaultKeywords: DEFAULT_KEYWORDS,
};
