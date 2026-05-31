import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMugHot, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

const ROLE_BADGE = {
  admin:    'bg-amber-200 text-amber-900 border-amber-300',
  mozo:     'bg-sky-100 text-sky-800 border-sky-200',
  cocinero: 'bg-orange-100 text-orange-800 border-orange-200',
  cajero:   'bg-emerald-100 text-emerald-800 border-emerald-200',
};

const NAV_LINKS = [
  { to: '/',               label: 'Inicio',    roles: null },
  { to: '/pedidosindex',   label: 'Pedidos',   roles: null },
  { to: '/carrito',        label: 'Carrito',   roles: ['mozo', 'admin'] },
  { to: '/productosindex', label: 'Productos', roles: ['mozo', 'cocinero', 'admin'] },
  { to: '/admin',          label: 'Admin',     roles: ['admin'] },
];

const Navbar = ({ onLogout, role, username, title }) => {
  const visible = NAV_LINKS.filter(l => !l.roles || l.roles.includes(role));
  const badge   = ROLE_BADGE[role] || 'bg-stone-100 text-stone-600 border-stone-200';

  return (
    <header className="sticky top-0 z-40 bg-amber-900 border-b border-amber-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-12">

          {/* Logo + title */}
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faMugHot} className="text-amber-300 text-sm" />
            <span className="font-bold text-amber-50 text-sm hidden sm:inline">Coffee Shop</span>
            {title && (
              <span className="text-amber-300 text-sm font-medium">
                <span className="text-amber-700 mx-1.5 hidden sm:inline">·</span>
                {title}
              </span>
            )}
          </div>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-0.5">
            {visible.map(l => (
              <Link key={l.to} to={l.to}
                className="text-amber-200 hover:text-white hover:bg-amber-800 px-3 py-1.5 rounded-md text-sm transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right: user info + logout */}
          <div className="flex items-center gap-2">
            {username && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-amber-600 text-amber-50 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {username[0]?.toUpperCase()}
                </div>
                <span className={`hidden sm:inline px-2 py-0.5 rounded-full text-[10px] border font-medium ${badge}`}>
                  {role}
                </span>
              </div>
            )}
            <button onClick={onLogout}
              className="flex items-center gap-1 text-amber-300 hover:text-white text-sm px-2 py-1.5 rounded-md hover:bg-amber-800 transition-colors">
              <FontAwesomeIcon icon={faRightFromBracket} size="sm" />
              <span className="hidden md:inline text-xs">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
