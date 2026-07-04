import { ArrowDown, ArrowUp, ImagePlus, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ImageUploader from '../components/ImageUploader.jsx';
import adminApi, { getErrorMessage } from '../services/adminApi.js';
import { cowpediaTopics } from '../../data/cowpediaTopics.js';

const initialForm = {
  title: '',
  excerpt: '',
  section: 'blog',
  topic: '',
  publishedAt: new Date().toISOString().slice(0, 10),
  isPublished: true,
  metaTitle: '',
  metaDescription: '',
};

const emptyParagraph = () => ({ type: 'paragraph', text: '' });

export default function BlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(initialForm);
  const [heroImages, setHeroImages] = useState([]);
  const [heroFiles, setHeroFiles] = useState([]);
  const [blocks, setBlocks] = useState([emptyParagraph()]);
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState(['', '']);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    adminApi.get('/admin/products', { params: { limit: 100, isActive: true } })
      .then(({ data }) => setProducts(data.products || []))
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    adminApi.get(`/admin/blogs/${id}`)
      .then(({ data }) => {
        const blog = data.blog;
        setForm({
          ...initialForm,
          ...blog,
          section: blog.section || 'blog',
          topic: blog.topic || '',
          publishedAt: blog.publishedAt ? new Date(blog.publishedAt).toISOString().slice(0, 10) : initialForm.publishedAt,
        });
        setHeroImages(blog.heroImage?.url ? [blog.heroImage] : []);
        setBlocks(blog.contentBlocks?.length ? blog.contentBlocks : [emptyParagraph()]);
        const selected = (blog.featuredProducts || []).map((product) => product._id || product.id);
        setFeaturedProducts([selected[0] || '', selected[1] || '']);
      })
      .catch((error) => setMessage(getErrorMessage(error)));
  }, [id, isEdit]);

  const update = (key, value) => setForm({ ...form, [key]: value });

  const updateBlock = (index, patch) => {
    setBlocks(blocks.map((block, blockIndex) => blockIndex === index ? { ...block, ...patch } : block));
  };

  const addBlock = (type) => {
    const block = type === 'list'
      ? { type, items: [''] }
      : type === 'image'
        ? { type, image: undefined, file: null }
        : type === 'products'
          ? { type }
          : { type, text: '' };
    setBlocks([...blocks, block]);
  };

  const moveBlock = (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= blocks.length) return;
    const nextBlocks = [...blocks];
    const [target] = nextBlocks.splice(index, 1);
    nextBlocks.splice(nextIndex, 0, target);
    setBlocks(nextBlocks);
  };

  const removeBlock = (index) => {
    setBlocks(blocks.filter((_, blockIndex) => blockIndex !== index));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.excerpt.trim()) {
      setMessage('Title and excerpt are required.');
      return;
    }
    if (form.section === 'cowpedia' && !form.topic) {
      setMessage('Select a CowPedia topic.');
      return;
    }
    if (String(form.metaTitle || '').length > 70) {
      setMessage('Meta title cannot exceed 70 characters.');
      return;
    }
    if (String(form.metaDescription || '').length > 170) {
      setMessage('Meta description cannot exceed 170 characters.');
      return;
    }
    if (!heroImages.length && !heroFiles.length) {
      setMessage('Hero image is required.');
      return;
    }
    const selectedProducts = featuredProducts.filter(Boolean);
    if (new Set(selectedProducts).size !== selectedProducts.length) {
      setMessage('Choose two different featured products or leave one empty.');
      return;
    }

    setLoading(true);
    setMessage('');
    const body = new FormData();
    Object.entries(form).forEach(([key, value]) => body.append(key, value));
    if (!heroFiles[0]) {
      body.append('heroImage', JSON.stringify(heroImages[0] || null));
    }
    body.append('featuredProducts', JSON.stringify(selectedProducts));
    body.append('contentBlocks', JSON.stringify(blocks.map((block) => {
      if (block.type === 'image') {
        return {
          type: 'image',
          image: block.image?.url ? block.image : undefined,
          uploadSlot: Boolean(block.file),
        };
      }
      if (block.type === 'list') {
        return { type: 'list', items: (block.items || []).filter(Boolean) };
      }
      return { type: block.type, text: block.text || '' };
    })));
    if (heroFiles[0]) body.append('heroImage', heroFiles[0]);
    blocks.forEach((block) => {
      if (block.type === 'image' && block.file) body.append('contentImages', block.file);
    });

    try {
      if (isEdit) await adminApi.put(`/admin/blogs/${id}`, body);
      else await adminApi.post('/admin/blogs', body);
      navigate('/admin/blogs');
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <h1 className="font-serif text-3xl text-ritual-text">{isEdit ? 'Edit Blog' : 'Add Blog'}</h1>
        <p className="mt-1 text-sm text-ritual-muted">Build a blog article with images and up to two product recommendations.</p>
      </div>
      {message ? <p className="rounded-md bg-ritual-card px-3 py-2 text-sm text-ritual-muted">{message}</p> : null}

      <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <Panel title="Basics">
            <Field required label="Title" value={form.title} onChange={(value) => update('title', value)} />
            <Field required textarea maxLength={280} showCount label="Excerpt" value={form.excerpt} onChange={(value) => update('excerpt', value)} />
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-ritual-text">Section</span>
                <select value={form.section} onChange={(event) => setForm({ ...form, section: event.target.value, topic: event.target.value === 'cowpedia' ? form.topic : '' })} className="focus-ring mt-1 w-full rounded-md border border-ritual-border bg-ritual-background px-3 py-2 text-sm">
                  <option value="blog">Blog</option>
                  <option value="cowpedia">CowPedia</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-ritual-text">CowPedia topic</span>
                <select disabled={form.section !== 'cowpedia'} value={form.topic} onChange={(event) => update('topic', event.target.value)} className="focus-ring mt-1 w-full rounded-md border border-ritual-border bg-ritual-background px-3 py-2 text-sm disabled:opacity-50">
                  <option value="">Select topic</option>
                  {cowpediaTopics.map((topic) => <option key={topic.slug} value={topic.slug}>{topic.title}</option>)}
                </select>
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field type="date" label="Publish date" value={form.publishedAt} onChange={(value) => update('publishedAt', value)} />
              <Toggle label="Published" checked={form.isPublished} onChange={(value) => update('isPublished', value)} />
            </div>
          </Panel>

          <Panel title="Article Blocks">
            <div className="flex flex-wrap gap-2">
              <BlockButton label="Paragraph" onClick={() => addBlock('paragraph')} />
              <BlockButton label="Heading" onClick={() => addBlock('heading')} />
              <BlockButton label="Subheading" onClick={() => addBlock('subheading')} />
              <BlockButton label="List" onClick={() => addBlock('list')} />
              <BlockButton label="Image" onClick={() => addBlock('image')} />
              <BlockButton label="Products" onClick={() => addBlock('products')} />
            </div>

            <div className="space-y-4">
              {blocks.map((block, index) => (
                <ContentBlock
                  key={index}
                  block={block}
                  index={index}
                  onChange={(patch) => updateBlock(index, patch)}
                  onMove={moveBlock}
                  onRemove={removeBlock}
                />
              ))}
            </div>
          </Panel>

          <Panel title="SEO">
            <Field maxLength={70} showCount label="Meta title" value={form.metaTitle} onChange={(value) => update('metaTitle', value)} />
            <Field textarea maxLength={170} showCount label="Meta description" value={form.metaDescription} onChange={(value) => update('metaDescription', value)} />
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel title="Hero Image">
            <ImageUploader images={heroImages} files={heroFiles} onImagesChange={setHeroImages} onFilesChange={setHeroFiles} />
          </Panel>

          <Panel title="Featured Products">
            <ProductSelect value={featuredProducts[0]} products={products} onChange={(value) => setFeaturedProducts([value, featuredProducts[1]])} />
            <ProductSelect value={featuredProducts[1]} products={products} onChange={(value) => setFeaturedProducts([featuredProducts[0], value])} />
            <p className="text-xs text-ritual-muted">These products appear wherever you add a Products block in the article.</p>
          </Panel>
        </div>
      </div>

      {message ? <p className="max-w-3xl rounded-md bg-ritual-rose/20 px-3 py-2 text-sm text-ritual-text">{message}</p> : null}
      <button type="submit" disabled={loading} className="focus-ring rounded-md bg-ritual-text px-5 py-3 text-sm font-semibold text-ritual-card disabled:opacity-60">
        {loading ? 'Saving...' : 'Save blog'}
      </button>
    </form>
  );
}

