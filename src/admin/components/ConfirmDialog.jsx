export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, loading }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ritual-brown/40 px-4">
      <div className="w-full max-w-md rounded-lg border border-ritual-border bg-ritual-card p-6 shadow-lift">
        <h2 className="font-serif text-2xl text-ritual-text">{title}</h2>
        <p className="mt-2 text-sm text-ritual-muted">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="focus-ring rounded-md border border-ritual-border px-4 py-2 text-sm text-ritual-muted hover:text-ritual-text"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="focus-ring rounded-md bg-ritual-text px-4 py-2 text-sm font-semibold text-ritual-card disabled:opacity-60"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
