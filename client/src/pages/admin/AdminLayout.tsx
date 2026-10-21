import { useEffect, useState } from "react";
import {
  NavLink,
  Outlet,
  useNavigate,
  useResolvedPath,
  useMatch,
} from "react-router-dom";
import Icon from "../../components/ui/Icon";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

function NavItem({ label, to, icon }: NavItem) {
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: false });
  const isActive = Boolean(match);

  return (
    <NavLink
      to={to}
      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium tracking-wide transition-colors ${
        isActive
          ? "bg-gold/10 text-gold border-l-2 border-gold"
          : "text-ash hover:text-warm-white hover:bg-white/5"
      }`}
    >
      <span className="flex items-center justify-center text-current">
        {icon}
      </span>
      <span className="font-display tracking-[0.15em] uppercase text-[13px]">
        {label}
      </span>
    </NavLink>
  );
}

export default function AdminLayout() {
  const { user, loading, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/admin/login");
    }
  }, [loading, user, navigate]);

  const navItems: NavItem[] = [
    { label: "Dashboard", to: "/admin", icon: <Icon name="chart" size={18} /> },
    { label: "Enquiries", to: "/admin/enquiries", icon: <Icon name="note" size={18} /> },
    { label: "Products", to: "/admin/products", icon: <Icon name="box" size={18} />, adminOnly: true },
    { label: "Settings", to: "/admin/settings", icon: <Icon name="settings" size={18} />, adminOnly: true },
    { label: "Team", to: "/admin/team", icon: <Icon name="users" size={18} />, adminOnly: true },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-jet-black flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-jet-black text-warm-white">
      <div className="flex">
        <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:border-r lg:border-white/10 lg:bg-charcoal">
          <div className="flex h-16 items-center px-6 border-b border-white/10">
            <Icon name="crown" size={28} className="text-gold" />
            <span className="ml-3 font-display text-2xl tracking-[0.3em] text-warm-white">
              TIMECRAFT
            </span>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            <div className="flex flex-col">
              {navItems.map((item) =>
                item.adminOnly && !isAdmin ? null : (
                  <NavItem key={item.to} {...item} />
                ),
              )}
            </div>
          </nav>

          <div className="border-t border-white/10 p-4">
            <div className="mb-3">
              <p className="text-sm text-warm-white truncate">{user.name}</p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-ash">
                {user.role}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                to="/"
                variant="outlineLight"
                size="sm"
                icon={<Icon name="arrowRight" size={14} />}
              >
                View Storefront
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={<Icon name="logout" size={14} />}
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          </div>
        </aside>

        <div className="lg:pl-64 flex flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-jet-black/90 backdrop-blur px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                className="lg:hidden text-warm-white"
              >
                <Icon name="menu" size={24} />
              </button>
              <span className="font-display text-xl tracking-[0.2em] text-warm-white">
                Admin
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden sm:block text-sm text-ash truncate max-w-[200px]">
                {user.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                icon={<Icon name="logout" size={14} />}
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          </header>

          <main className="flex-1">
            <div className="container-luxe py-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 flex h-full w-[82%] max-w-xs flex-col border-r border-white/10 bg-charcoal">
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
              <span className="font-display text-lg tracking-[0.3em] text-warm-white">TIMECRAFT</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="text-warm-white/70 transition hover:text-gold"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
              <div className="flex flex-col">
                {navItems.map((item) =>
                  item.adminOnly && !isAdmin ? null : (
                    <div key={item.to} onClick={() => setMenuOpen(false)}>
                      <NavItem {...item} />
                    </div>
                  ),
                )}
              </div>
            </nav>

            <div className="border-t border-white/10 p-4">
              <p className="text-sm text-warm-white">{user.name}</p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-ash">{user.role}</p>
              <Button
                variant="ghost"
                size="sm"
                icon={<Icon name="logout" size={14} />}
                onClick={logout}
                className="mt-3 w-full"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}