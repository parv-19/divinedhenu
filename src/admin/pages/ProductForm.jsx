import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import ImageUploader from '../components/ImageUploader.jsx';
import adminApi, { getErrorMessage } from '../services/adminApi.js';

const initialForm = {
  name: '',
  category: '',
  price: '',
  originalPrice: '',
  sku: '',
  stock: 0,
  description: '',
  ritualUse: '',
  ingredients: '',
  howToUse: '',
  isBestseller: false,
  isFeatured: false,
  isActive: true,
  metaTitle: '',
  metaDescription: '',
};

export default function ProductForm() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(initialForm);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [optionalFields, setOptionalFields] = useState({
    ritualUse: false,
    ingredients: false,
    howToUse: false,
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    adminApi.get('/admin/categories').then(({ data }) => {
      const nextCategories = data.categories || [];
      setCategories(nextCategories);
      const categoryFromUrl = searchParams.get('category');
      if (!isEdit && categoryFromUrl && nextCategories.some((category) => category._id === categoryFromUrl)) {
        setForm((current) => ({ ...current, category: categoryFromUrl }));
      }
    });
  }, [isEdit, searchParams]);

  useEffect(() => {
    if (!isEdit) return;
    adminApi.get(`/admin/products/${id}`).then(({ data }) => {
      const product = data.product;
      setForm({
        ...initialForm,
        ...product,
        category: product.category?._id || product.category || '',
      });
      setImages(product.images || []);
      setOptionalFields({
        ritualUse: Boolean(product.ritualUse),
        ingredients: Boolean(product.ingredients),
        howToUse: Boolean(product.howToUse),
      });
    }).catch((error) => setMessage(getErrorMessage(error)));
  }, [id, isEdit]);

  const update = (key, value) => setForm({ ...form, [key]: value });

  const submit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.category || !form.price || !form.description.trim()) {
      setMessage('Name, category, price, and description are required.');
      return;
    }
    if (images.length + files.length < 1 || images.length + files.length > 4) {
      setMessage('Add at least 1 product image and up to 4 images.');
      return;
    }

    setLoading(true);
    setMessage('');
    const body = new FormData();
    const {
      moodTags,
      ritualMoods,
      fragranceNotes,
      shortDescription,
      ...productForm
    } = form;
    Object.keys(optionalFields).forEach((key) => {
      if (!optionalFields[key]) productForm[key] = '';
    });
    Object.entries({
      ...productForm,
      images: JSON.stringify(images),
    }).forEach(([key, value]) => body.append(key, value));
    files.forEach((file) => body.append('images', file));

    try {
      if (isEdit) await adminApi.put(`/admin/products/${id}`, body);
      else await adminApi.post('/admin/products', body);
      navigate('/admin/products');
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <h1 className="font-serif text-3xl text-ritual-text">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
        <p className="mt-1 text-sm text-ritual-muted">Build a complete product profile for the storefront.</p>
      </div>
      {message ? <p className="rounded-md bg-ritual-card px-3 py-2 text-sm text-ritual-muted">{message}</p> : null}

      <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <Panel title="Basics">
            <Field required label="Name" value={form.name} onChange={(value) => update('name', value)} />
            <label className="block">
              <span className="text-sm font-medium text-ritual-text">Category</span>
              <select required value={form.category} onChange={(event) => update('category', event.target.value)} className="focus-ring mt-1 w-full rounded-md border border-ritual-border bg-ritual-background px-3 py-2 text-sm">
                <option value="">Select category</option>
                {categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}
              </select>
            </label>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field required type="number" label="Price" value={form.price} onChange={(value) => update('price', value)} />
              <Field type="number" label="Original price" value={form.originalPrice} onChange={(value) => update('originalPrice', value)} />
              <Field type="number" label="Stock" value={form.stock} onChange={(value) => update('stock', value)} />
            </div>
            <Field label="SKU" value={form.sku} onChange={(value) => update('sku', value)} />
          </Panel>

          <Panel title="Descriptions">
            <Field required textarea label="Description" value={form.description} onChange={(value) => update('description', value)} />
            <OptionalField
              label="Ritual use"
              enabled={optionalFields.ritualUse}
              onToggle={(enabled) => setOptionalFields({ ...optionalFields, ritualUse: enabled })}
              value={form.ritualUse}
              onChange={(value) => update('ritualUse', value)}
            />
            <OptionalField
              textarea
              label="Ingredients"
              enabled={optionalFields.ingredients}
              onToggle={(enabled) => setOptionalFields({ ...optionalFields, ingredients: enabled })}
              value={form.ingredients}
              onChange={(value) => update('ingredients', value)}
            />
            <OptionalField
              textarea
              label="How to use"
              enabled={optionalFields.howToUse}
              onToggle={(enabled) => setOptionalFields({ ...optionalFields, howToUse: enabled })}
              value={form.howToUse}
              onChange={(value) => update('howToUse', value)}
            />
          </Panel>

          <Panel title="SEO">
            <Field label="Meta title" value={form.metaTitle} onChange={(value) => update('metaTitle', value)} />
            <Field textarea label="Meta description" value={form.metaDescription} onChange={(value) => update('metaDescription', value)} />
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel title="Images">
            <ImageUploader multiple images={images} files={files} onImagesChange={setImages} onFilesChange={setFiles} />
          </Panel>
          <Panel title="Flags">
            <Toggle label="Active" checked={form.isActive} onChange={(value) => update('isActive', value)} />
            <Toggle label="Bestseller" checked={form.isBestseller} onChange={(value) => update('isBestseller', value)} />
            <Toggle label="Featured" checked={form.isFeatured} onChange={(value) => update('isFeatured', value)} />
          </Panel>
        </div>
      </div>

      <button type="submit" disabled={loading} className="focus-ring rounded-md bg-ritual-text px-5 py-3 text-sm font-semibold text-ritual-card disabled:opacity-60">
        {loading ? 'Saving...' : 'Save product'}
      </button>
    </form>
  );
}

function Panel({ title, children }) {
  return (
    <section className="space-y-4 rounded-lg border border-ritual-border bg-ritual-card p-5">
      <h2 className="font-serif text-xl text-ritual-text">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, value, onChange, textarea = false, type = 'text', required = false, maxLength, showCount = false }) {
  const Component = textarea ? 'textarea' : 'input';
  return (
    <label className="block">
      {label ? <span className="text-sm font-medium text-ritual-text">{label}</span> : null}
      <Component required={required} type={type} maxLength={maxLength} value={value || ''} rows={textarea ? 4 : undefined} onChange={(event) => onChange(event.target.value)} className="focus-ring mt-1 w-full rounded-md border border-ritual-border bg-ritual-background px-3 py-2 text-sm" />
      {showCount ? <span className="mt-1 block text-right text-xs text-ritual-muted">{String(value || '').length}/{maxLength}</span> : null}
    </label>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 text-sm font-medium text-ritual-text">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 accent-ritual-gold" />
      {label}
    </label>
  );
}

function OptionalField({ label, enabled, onToggle, ...props }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-ritual-text">{label}</span>
        <button
          type="button"
          onClick={() => onToggle(!enabled)}
          className={`relative h-6 w-11 rounded-full transition ${enabled ? 'bg-ritual-gold' : 'bg-ritual-border'}`}
          aria-pressed={enabled}
          aria-label={`${enabled ? 'Disable' : 'Enable'} ${label}`}
        >
          <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${enabled ? 'left-6' : 'left-1'}`} />
        </button>
      </div>
      {enabled ? <Field {...props} /> : <p className="mt-1 text-xs text-ritual-muted">Disabled for this product</p>}
    </div>
  );
}