function ContentBlock({ block, index, onChange, onMove, onRemove }) {
  return (
    <section className="rounded-lg border border-ritual-border bg-ritual-background p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ritual-muted">{block.type}</span>
        <div className="flex gap-1">
          <IconButton title="Move up" onClick={() => onMove(index, -1)} icon={ArrowUp} />
          <IconButton title="Move down" onClick={() => onMove(index, 1)} icon={ArrowDown} />
          <IconButton title="Remove" onClick={() => onRemove(index)} icon={Trash2} />
        </div>
      </div>

      {['paragraph', 'heading', 'subheading'].includes(block.type) ? (
        <Field textarea={block.type === 'paragraph'} value={block.text || ''} onChange={(value) => onChange({ text: value })} />
      ) : null}

      {block.type === 'list' ? (
        <div className="space-y-2">
          {(block.items || ['']).map((item, itemIndex) => (
            <input
              key={itemIndex}
              value={item}
              onChange={(event) => {
                const nextItems = [...(block.items || [])];
                nextItems[itemIndex] = event.target.value;
                onChange({ items: nextItems });
              }}
              placeholder={`List item ${itemIndex + 1}`}
              className="focus-ring w-full rounded-md border border-ritual-border bg-ritual-card px-3 py-2 text-sm"
            />
          ))}
          <button type="button" onClick={() => onChange({ items: [...(block.items || []), ''] })} className="text-sm font-semibold text-ritual-gold">Add list item</button>
        </div>
      ) : null}

      {block.type === 'image' ? (
        <InlineImageBlock block={block} onChange={onChange} />
      ) : null}

      {block.type === 'products' ? (
        <p className="rounded-md bg-ritual-card px-3 py-2 text-sm text-ritual-muted">This will render the selected featured products inside the article.</p>
      ) : null}
    </section>
  );
}

