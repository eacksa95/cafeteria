import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faMugHot, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

const ROLE_BADGE = {
  admin:    'bg-amber-900/60 text-amber-400 border-amber-700',
  mozo:     'bg-blue-900/60 text-blue-400 border-blue-700',
  cocinero: 'bg-orange-900/60 text-orange-400 border-orange-700',
  cajero:   'bg-emerald-900/60 text-emerald-400 border-emerald-700',
}

const NAV_LINKS = [
  { to: '/',               label: 'Inicio',    roles: null },
  { to: '/pedidosindex',   label: 'Pedidos',   roles: null },
  { to: '/carrito',        label: 'Carrito',   roles: ['mozo', 'admin'] },
  { to: '/productosindex', label: 'Productos', roles: ['mozo', 'cocinero', 'admin'] },
  { to: '/admin',          label: 'Admin',     roles: ['admin'] },
]

const Navbar = ({ onLogout, role, username }) => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const visible = NAV_LINKS.filter(l => !l.roles || l.roles.includes(role));
  const badge = ROLE_BADGE[role] || 'bg-stone-800 text-stone-400 border-stone-700';

  return (
    <nav className="sticky top-0 z-40 bg-stone-900 border-b border-stone-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faMugHot} className="text-amber-500" />
            <span className="font-bold text-stone-100 text-sm">Coffee Shop</span>
            {role && (
              <span className={`hidden sm:inline px-2 py-0.5 rounded-full text-[10px] border font-medium ${badge}`}>
                {role}
              </span>
            )}
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {visible.map(l => (
              <Link key={l.to} to={l.to}
                className="text-stone-400 hover:text-amber-400 hover:bg-stone-800 px-3 py-1.5 rounded-lg text-sm transition-colors">
                {l.label}
              </Link>
            ))}
          </div>

          {/* Logout (desktop) + hamburger */}
          <div className="flex items-center gap-2">
            {username && <span className="hidden md:inline text-stone-500 text-xs">{username}</span>}
            <button onClick={onLogout}
              className="hidden md:flex items-center gap-1.5 text-stone-400 hover:text-red-400 text-sm px-3 py-1.5 rounded-lg hover:bg-stone-800 transition-colors">
              <FontAwesomeIcon icon={faRightFromBracket} size="sm" />
              Salir
            </button>
            <button onClick={() => setOpen(v => !v)} className="md:hidden text-stone-400 p-2">
              <FontAwesomeIcon icon={open ? faTimes : faBars} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-stone-800 py-2 space-y-0.5">
            {visible.map(l => (
              <Link key={l.to} to={l.to} onClick={close}
                className="block text-stone-300 hover:text-amber-400 hover:bg-stone-800 px-3 py-2 rounded-lg text-sm transition-colors">
                {l.label}
              </Link>
            ))}
            <button onClick={onLogout}
              className="flex items-center gap-2 text-red-400 px-3 py-2 text-sm w-full">
              <FontAwesomeIcon icon={faRightFromBracket} size="sm" />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
