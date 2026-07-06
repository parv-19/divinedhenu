import { ChevronDown } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import Container from '../components/common/Container.jsx';
import ProductCard from '../components/common/ProductCard.jsx';
import SEO from '../components/common/SEO.jsx';
import { fallback, publicApi } from '../services/api.js';

const sortOptions = [
  ['newest', 'Date, new to old'],
  ['priceLow', 'Price, low to high'],
  ['priceHigh', 'Price, high to low'],
];

export default function Shop() {
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const [category, setCategory] = useState(params.get('category') || 'All');
  const [searchTerm, setSearchTerm] = useState(params.get('search') || '');
  const [sort, setSort] = useState('newest');
  const [openDropdown, setOpenDropdown] = useState('');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setCategory(params.get('category') || 'All');
    setSearchTerm(params.get('search') || '');
  }, [params]);

  useEffect(() => {
    setLoading(true);
    setError('');

    Promise.all([
      publicApi.getCategories(),
      publicApi.getProducts({ limit: 100, sort }),
    ])
      .then(([categoryData, productData]) => {
        const dbCategories = categoryData.map((item) => item.name).filter(Boolean);
        setCategories(['All', ...dbCategories]);
        setProducts(productData.products || []);
      })
      .catch(() => {
        setError('Live catalog is unavailable, showing fallback products.');
        setCategories(fallback.categories);
        setProducts(fallback.products);
      })
      .finally(() => setLoading(false));
  }, [sort]);

  const isAgarbattiCollection = location.pathname === '/collections/agarbatti';

  const filteredProducts = useMemo(() => (
    applyFilters(products, { category, searchTerm, sort, isAgarbattiCollection })
  ), [products, category, isAgarbattiCollection, searchTerm, sort]);

  const pageTitle = isAgarbattiCollection ? 'Agarbatti & Incense Sticks' : category === 'All' ? 'Shop' : category;

  const updateCategory = (nextCategory) => {
    setCategory(nextCategory);
    setOpenDropdown('');
    setParams(nextCategory === 'All' ? {} : { category: nextCategory });
  };

  const closeDropdown = () => setOpenDropdown('');

  return (
    <section className="bg-white py-7 text-[#121212] md:py-14">
      <SEO
        title={isAgarbattiCollection ? 'Shop Bamboo-less Agarbatti and Incense Sticks Online | DivineDhenu' : `${pageTitle === 'Shop' ? 'Shop Dhoop, Incense and Puja Products' : `Shop ${pageTitle}`} | DivineDhenu Gujarat`}
        description={isAgarbattiCollection ? 'Shop DivineDhenu bamboo-less agarbatti, chemical-free incense sticks, Gir cow dung dhoop and natural fragrance products online in Ahmedabad, Gandhinagar and Gujarat.' : 'Explore DivineDhenu dhoop cups, bamboo-less agarbatti, incense, havan cups, camphor, organic puja products and gifting combos with delivery in Ahmedabad, Gandhinagar and across Gujarat.'}
        path={isAgarbattiCollection ? '/collections/agarbatti' : '/shop'}
        keywords="shop agarbatti online, bamboo-less agarbatti, chemical-free incense, incense sticks Gujarat, dhoop cups Ahmedabad, puja products Gandhinagar, Gir cow dung dhoop, havan cups online, DivineDhenu shop"
      />
      <Container>
        <div className="mb-6 md:mb-10">
          <h1 className="text-3xl font-medium tracking-wide md:text-5xl">{pageTitle}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 tracking-wide text-[#777] md:mt-8 md:text-base">
            {isAgarbattiCollection
              ? 'Pure, chemical-free and bamboo-less agarbatti, incense and dhoop products made with natural herbs, essential oils and Gir cow dung tradition for homes across Ahmedabad, Gandhinagar and Gujarat.'
              : searchTerm
                ? `${filteredProducts.length} products matching "${searchTerm}"`
              : `${filteredProducts.length} products`}
          </p>
          {isAgarbattiCollection ? <p className="mt-2 text-sm tracking-wide text-[#777]">{filteredProducts.length} products</p> : null}
        </div>

        <div className="relative z-30 mb-7 flex flex-col gap-4 text-sm tracking-wide text-[#4a4a4a] md:mb-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="-mx-4 flex max-w-5xl items-center gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:gap-x-8 sm:gap-y-5 sm:overflow-visible sm:px-0">
            <span className="mr-1 shrink-0 text-[#121212]">Filter:</span>
            <DropdownFilter
              id="category"
              label="Category"
              value={category}
              options={categories.map((item) => [item, item === 'All' ? 'Category' : item])}
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              onChange={updateCategory}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-7 lg:justify-end">
            <span className="mr-1 text-[#121212]">Sort by:</span>
            <DropdownFilter
              id="sort"
              label="Sort by"
              value={sort}
              options={sortOptions}
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              align="right"
              onChange={(value) => {
                setSort(value);
                closeDropdown();
              }}
            />
            {loading ? <span className="text-[#777]">Loading...</span> : null}
          </div>
        </div>

        {error ? <p className="mb-5 rounded-lg bg-[#fbf3e8] px-4 py-3 text-sm text-[#6b4a2c]">{error}</p> : null}

        {loading ? (
          <div className="relative z-0 grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 8 }).map((_, index) => <div key={index} className="h-80 animate-pulse rounded-lg bg-[#f2f2f2]" />)}
          </div>
        ) : null}

        {!loading && filteredProducts.length ? (
          <div className="relative z-0 grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProducts.map((item) => <ProductCard key={item.id || item._id} product={item} />)}
          </div>
        ) : null}

        {!loading && !filteredProducts.length ? (
          <div className="rounded-lg border border-[#eee] p-10 text-center">
            <h3 className="text-2xl">No products found</h3>
            <p className="mt-3 text-[#666]">Try another category.</p>
          </div>
        ) : null}
      </Container>
    </section>
  );
}

function DropdownFilter({ id, label, value, options, openDropdown, setOpenDropdown, onChange, align = 'left' }) {
  const selected = options.find(([optionValue]) => optionValue === value)?.[1] || label;
  const isOpen = openDropdown === id;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpenDropdown(isOpen ? '' : id)}
        className="inline-flex min-h-9 items-center gap-1.5 whitespace-nowrap rounded-full border border-[#e9dfd4] bg-white px-3 py-1 text-xs text-[#333] transition hover:border-[#b88746] hover:text-[#b88746] sm:min-h-8 sm:rounded-none sm:border-0 sm:px-0 sm:text-sm"
        aria-expanded={isOpen}
      >
        <span>{selected}</span>
        <ChevronDown className={`transition ${isOpen ? 'rotate-180' : ''}`} size={15} />
      </button>

      {isOpen ? (
        <div className={`absolute top-full z-50 mt-3 max-h-72 w-60 overflow-auto rounded-md border border-[#ded7ce] bg-white py-2 shadow-[0_16px_40px_rgba(0,0,0,0.16)] ${align === 'right' ? 'right-0' : 'left-0'}`}>
          {options.map(([optionValue, optionLabel]) => (
            <button
              key={optionValue}
              type="button"
              onClick={() => onChange(optionValue)}
              className={`block w-full px-4 py-2 text-left text-sm transition hover:bg-[#f7f1e8] ${value === optionValue ? 'font-semibold text-[#b88746]' : 'text-[#333]'}`}
            >
              {optionLabel}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function applyFilters(source, { category, searchTerm, sort, isAgarbattiCollection }) {
  let result = [...source];

  if (searchTerm) {
    const normalizedSearch = searchTerm.toLowerCase();
    result = result.filter((item) => {
      const haystack = [item.name, item.category, item.shortDescription, item.description, ...(item.moodTags || [])].join(' ').toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }

  if (isAgarbattiCollection) {
    result = result.filter((item) => {
      const haystack = [item.name, item.category, item.shortDescription, item.description].join(' ').toLowerCase();
      return ['agarbatti', 'incense', 'dhoop'].some((term) => haystack.includes(term));
    });
  }

  if (category !== 'All') {
    result = result.filter((item) => item.category === category || item.category?.name === category);
  }

  if (sort === 'priceLow') result.sort((a, b) => Number(a.price) - Number(b.price));
  if (sort === 'priceHigh') result.sort((a, b) => Number(b.price) - Number(a.price));

  return result;
}
