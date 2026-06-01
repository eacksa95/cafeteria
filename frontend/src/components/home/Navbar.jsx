import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMugHot, faList, faShoppingCart, faBoxes,
  faGear, faRightFromBracket, faUser,
} from '@fortawesome/free-solid-svg-icons';

// Botones de navegación tipo toolbar — visibles en header desktop
const NAV_ICONS = [
  { to: '/pedidosindex',   icon: faList,         label: 'Pedidos',   roles: null,                          color: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200' },
  { to: '/carrito',        icon: faShoppingCart, label: 'Carrito',   roles: ['mozo', 'admin'],              color: 'bg-sky-100 text-sky-800 border-sky-200 hover:bg-sky-200' },
  { to: '/productosindex', icon: faBoxes,        label: 'Productos', roles: ['mozo', 'cocinero', 'admin'],  color: 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200' },
  { to: '/admin',          icon: faGear,         label: 'Admin',     roles: ['admin'],                     color: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200' },
];

const ROLE_BADGE = {
  admin:    'bg-amber-200 text-amber-900',
  mozo:     'bg-sky-100 text-sky-800',
  cocinero: 'bg-orange-100 text-orange-800',
  cajero:   'bg-emerald-100 text-emerald-800',
};

const Navbar = ({ onLogout, role, username, title }) => {
  const [profileOpen, setProfileOpen] = useState(false);

  const visibleIcons = NAV_ICONS.filter(l => !l.roles || l.roles.includes(role));
  const badgeColor   = ROLE_BADGE[role] || 'bg-stone-100 text-stone-600';

  return (
    <header className="sticky top-0 z-40 bg-amber-900 border-b border-amber-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-12 gap-3">

          {/* Logo — link a inicio */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <FontAwesomeIcon icon={faMugHot} className="text-amber-300 text-sm" />
            <span className="font-bold text-amber-50 text-sm hidden sm:inline">Coffee Shop</span>
          </Link>

          {/* Desktop toolbar — íconos coloridos */}
          <nav className="hidden md:flex items-center gap-1.5 flex-1">
            {visibleIcons.map(l => (
              <Link key={l.to} to={l.to} title={l.label}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold border transition-colors ${l.color}`}>
                <FontAwesomeIcon icon={l.icon} size="sm" />
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Título de sección (mobile) */}
          {title && (
            <span className="md:hidden text-amber-200 text-sm font-medium flex-1 text-center truncate">
              {title}
            </span>
          )}

          {/* Derecha: avatar dropdown */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setProfileOpen(v => !v)}
              className="flex items-center gap-2 focus:outline-none"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${badgeColor}`}>
                {username?.[0]?.toUpperCase() || <FontAwesomeIcon icon={faUser} size="xs" />}
              </div>
            </button>

            {/* Dropdown */}
            {profileOpen && (
              <>
                {/* Overlay cierra el dropdown al hacer clic afuera */}
                <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 top-full mt-2 z-50 bg-white rounded-xl border border-amber-100 shadow-xl w-52 py-1 overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-amber-50">
                    <p className="font-semibold text-stone-800 text-sm">{username}</p>
                    <p className="text-stone-400 text-xs capitalize">{role}</p>
                  </div>
                  <Link to="/admin" onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-stone-700 hover:bg-amber-50 transition-colors">
                    <FontAwesomeIcon icon={faGear} size="xs" className="text-stone-400 w-3" />
                    Mi perfil
                  </Link>
                  <button onClick={() => { setProfileOpen(false); onLogout(); }}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full transition-colors">
                    <FontAwesomeIcon icon={faRightFromBracket} size="xs" className="w-3" />
                    Cerrar sesión
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
