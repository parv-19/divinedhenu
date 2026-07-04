import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ImageUploader from '../components/ImageUploader.jsx';
import adminApi, { getErrorMessage } from '../services/adminApi.js';

const initialForm = {
  title: '',
  subtitle: '',
  buttonText: '',
  buttonLink: '',
  position: 'home_hero',
  sortOrder: 0,
  isActive: true,
};

export default function BannerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(initialForm);
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [optionalFields, setOptionalFields] = useState({
    title: true,
    subtitle: true,
    button: true,
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    adminApi.get(`/admin/banners/${id}`).then(({ data }) => {
      const banner = data.banner;
      setForm({
        title: banner.title || '',
        subtitle: banner.subtitle || '',
        buttonText: banner.buttonText || '',
        buttonLink: banner.buttonLink || '',
        position: banner.position || 'home_hero',
        sortOrder: banner.sortOrder || 0,
        isActive: Boolean(banner.isActive),
      });
      setImages(banner.image?.url ? [banner.image] : []);
      setOptionalFields({
        title: Boolean(banner.title),
        subtitle: Boolean(banner.subtitle),
        button: Boolean(banner.buttonText || banner.buttonLink),
      });
    }).catch((error) => setMessage(getErrorMessage(error)));
  }, [id, isEdit]);

  const update = (key, value) => setForm({ ...form, [key]: value });

  const submit = async (event) => {
    event.preventDefault();
    if (!images[0] && !files[0]) {
      setMessage('Banner image is required.');
      return;
    }

    setLoading(true);
    setMessage('');
    const body = new FormData();
    const bannerForm = {
      ...form,
      title: optionalFields.title ? form.title : '',
      subtitle: optionalFields.subtitle ? form.subtitle : '',
      buttonText: optionalFields.button ? form.buttonText : '',
      buttonLink: optionalFields.button ? form.buttonLink : '',
    };
    Object.entries(bannerForm).forEach(([key, value]) => body.append(key, value));
    if (images[0]) body.append('image', JSON.stringify(images[0]));
    if (files[0]) body.append('image', files[0]);

    try {
      if (isEdit) await adminApi.put(`/admin/banners/${id}`, body);
      else await adminApi.post('/admin/banners', body);
      navigate('/admin/banners');
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <h1 className="font-serif text-3xl text-ritual-text">{isEdit ? 'Edit Banner' : 'Add Banner'}</h1>
        <p className="mt-1 text-sm text-ritual-muted">Use position Home hero to add slides to the homepage carousel.</p>
      </div>
      {message ? <p className="rounded-md bg-ritual-card px-3 py-2 text-sm text-ritual-muted">{message}</p> : null}

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4 rounded-lg border border-ritual-border bg-ritual-card p-5">
          <OptionalField label="Title" enabled={optionalFields.title} onToggle={(enabled) => setOptionalFields({ ...optionalFields, title: enabled })}>
            <Field value={form.title} onChange={(value) => update('title', value)} />
          </OptionalField>
          <OptionalField label="Subtitle" enabled={optionalFields.subtitle} onToggle={(enabled) => setOptionalFields({ ...optionalFields, subtitle: enabled })}>
            <Field value={form.subtitle} onChange={(value) => update('subtitle', value)} />
          </OptionalField>
          <OptionalField label="Button" enabled={optionalFields.button} onToggle={(enabled) => setOptionalFields({ ...optionalFields, button: enabled })}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Button text" value={form.buttonText} onChange={(value) => update('buttonText', value)} />
              <Field label="Button link" value={form.buttonLink} onChange={(value) => update('buttonLink', value)} />
            </div>
          </OptionalField>
          <label className="block">
            <span className="text-sm font-medium text-ritual-text">Position</span>
            <select value={form.position} onChange={(event) => update('position', event.target.value)} className="focus-ring mt-1 w-full rounded-md border border-ritual-border bg-ritual-background px-3 py-2 text-sm">
              <option value="home_hero">Home carousel</option>
              <option value="shop_top">Shop top</option>
            </select>
          </label>
          <Field type="number" label="Sort order" value={form.sortOrder} onChange={(value) => update('sortOrder', value)} />
          <Toggle label="Active" checked={form.isActive} onChange={(value) => update('isActive', value)} />
        </div>

        <div className="rounded-lg border border-ritual-border bg-ritual-card p-5">
          <p className="mb-3 text-sm font-medium text-ritual-text">Banner image</p>
          <ImageUploader images={images} files={files} onImagesChange={setImages} onFilesChange={setFiles} />
        </div>
      </div>

      <button type="submit" disabled={loading} className="focus-ring rounded-md bg-ritual-text px-5 py-3 text-sm font-semibold text-ritual-card disabled:opacity-60">
        {loading ? 'Saving...' : 'Save banner'}
      </button>
    </form>
  );
}

function Field({ label, value, onChange, type = 'text', required = false }) {
  return (
    <label className="block">
      {label ? <span className="text-sm font-medium text-ritual-text">{label}</span> : null}
      <input required={required} type={type} value={value || ''} onChange={(event) => onChange(event.target.value)} className="focus-ring mt-1 w-full rounded-md border border-ritual-border bg-ritual-background px-3 py-2 text-sm" />
    </label>
  );
}

function OptionalField({ label, enabled, onToggle, children }) {
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
      {enabled ? <div className="mt-2">{children}</div> : <p className="mt-1 text-xs text-ritual-muted">Disabled for this banner</p>}
    </div>
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