function InlineImageBlock({ block, onChange }) {
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (!block.file) {
      setPreview('');
      return undefined;
    }
    const url = URL.createObjectURL(block.file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [block.file]);

  return (
    <div className="space-y-3">
      {(block.image?.url || preview) ? (
        <img src={preview || block.image.url} alt="" className="aspect-[1.54] w-full rounded-md object-cover" />
      ) : null}
      <label className="focus-ring flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-ritual-border bg-ritual-card px-4 py-6 text-sm font-medium text-ritual-muted hover:border-ritual-gold hover:text-ritual-text">
        <ImagePlus size={18} />
        Choose article image
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(event) => onChange({ file: event.target.files?.[0] || null, image: undefined })}
        />
      </label>
    </div>
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

function BlockButton({ label, onClick }) {
  return (
    <button type="button" onClick={onClick} className="focus-ring inline-flex items-center gap-2 rounded-md border border-ritual-border px-3 py-2 text-sm font-semibold text-ritual-muted hover:border-ritual-gold hover:text-ritual-text">
      <Plus size={14} />
      {label}
    </button>
  );
}

function IconButton({ icon: Icon, title, onClick }) {
  return (
    <button type="button" onClick={onClick} title={title} className="focus-ring rounded-md border border-ritual-border p-1.5 text-ritual-muted hover:text-ritual-text">
      <Icon size={15} />
    </button>
  );
}

function ProductSelect({ value, products, onChange }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)} className="focus-ring w-full rounded-md border border-ritual-border bg-ritual-background px-3 py-2 text-sm">
      <option value="">Select product</option>
      {products.map((product) => (
        <option key={product._id} value={product._id}>{product.name}</option>
      ))}
    </select>
  );
}
