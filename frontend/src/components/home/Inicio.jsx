import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShoppingCart, faList, faBoxes, faUsers, faMugHot,
} from '@fortawesome/free-solid-svg-icons';

const ROLE_LABEL = { admin: 'Administrador', mozo: 'Mozo', cocinero: 'Cocinero', cajero: 'Cajero' };
const ROLE_COLOR = {
  admin:    'text-amber-300 bg-amber-900/20 border-amber-800',
  mozo:     'text-blue-300 bg-blue-900/20 border-blue-800',
  cocinero: 'text-orange-300 bg-orange-900/20 border-orange-800',
  cajero:   'text-emerald-300 bg-emerald-900/20 border-emerald-800',
};
const QUICK_LINKS = [
  { to: '/pedidosindex',  icon: faList,         label: 'Ver Pedidos',   roles: null,                          color: 'hover:border-amber-600 hover:bg-amber-900/10' },
  { to: '/carrito',       icon: faShoppingCart, label: 'Tomar Pedido',  roles: ['mozo', 'admin'],              color: 'hover:border-blue-600 hover:bg-blue-900/10' },
  { to: '/productosindex',icon: faBoxes,        label: 'Productos',     roles: ['mozo', 'cocinero', 'admin'],  color: 'hover:border-stone-500 hover:bg-stone-800' },
  { to: '/usuariostabla', icon: faUsers,        label: 'Usuarios',      roles: ['admin'],                     color: 'hover:border-purple-600 hover:bg-purple-900/10' },
];

// SVG coffee cup — inline, no dependencias
const CoffeeSVG = () => (
  <svg viewBox="0 0 160 160" width="180" height="180" aria-hidden="true">
    {/* Steam */}
    <path d="M52 44 Q46 32 52 20" stroke="#78716c" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6"/>
    <path d="M78 38 Q72 26 78 14" stroke="#78716c" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.5"/>
    <path d="M104 44 Q98 32 104 20" stroke="#78716c" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6"/>
    {/* Plato */}
    <ellipse cx="80" cy="138" rx="52" ry="8" fill="#44403c" opacity="0.5"/>
    {/* Taza cuerpo */}
    <path d="M30 68 L40 128 Q43 135 55 135 L105 135 Q117 135 120 128 L130 68 Z" fill="#292524"/>
    <path d="M30 68 L40 128 Q43 135 55 135 L105 135 Q117 135 120 128 L130 68 Z" fill="#7c2d12" opacity="0.8"/>
    {/* Borde taza */}
    <rect x="24" y="60" width="112" height="12" rx="6" fill="#9a3412"/>
    {/* Café */}
    <ellipse cx="80" cy="69" rx="50" ry="8" fill="#431407" opacity="0.9"/>
    {/* Espuma */}
    <ellipse cx="64" cy="67" rx="8" ry="4" fill="#fef3c7" opacity="0.25"/>
    <ellipse cx="88" cy="65" rx="10" ry="4" fill="#fef3c7" opacity="0.2"/>
    <ellipse cx="76" cy="70" rx="6" ry="3" fill="#fef3c7" opacity="0.15"/>
    {/* Asa */}
    <path d="M130 80 Q152 80 152 104 Q152 128 130 128" stroke="#9a3412" strokeWidth="12" fill="none" strokeLinecap="round"/>
    <path d="M130 80 Q152 80 152 104 Q152 128 130 128" stroke="#7c2d12" strokeWidth="6" fill="none" strokeLinecap="round"/>
  </svg>
);

export const Inicio = ({ role, username }) => {
  const color = ROLE_COLOR[role] || 'text-stone-300 bg-stone-800 border-stone-700';
  const visible = QUICK_LINKS.filter(l => !l.roles || l.roles.includes(role));

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8">

      {/* Coffee illustration */}
      <div className="mb-6 opacity-90">
        <CoffeeSVG />
      </div>

      {/* Greeting */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-100 mb-2 tracking-tight">
          Coffee Shop
        </h1>
        <p className="text-stone-400 text-sm mb-4">Sistema de atención y gestión</p>
        {username && (
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-medium ${color}`}>
            <FontAwesomeIcon icon={faMugHot} size="xs" />
            {ROLE_LABEL[role] || role} · {username}
          </div>
        )}
      </div>

      {/* Quick access */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl">
        {visible.map(l => (
          <Link key={l.to} to={l.to}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl bg-stone-900 border border-stone-800 transition-all duration-200 ${l.color}`}>
            <FontAwesomeIcon icon={l.icon} className="text-lg text-stone-400" />
            <span className="text-stone-300 text-xs font-medium text-center leading-tight">{l.label}</span>
          </Link>
        ))}
      </div>

      {/* Carta link */}
      <a href="/carta" target="_blank" rel="noreferrer"
        className="mt-6 text-stone-600 hover:text-amber-500 text-xs transition-colors underline underline-offset-2">
        Ver carta digital →
      </a>
    </div>
  );
};
