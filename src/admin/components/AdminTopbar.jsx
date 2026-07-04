import { LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminTopbar() {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem('adminUser') || '{}');

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login', { replace: true });
  };

  return (
    <header className="flex min-h-16 items-center justify-between border-b border-ritual-border bg-ritual-card px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <Menu className="lg:hidden" size={20} />
        <div>
          <p className="text-sm font-semibold text-ritual-text">CMS Workspace</p>
          <p className="text-xs text-ritual-muted">Manage catalog and homepage content</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-ritual-muted sm:inline">{admin.name || 'Admin'}</span>
        <button
          type="button"
          onClick={logout}
          className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-md border border-ritual-border text-ritual-muted hover:text-ritual-text"
          title="Logout"
          aria-label="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
