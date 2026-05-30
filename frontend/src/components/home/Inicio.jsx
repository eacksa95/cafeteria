import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMugHot, faShoppingCart, faList, faUtensils,
  faUsers, faBoxes, faCashRegister,
} from '@fortawesome/free-solid-svg-icons';
import { usePedidos, useProductos } from '../../api/queries';

const ROLE_LABEL = {
  admin: 'Administrador', mozo: 'Mozo', cocinero: 'Cocinero', cajero: 'Cajero',
};

const ROLE_COLOR = {
  admin:    'text-amber-400 bg-amber-900/30 border-amber-700',
  mozo:     'text-blue-400 bg-blue-900/30 border-blue-700',
  cocinero: 'text-orange-400 bg-orange-900/30 border-orange-700',
  cajero:   'text-emerald-400 bg-emerald-900/30 border-emerald-700',
};

const QUICK_LINKS = [
  { to: '/pedidosindex', icon: faList,        label: 'Pedidos',   roles: null,                            color: 'border-amber-800 hover:border-amber-600 hover:bg-amber-900/20' },
  { to: '/carrito',      icon: faShoppingCart, label: 'Carrito',   roles: ['mozo', 'admin'],               color: 'border-blue-800 hover:border-blue-600 hover:bg-blue-900/20' },
  { to: '/productosindex',icon: faBoxes,       label: 'Productos', roles: ['mozo', 'cocinero', 'admin'],   color: 'border-stone-700 hover:border-stone-500 hover:bg-stone-800' },
  { to: '/usuariostabla', icon: faUsers,       label: 'Usuarios',  roles: ['admin'],                      color: 'border-purple-800 hover:border-purple-600 hover:bg-purple-900/20' },
];

function useClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export const Inicio = ({ role, username }) => {
  const time = useClock();
  const { data: pedidos }   = usePedidos();
  const { data: productos } = useProductos();

  const pendientes = pedidos?.filter(p => p.estado === 'pendiente').length ?? 0;
  const enProceso  = pedidos?.filter(p => p.estado === 'en_proceso').length ?? 0;
  const listos     = pedidos?.filter(p => p.estado === 'listo').length ?? 0;
  const totalProductos = productos?.length ?? 0;

  const visibleLinks = QUICK_LINKS.filter(l => !l.roles || l.roles.includes(role));

  const greeting = () => {
    const h = time.getHours();
    if (h < 12) return 'Buenos días';
    if (h < 19) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <div className="page">

      {/* Hero */}
      <div className="text-center mb-10 pt-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-600/15 rounded-3xl border border-amber-600/20 mb-5">
          <FontAwesomeIcon icon={faMugHot} className="text-amber-500 text-3xl" />
        </div>
        <h1 className="text-3xl font-bold text-stone-100 mb-1">Coffee Shop</h1>
        <p className="text-stone-500 text-sm mb-4">Sistema de atención y gestión</p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span className="text-stone-300 text-sm font-mono">
            {time.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          {role && (
            <span className={`px-3 py-1 rounded-full text-xs border font-medium ${ROLE_COLOR[role] || 'text-stone-400 bg-stone-800 border-stone-700'}`}>
              {ROLE_LABEL[role] || role}
              {username ? ` — ${username}` : ''}
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard label="Pendientes" value={pendientes} color="text-amber-400" />
        <StatCard label="En proceso" value={enProceso}  color="text-blue-400"  />
        <StatCard label="Listos"     value={listos}     color="text-emerald-400" />
        <StatCard label="Productos"  value={totalProductos} color="text-stone-300" />
      </div>

      {/* Quick access */}
      <div>
        <p className="text-stone-500 text-xs uppercase tracking-wider mb-3">Acceso rápido</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {visibleLinks.map(l => (
            <Link
              key={l.to} to={l.to}
              className={`flex flex-col items-center gap-2 p-5 rounded-xl bg-stone-900 border transition-colors ${l.color}`}
            >
              <FontAwesomeIcon icon={l.icon} className="text-xl text-stone-300" />
              <span className="text-stone-300 text-sm font-medium">{l.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

function StatCard({ label, value, color }) {
  return (
    <div className="bg-stone-900 rounded-xl border border-stone-800 p-4 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-stone-500 text-xs mt-1">{label}</p>
    </div>
  );
}
