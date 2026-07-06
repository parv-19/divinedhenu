import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Container from '../components/common/Container.jsx';
import ProductCard from '../components/common/ProductCard.jsx';
import SEO, { localBusinessJsonLd, siteSearchJsonLd } from '../components/common/SEO.jsx';
import { publicApi } from '../services/api.js';

const cdn = (path) => `https://www.jpgrouponline.com/cdn/shop/files/${path}`;

const fallbackCategories = [
  ['Camphor', 'CamphorNaturalAir-Front.jpg?v=1697292550'],
  ['Dhoop', '01-2_b19f9320-3f5c-43b7-bdd6-fe2be3a7154b.jpg?v=1697285254'],
  ['Incense Sticks', '01-7.jpg?v=1698821303'],
  ['Organic Gulal', '02_Gulal.jpg?v=1740476906'],
  ['Gifting', 'heritage_1.jpg?v=1752993204'],
  ['Aromaholic Perfume', 'Coastiera2.jpg?v=1760535819'],
];

const comboProducts = [
  product('combo-1', 'Premium Dhoop Stick Combo Pack - 8 Fragrances Collection', 'PremiumDhoopStickCollection.jpg?v=1707890101', 612, 720, 1),
  product('combo-2', 'Combo - Gir Gauree Cowdung Collection', 'GirGaureeCowdungCollection.jpg?v=1707889785', 527, 620),
  product('combo-3', 'Combo - Organic Luxury Collection - Dhoop Cup', 'OrganicLuxuryCollectionDhoopcup.jpg?v=1707889887', 510, 600),
  product('combo-4', 'Organic Holi Gulal 400gm Combo Pack - 4 Colors Natural Flower Gulal', '01-Holicolor.jpg?v=1708437707', 540, 600, 5),
];

const dhoopProducts = [
  product('dhoop-1', 'Kasturi Dhoop Cup', '01-2_1_bae94d8f-2775-4953-8541-a32cb781f92b.jpg?v=1697284328', 126, 140, 2),
  product('dhoop-2', 'Panchamrita Sambrani Cups', '01-1_8.jpg?v=1697638949', 76.5, 85),
  product('dhoop-3', 'Panchamrita Jumbo Cowdung Cups', 'Openproduct_bf8acf2b-e483-4ee9-89b1-98f4d71c3174.jpg?v=1697811638', 126, 140, 1),
  product('dhoop-4', 'Gir Gauree - Cow Dung Dhoop Cup - Organic Luxury Collection (Pack of 12 Cups)', '01-1_6.jpg?v=1697638587', 270, 300, 2),
];

