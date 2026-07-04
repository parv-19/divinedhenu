import { Edit, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import DataTable from '../components/DataTable.jsx';
import adminApi, { getErrorMessage } from '../services/adminApi.js';
import { cowpediaTopics } from '../../data/cowpediaTopics.js';

const initialFilters = {
  search: '',
  section: '',
  topic: '',
  isPublished: '',
  page: 1,
};

const topicLabel = (slug) => cowpediaTopics.find((topic) => topic.slug === slug)?.title || '-';

const formatDate = (value) => value ? new Intl.DateTimeFormat('en-IN', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
}).format(new Date(value)) : '-';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [filters, setFilters] = useState(initialFilters);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadBlogs = () => {
    adminApi.get('/admin/blogs', { params: filters })
      .then(({ data }) => {
        setBlogs(data.blogs || []);
        setPagination(data.pagination || { page: 1, pages: 1 });
      })
      .catch((err) => setError(getErrorMessage(err)));
  };

  useEffect(loadBlogs, [filters]);

  const updateFilter = (key, value) => setFilters({ ...filters, [key]: value, page: key === 'page' ? value : 1 });

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await adminApi.delete(`/admin/blogs/${deleteTarget._id}`);
      setDeleteTarget(null);
      loadBlogs();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'image', label: 'Image', render: (row) => row.heroImage?.url ? <img src={row.heroImage.url} alt="" className="h-12 w-20 rounded object-cover" /> : '-' },
    { key: 'title', label: 'Title' },
    { key: 'section', label: 'Section', render: (row) => row.section === 'cowpedia' ? 'CowPedia' : 'Blog' },
    { key: 'topic', label: 'Topic', render: (row) => row.section === 'cowpedia' ? topicLabel(row.topic) : '-' },
    { key: 'publishedAt', label: 'Published', render: (row) => formatDate(row.publishedAt) },
    { key: 'isPublished', label: 'Status', render: (row) => row.isPublished ? 'Published' : 'Draft' },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex justify-end gap-2">
          <Link className="focus-ring rounded-md border border-ritual-border p-2 text-ritual-muted hover:text-ritual-text" to={`/admin/blogs/edit/${row._id}`} title="Edit">
            <Edit size={16} />
          </Link>
          <button className="focus-ring rounded-md border border-ritual-border p-2 text-ritual-muted hover:text-ritual-text" onClick={() => setDeleteTarget(row)} type="button" title="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-ritual-text">Blogs</h1>
          <p className="mt-1 text-sm text-ritual-muted">Create blog posts with article images and featured products.</p>
        </div>
        <Link className="focus-ring inline-flex items-center gap-2 rounded-md bg-ritual-text px-4 py-2 text-sm font-semibold text-ritual-card" to="/admin/blogs/new">
          <Plus size={16} /> Add blog
        </Link>
      </div>

      <div className="grid gap-3 rounded-lg border border-ritual-border bg-ritual-card p-4 md:grid-cols-4">
        <input value={filters.search} onChange={(event) => updateFilter('search', event.target.value)} placeholder="Search blogs" className="focus-ring rounded-md border border-ritual-border bg-ritual-background px-3 py-2 text-sm" />
        <select value={filters.section} onChange={(event) => updateFilter('section', event.target.value)} className="focus-ring rounded-md border border-ritual-border bg-ritual-background px-3 py-2 text-sm">
          <option value="">All sections</option>
          <option value="blog">Blog</option>
          <option value="cowpedia">CowPedia</option>
        </select>
        <select value={filters.topic} onChange={(event) => updateFilter('topic', event.target.value)} className="focus-ring rounded-md border border-ritual-border bg-ritual-background px-3 py-2 text-sm">
          <option value="">All CowPedia topics</option>
          {cowpediaTopics.map((topic) => <option key={topic.slug} value={topic.slug}>{topic.title}</option>)}
        </select>
        <select value={filters.isPublished} onChange={(event) => updateFilter('isPublished', event.target.value)} className="focus-ring rounded-md border border-ritual-border bg-ritual-background px-3 py-2 text-sm">
          <option value="">All status</option>
          <option value="true">Published</option>
          <option value="false">Draft</option>
        </select>
      </div>

      {error ? <p className="rounded-md bg-ritual-rose/20 px-3 py-2 text-sm">{error}</p> : null}
      <DataTable columns={columns} rows={blogs} />

      <div className="flex items-center justify-end gap-2">
        <button disabled={pagination.page <= 1} onClick={() => updateFilter('page', filters.page - 1)} className="focus-ring rounded-md border border-ritual-border px-3 py-2 text-sm disabled:opacity-50">Previous</button>
        <span className="text-sm text-ritual-muted">Page {pagination.page} of {pagination.pages}</span>
        <button disabled={pagination.page >= pagination.pages} onClick={() => updateFilter('page', filters.page + 1)} className="focus-ring rounded-md border border-ritual-border px-3 py-2 text-sm disabled:opacity-50">Next</button>
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete blog"
        message={`Delete ${deleteTarget?.title || 'this blog'} and its images?`}
        loading={loading}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
