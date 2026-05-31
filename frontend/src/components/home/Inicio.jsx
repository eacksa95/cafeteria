import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faList, faBoxes, faUsers } from '@fortawesome/free-solid-svg-icons';

const QUICK = [
  { to: '/pedidosindex',  icon: faList,         label: 'Pedidos',  roles: null,                          color: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200' },
  { to: '/carrito',       icon: faShoppingCart, label: 'Carrito',  roles: ['mozo', 'admin'],              color: 'bg-sky-100 text-sky-800 border-sky-200 hover:bg-sky-200' },
  { to: '/productosindex',icon: faBoxes,        label: 'Productos',roles: ['mozo','cocinero','admin'],    color: 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200' },
  { to: '/usuariostabla', icon: faUsers,        label: 'Usuarios', roles: ['admin'],                     color: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200' },
];

export const Inicio = ({ role, username }) => {
  const initial = username?.[0]?.toUpperCase() || '?';
  const visible  = QUICK.filter(l => !l.roles || l.roles.includes(role));

  return (
    <div className="page pt-4">
      {/* Toolbar card */}
      <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-4 flex items-center gap-4 mb-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-amber-700 text-white flex items-center justify-center text-xl font-bold flex-shrink-0 shadow-sm">
          {initial}
        </div>

        {/* User info */}
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-stone-800 text-sm truncate">{username}</p>
          <p className="text-stone-400 text-xs capitalize">{role || '—'}</p>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2">
          {visible.map(l => (
            <Link key={l.to} to={l.to} title={l.label}
              className={`flex flex-col items-center gap-0.5 border rounded-xl p-2.5 transition-colors ${l.color}`}>
              <FontAwesomeIcon icon={l.icon} className="text-base" />
              <span className="text-[9px] font-medium hidden sm:block">{l.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Carta link */}
      <div className="text-center mt-6">
        <a href="/carta" target="_blank" rel="noreferrer"
          className="text-amber-600 hover:text-amber-700 text-xs underline underline-offset-2 transition-colors">
          Abrir carta digital →
        </a>
      </div>
    </div>
  );
};