function product(id, name, image, price, originalPrice, reviewCount = 0) {
  return {
    id,
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    category: 'Sale',
    price,
    originalPrice,
    reviewCount,
    rating: reviewCount ? 5 : 0,
    image: cdn(image),
    moodTags: [],
    stockStatus: 'In stock',
  };
}

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [homeCategories, setHomeCategories] = useState([]);
  const [homeBanners, setHomeBanners] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [instagramUrl, setInstagramUrl] = useState('');

  useEffect(() => {
    Promise.all([
      publicApi.getCategories(),
      publicApi.getProducts({ limit: 100, sort: 'newest' }),
    ])
      .then(([items, productData]) => {
        const cleanCategories = items
          .filter((item) => item?.name)
          .map((item) => ({
            id: item._id || item.id || item.slug || item.name,
            name: item.name,
            image: item.image?.url || '',
          }));

        setHomeCategories(
          cleanCategories,
        );

        setFeaturedProducts((productData.products || []).slice(0, 5));
      })
      .catch(() => {
        const fallbackCategoryItems = fallbackCategories.map(([name, image]) => ({
          id: name,
          name,
          image: cdn(image),
        }));
        setHomeCategories(fallbackCategoryItems);
        setFeaturedProducts([...comboProducts, ...dhoopProducts].slice(0, 5));
      });
  }, []);

  useEffect(() => {
    publicApi
      .getBanners('home_hero')
      .then((banners) => {
        setHomeBanners(
          banners
            .filter((banner) => banner.image?.url)
            .map((banner) => ({
              title: banner.title,
              subtitle: banner.subtitle,
              image: banner.image.url,
              buttonText: banner.buttonText,
              buttonLink: banner.buttonLink,
            })),
        );
      })
      .catch(() => setHomeBanners([]));
  }, []);

  useEffect(() => {
    publicApi
      .getSiteSettings()
      .then((settings) => setInstagramUrl(normalizeInstagramUrl(settings?.instagram)))
      .catch(() => setInstagramUrl(''));
  }, []);

  const carouselSlides = homeBanners;
  const slide = carouselSlides.length ? carouselSlides[activeSlide % carouselSlides.length] : null;

  useEffect(() => {
    if (carouselSlides.length < 2) return undefined;

    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % carouselSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [carouselSlides.length]);

  return (
    <div className="bg-white text-[#121212]">
      <SEO
        title="DivineDhenu Ahmedabad | Dhoop, Incense, Havan Cups and Puja Fragrance"
        description="Buy premium dhoop cups, incense sticks, havan cups, camphor and ritual fragrance gifts online from DivineDhenu in Ahmedabad, Gandhinagar and across Gujarat."
        path="/"
        keywords="dhoop in Ahmedabad, incense sticks Ahmedabad, puja fragrance Gujarat, havan cups Gandhinagar, DivineDhenu, dhoop cups online Gujarat"
        jsonLd={[localBusinessJsonLd, siteSearchJsonLd]}
      />
      {slide ? (
        <section className="relative min-h-[290px] overflow-hidden md:min-h-[520px]">
          {carouselSlides.map((item, index) => (
            <div
              key={`${item.image}-${index}`}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${index === activeSlide % carouselSlides.length ? 'opacity-100' : 'opacity-0'}`}
              style={{ backgroundImage: `url(${item.image})` }}
            />
          ))}
          {slide.title || slide.subtitle || slide.buttonText ? <div className="absolute inset-0 bg-black/45" /> : null}
          {slide.title || slide.subtitle || slide.buttonText ? (
            <Container className="relative z-10 flex min-h-[290px] items-center md:min-h-[520px]">
              <div className="max-w-xl text-[#e5be43]">
                {slide.title ? <h1 className="font-serif text-4xl font-bold leading-tight sm:text-6xl lg:text-7xl">{slide.title}</h1> : null}
                {slide.subtitle ? <p className="mt-3 text-lg font-medium sm:mt-4 sm:text-3xl">{slide.subtitle}</p> : null}
                {slide.buttonText && slide.buttonLink ? (
                  <Link to={slide.buttonLink} className="mt-5 inline-flex rounded-md bg-white px-5 py-3 text-sm font-semibold text-[#2d1b0d] transition hover:bg-[#f7f1e8]">
                    {slide.buttonText}
                  </Link>
                ) : null}
              </div>
            </Container>
          ) : null}
          {carouselSlides.length > 1 ? (
            <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
              {carouselSlides.map((item, index) => (
                <button
                  key={`${item.image}-${index}`}
                  type="button"
                  className={`h-2.5 rounded-full transition-all ${index === activeSlide % carouselSlides.length ? 'w-8 bg-white' : 'w-2.5 bg-white/60'}`}
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Show banner ${index + 1}`}
                />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="py-8 sm:py-10">
        <Container>
          <h2 className="text-center text-2xl font-bold tracking-wide sm:text-3xl">Shop By Category</h2>
          <div className="mt-6 grid grid-cols-3 gap-x-3 gap-y-6 sm:mt-8 sm:gap-7 lg:grid-cols-6">
            {homeCategories.map((category) => (
              <Link key={category.id} to={`/shop?category=${encodeURIComponent(category.name)}`} className="group text-center">
                <div className="mx-auto grid h-20 w-20 place-items-center overflow-hidden rounded-full border-4 border-white bg-white shadow-[0_3px_14px_rgba(0,0,0,0.2)] transition group-hover:-translate-y-1 sm:h-32 sm:w-32">
                  {category.image ? (
                    <img src={category.image} alt={category.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="px-3 text-center text-sm font-semibold text-[#6b4a2c]">{category.name}</span>
                  )}
                </div>
                <p className="mt-3 text-xs font-medium leading-snug sm:mt-6 sm:text-xl">{category.name}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {featuredProducts.length ? (
        <ProductSection
          title="Featured Products"
          products={featuredProducts}
          viewAll="/shop"
        />
      ) : null}

      {instagramUrl ? <InstagramSection instagramUrl={instagramUrl} /> : null}
    </div>
  );
}

function InstagramSection({ instagramUrl }) {
  useEffect(() => {
    const processEmbeds = () => window.instgrm?.Embeds?.process();
    const existingScript = document.querySelector('script[src="https://www.instagram.com/embed.js"]');

    if (existingScript) {
      processEmbeds();
      existingScript.addEventListener('load', processEmbeds);
      return () => existingScript.removeEventListener('load', processEmbeds);
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.instagram.com/embed.js';
    script.addEventListener('load', processEmbeds);
    document.body.appendChild(script);

    return () => script.removeEventListener('load', processEmbeds);
  }, [instagramUrl]);

  return (
    <section className="py-12">
      <Container>
        <h2 className="text-center text-2xl font-medium tracking-wide sm:text-3xl">Connect Us @ Instagram</h2>
        <div className="mx-auto mt-8 flex max-w-xl flex-col items-center">
          <blockquote
            key={instagramUrl}
            className="instagram-media w-full"
            data-instgrm-permalink={instagramUrl}
            data-instgrm-version="14"
          />
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex rounded-lg bg-[#111] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2a2a2a]"
          >
            View Instagram profile
          </a>
        </div>
      </Container>
    </section>
  );
}

function normalizeInstagramUrl(value) {
  if (!value) return '';

  try {
    const url = new URL(value);
    if (!['instagram.com', 'www.instagram.com'].includes(url.hostname.toLowerCase())) return '';
    url.hostname = 'www.instagram.com';
    url.search = '';
    url.hash = '';
    return url.toString();
  } catch {
    return '';
  }
}

function ProductSection({ title, products, viewAll, uppercase = false }) {
  return (
    <section className="py-8 sm:py-10">
      <Container>
        <h2 className={`text-center text-2xl font-medium tracking-wide sm:text-4xl ${uppercase ? 'uppercase' : ''}`}>{title}</h2>
        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to={viewAll} className="inline-flex rounded-lg bg-[#111] px-10 py-4 text-lg font-medium text-white shadow-sm transition hover:bg-[#2a2a2a]">
            View all
          </Link>
        </div>
      </Container>
    </section>
  );
}
