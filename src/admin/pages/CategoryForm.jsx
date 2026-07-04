import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ImageUploader from '../components/ImageUploader.jsx';
import adminApi, { getErrorMessage } from '../services/adminApi.js';

const initialForm = {
  name: '',
  description: '',
  sortOrder: 0,
  isActive: true,
  seoTitle: '',
  seoDescription: '',
};

export default function CategoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(initialForm);
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    adminApi.get(`/admin/categories/${id}`).then(({ data }) => {
      const category = data.category;
      setForm({
        name: category.name || '',
        description: category.description || '',
        sortOrder: category.sortOrder || 0,
        isActive: Boolean(category.isActive),
        seoTitle: category.seoTitle || '',
        seoDescription: category.seoDescription || '',
      });
      setImages(category.image?.url ? [category.image] : []);
    }).catch((error) => setMessage(getErrorMessage(error)));
  }, [id, isEdit]);

  const submit = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setMessage('Category name is required.');
      return;
    }

    setLoading(true);
    setMessage('');
    const body = new FormData();
    Object.entries(form).forEach(([key, value]) => body.append(key, value));
    if (images[0]) body.append('image', JSON.stringify(images[0]));
    if (files[0]) body.append('image', files[0]);

    try {
      if (isEdit) await adminApi.put(`/admin/categories/${id}`, body);
      else await adminApi.post('/admin/categories', body);
      navigate('/admin/categories');
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <h1 className="font-serif text-3xl text-ritual-text">{isEdit ? 'Edit Category' : 'Add Category'}</h1>
        <p className="mt-1 text-sm text-ritual-muted">Keep category metadata tidy for the storefront.</p>
      </div>
      {message ? <p className="rounded-md bg-ritual-card px-3 py-2 text-sm text-ritual-muted">{message}</p> : null}
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4 rounded-lg border border-ritual-border bg-ritual-card p-5">
          <Field required label="Name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
          <Field textarea label="Description" value={form.description} onChange={(value) => setForm({ ...form, description: value })} />
          <Field type="number" label="Sort order" value={form.sortOrder} onChange={(value) => setForm({ ...form, sortOrder: value })} />
          <Toggle label="Active" checked={form.isActive} onChange={(value) => setForm({ ...form, isActive: value })} />
          <Field label="SEO title" value={form.seoTitle} onChange={(value) => setForm({ ...form, seoTitle: value })} />
          <Field textarea label="SEO description" value={form.seoDescription} onChange={(value) => setForm({ ...form, seoDescription: value })} />
        </div>
        <div className="rounded-lg border border-ritual-border bg-ritual-card p-5">
          <p className="mb-3 text-sm font-medium text-ritual-text">Category image</p>
          <ImageUploader images={images} files={files} onImagesChange={setImages} onFilesChange={setFiles} />
        </div>
      </div>
      <button type="submit" disabled={loading} className="focus-ring rounded-md bg-ritual-text px-5 py-3 text-sm font-semibold text-ritual-card disabled:opacity-60">
        {loading ? 'Saving...' : 'Save category'}
      </button>
    </form>
  );
}

function Field({ label, value, onChange, textarea = false, type = 'text', required = false }) {
  const Component = textarea ? 'textarea' : 'input';
  return (
    <label className="block">
      <span className="text-sm font-medium text-ritual-text">{label}</span>
      <Component required={required} type={type} value={value} rows={textarea ? 4 : undefined} onChange={(event) => onChange(event.target.value)} className="focus-ring mt-1 w-full rounded-md border border-ritual-border bg-ritual-background px-3 py-2 text-sm" />
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
