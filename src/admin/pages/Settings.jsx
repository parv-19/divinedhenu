import { useEffect, useState } from 'react';
import ImageUploader from '../components/ImageUploader.jsx';
import adminApi, { getErrorMessage } from '../services/adminApi.js';

const initialForm = {
  brandName: '',
  aboutEyebrow: '',
  aboutHeroTitle: '',
  aboutHeroDescription: '',
  aboutButtonText: '',
  aboutButtonLink: '',
  aboutStoryTitle: '',
  aboutStoryDescription: '',
  aboutValue1: '',
  aboutValue2: '',
  aboutValue3: '',
  aboutValue4: '',
  aboutProcessTitle: '',
  aboutProcessDescription: '',
  aboutProcessStep1: '',
  aboutProcessStep2: '',
  aboutProcessStep3: '',
  aboutProcessStep4: '',
  email: '',
  phone: '',
  whatsapp: '',
  instagram: '',
  facebook: '',
  youtube: '',
  address: '',
  footerText: '',
  newsletterTitle: '',
  newsletterDescription: '',
  seoDefaultTitle: '',
  seoDefaultDescription: '',
};

export default function Settings() {
  const [form, setForm] = useState(initialForm);
  const [logo, setLogo] = useState([]);
  const [logoFile, setLogoFile] = useState([]);
  const [aboutImage, setAboutImage] = useState([]);
  const [aboutImageFile, setAboutImageFile] = useState([]);
  const [navbarLogo, setNavbarLogo] = useState([]);
  const [navbarLogoFile, setNavbarLogoFile] = useState([]);
  const [brandWordmark, setBrandWordmark] = useState([]);
  const [brandWordmarkFile, setBrandWordmarkFile] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    adminApi.get('/admin/site-settings').then(({ data }) => {
      const settings = data.settings || {};
      setForm({ ...initialForm, ...settings });
      setLogo(settings.logo?.url ? [settings.logo] : []);
      setAboutImage(settings.aboutImage?.url ? [settings.aboutImage] : []);
      setNavbarLogo(settings.navbarLogo?.url ? [settings.navbarLogo] : []);
      setBrandWordmark(settings.brandWordmark?.url ? [settings.brandWordmark] : []);
    }).catch((error) => setMessage(getErrorMessage(error)));
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    const body = new FormData();
    const {
      logo: ignoredLogo,
      aboutImage: ignoredAboutImage,
      navbarLogo: ignoredNavbarLogo,
      brandWordmark: ignoredBrandWordmark,
      ...textFields
    } = form;
    Object.entries(textFields).forEach(([key, value]) => body.append(key, value || ''));
    if (logoFile[0]) body.append('logo', logoFile[0]);
    else if (logo.length) body.append('logo', JSON.stringify(logo[0]));
    if (aboutImageFile[0]) body.append('aboutImage', aboutImageFile[0]);
    else if (aboutImage.length) body.append('aboutImage', JSON.stringify(aboutImage[0]));
    else body.append('aboutImage', JSON.stringify({ url: '', publicId: '' }));
    if (navbarLogoFile[0]) body.append('navbarLogo', navbarLogoFile[0]);
    else if (navbarLogo.length) body.append('navbarLogo', JSON.stringify(navbarLogo[0]));
    if (brandWordmarkFile[0]) body.append('brandWordmark', brandWordmarkFile[0]);
    else if (brandWordmark.length) body.append('brandWordmark', JSON.stringify(brandWordmark[0]));

    try {
      const { data } = await adminApi.put('/admin/site-settings', body);
      setLogo(data.settings.logo?.url ? [data.settings.logo] : []);
      setLogoFile([]);
      setAboutImage(data.settings.aboutImage?.url ? [data.settings.aboutImage] : []);
      setAboutImageFile([]);
      setNavbarLogo(data.settings.navbarLogo?.url ? [data.settings.navbarLogo] : []);
      setNavbarLogoFile([]);
      setBrandWordmark(data.settings.brandWordmark?.url ? [data.settings.brandWordmark] : []);
      setBrandWordmarkFile([]);
      setMessage('Settings saved successfully.');
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-ritual-text">Site Settings</h1>
        <p className="mt-1 text-sm text-ritual-muted">Brand, footer, contact, and default SEO details.</p>
      </div>
      {message ? <p className="rounded-md bg-ritual-card px-3 py-2 text-sm text-ritual-muted">{message}</p> : null}
      <div className="rounded-lg border border-ritual-border bg-ritual-card p-5">
        <h2 className="font-serif text-2xl text-ritual-text">About Page</h2>
        <p className="mt-1 text-xs text-ritual-muted">Manage all visible content on the public About page. Leave a value card or process step blank to hide it.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Introduction label" value={form.aboutEyebrow} onChange={(value) => setForm({ ...form, aboutEyebrow: value })} />
          <Field label="Introduction title" value={form.aboutHeroTitle} onChange={(value) => setForm({ ...form, aboutHeroTitle: value })} />
          <Field textarea label="Introduction description" value={form.aboutHeroDescription} onChange={(value) => setForm({ ...form, aboutHeroDescription: value })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Button text" value={form.aboutButtonText} onChange={(value) => setForm({ ...form, aboutButtonText: value })} />
            <Field label="Button link" value={form.aboutButtonLink} onChange={(value) => setForm({ ...form, aboutButtonLink: value })} />
          </div>
        </div>
        <div className="mt-5">
          <p className="text-sm font-medium">Introduction image</p>
          <p className="mb-2 mt-1 text-xs text-ritual-muted">Shown beside the introduction. Recommended ratio: 4:3.</p>
          <ImageUploader images={aboutImage} files={aboutImageFile} onImagesChange={setAboutImage} onFilesChange={setAboutImageFile} />
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Story title" value={form.aboutStoryTitle} onChange={(value) => setForm({ ...form, aboutStoryTitle: value })} />
          <Field textarea label="Story description" value={form.aboutStoryDescription} onChange={(value) => setForm({ ...form, aboutStoryDescription: value })} />
          {['aboutValue1', 'aboutValue2', 'aboutValue3', 'aboutValue4'].map((key, index) => (
            <Field key={key} label={`Value card ${index + 1}`} value={form[key]} onChange={(value) => setForm({ ...form, [key]: value })} />
          ))}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Process title" value={form.aboutProcessTitle} onChange={(value) => setForm({ ...form, aboutProcessTitle: value })} />
          <Field textarea label="Process description" value={form.aboutProcessDescription} onChange={(value) => setForm({ ...form, aboutProcessDescription: value })} />
          {['aboutProcessStep1', 'aboutProcessStep2', 'aboutProcessStep3', 'aboutProcessStep4'].map((key, index) => (
            <Field key={key} label={`Process step ${index + 1}`} value={form[key]} onChange={(value) => setForm({ ...form, [key]: value })} />
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-ritual-border bg-ritual-card p-5">
        <Field label="Brand name fallback" value={form.brandName} onChange={(value) => setForm({ ...form, brandName: value })} />
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium">Navbar logo mark</p>
            <p className="mb-2 mt-1 text-xs text-ritual-muted">Square cow icon shown at the left of the header.</p>
            <ImageUploader images={navbarLogo} files={navbarLogoFile} onImagesChange={setNavbarLogo} onFilesChange={setNavbarLogoFile} />
          </div>
          <div>
            <p className="text-sm font-medium">Navbar brand wordmark</p>
            <p className="mb-2 mt-1 text-xs text-ritual-muted">Horizontal Divine Dhenu name image shown beside the logo.</p>
            <ImageUploader images={brandWordmark} files={brandWordmarkFile} onImagesChange={setBrandWordmark} onFilesChange={setBrandWordmarkFile} />
          </div>
        </div>
        <div className="mt-5">
          <p className="text-sm font-medium">Legacy combined logo</p>
          <p className="mb-2 mt-1 text-xs text-ritual-muted">Kept for compatibility with older footer data.</p>
          <ImageUploader images={logo} files={logoFile} onImagesChange={setLogo} onFilesChange={setLogoFile} />
        </div>
      </div>
      <div className="grid gap-4 rounded-lg border border-ritual-border bg-ritual-card p-5 md:grid-cols-2">
        {['email', 'phone', 'whatsapp', 'instagram', 'facebook', 'youtube'].map((key) => (
          <Field key={key} label={labelFor(key)} value={form[key]} onChange={(value) => setForm({ ...form, [key]: value })} />
        ))}
      </div>
      <div className="grid gap-4 rounded-lg border border-ritual-border bg-ritual-card p-5 md:grid-cols-2">
        {['address', 'footerText', 'newsletterTitle', 'newsletterDescription', 'seoDefaultTitle', 'seoDefaultDescription'].map((key) => (
          <Field key={key} textarea={key.includes('Description') || key === 'address'} label={labelFor(key)} value={form[key]} onChange={(value) => setForm({ ...form, [key]: value })} />
        ))}
      </div>
      <button type="submit" disabled={loading} className="focus-ring rounded-md bg-ritual-text px-5 py-3 text-sm font-semibold text-ritual-card disabled:opacity-60">
        {loading ? 'Saving...' : 'Save settings'}
      </button>
    </form>
  );
}

function labelFor(key) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase());
}

function Field({ label, value, onChange, textarea = false }) {
  const Component = textarea ? 'textarea' : 'input';
  return (
    <label className="block">
      <span className="text-sm font-medium text-ritual-text">{label}</span>
      <Component
        value={value || ''}
        onChange={(event) => onChange(event.target.value)}
        rows={textarea ? 4 : undefined}
        className="focus-ring mt-1 w-full rounded-md border border-ritual-border bg-ritual-background px-3 py-2 text-sm"
      />
    </label>
  );
}
