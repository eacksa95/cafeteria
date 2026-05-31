import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMugHot, faCoffee, faWineGlass, faBowlFood,
  faCroissant, faCake, faBox,
} from '@fortawesome/free-solid-svg-icons';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';
const IMG_FALLBACK = 'https://png.pngtree.com/template/20190323/ourmid/pngtree-coffee-logo-design-image_82183.jpg';

const CAT_CONFIG = {
  cafe:     { label: 'Cafés',       icon: faCoffee,    color: 'from-amber-900/80 to-stone-900',  badge: 'bg-amber-800/80 text-amber-200' },
  bebida:   { label: 'Bebidas',     icon: faWineGlass, color: 'from-blue-900/80 to-stone-900',   badge: 'bg-blue-800/80 text-blue-200' },
  desayuno: { label: 'Desayunos',   icon: faCroissant, color: 'from-orange-900/80 to-stone-900', badge: 'bg-orange-800/80 text-orange-200' },
  comida:   { label: 'Comidas',     icon: faBowlFood,  color: 'from-green-900/80 to-stone-900',  badge: 'bg-green-800/80 text-green-200' },
  postre:   { label: 'Postres',     icon: faCake,      color: 'from-pink-900/80 to-stone-900',   badge: 'bg-pink-800/80 text-pink-200' },
  otro:     { label: 'Otros',       icon: faBox,       color: 'from-stone-800 to-stone-900',     badge: 'bg-stone-700 text-stone-300' },
};

function useClock() {
  const [t, setT] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id); }, []);
  return t;
}

export default function Carta() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [catFilter, setCatFilter] = useState('todos');
  const clock = useClock();

  const fetchMenu = async () => {
    try {
      const r = await fetch(`${API_URL}/api/productos/menu/`);
      if (r.ok) setProductos(await r.json());
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchMenu();
    const id = setInterval(fetchMenu, 60000); // auto-refresh cada 60s
    return () => clearInterval(id);
  }, []);

  const categorias = ['todos', ...new Set(productos.map(p => p.categoria || 'otro'))];
  const visible = catFilter === 'todos' ? productos : productos.filter(p => (p.categoria || 'otro') === catFilter);

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-600/20 rounded-xl border border-amber-600/30 flex items-center justify-center">
            <FontAwesomeIcon icon={faMugHot} className="text-amber-500 text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-stone-100">Coffee Shop</h1>
            <p className="text-stone-500 text-sm">Nuestro menú</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-mono font-bold text-stone-200">
            {clock.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="text-stone-500 text-sm">
            {clock.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
      </header>

      {/* Category filter */}
      <div className="flex gap-2 px-8 py-4 overflow-x-auto border-b border-stone-800/50 flex-shrink-0">
        {categorias.map(cat => {
          const cfg = cat === 'todos' ? null : CAT_CONFIG[cat] || CAT_CONFIG.otro;
          const active = catFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => setCatFilter(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                active
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-stone-200'
              }`}
            >
              {cat === 'todos' ? 'Todo el menú' : (cfg?.label || cat)}
            </button>
          );
        })}
      </div>

      {/* Products grid */}
      <main className="flex-1 px-8 py-6 overflow-y-auto">
        {loading ? (
          <p className="text-stone-400 text-center py-20 text-lg animate-pulse">Cargando menú...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {visible.map(p => {
              const cat = p.categoria || 'otro';
              const cfg = CAT_CONFIG[cat] || CAT_CONFIG.otro;
              return (
                <div key={p.id} className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden group">
                  {/* Image or category fallback */}
                  <div className={`relative h-36 bg-gradient-to-b ${cfg.color} flex items-center justify-center overflow-hidden`}>
                    {p.img ? (
                      <img
                        src={p.img}
                        alt={p.nombre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={e => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`${p.img ? 'hidden' : 'flex'} w-full h-full items-center justify-center`}>
                      <FontAwesomeIcon icon={cfg.icon} className="text-4xl text-white/20" />
                    </div>
                    <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-medium ${cfg.badge}`}>
                      {cfg.label}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <h3 className="text-stone-100 font-semibold text-sm leading-snug mb-1">{p.nombre}</h3>
                    <p className="text-amber-400 font-bold text-lg">${Number(p.precio).toFixed(2)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && !visible.length && (
          <p className="text-stone-600 text-center py-20">No hay productos disponibles</p>
        )}
      </main>

      {/* Footer */}
      <footer className="px-8 py-3 border-t border-stone-800 flex items-center justify-between text-stone-600 text-xs">
        <span>Actualiza automáticamente cada minuto</span>
        <span>cafeteria-fe.netlify.app/carta</span>
      </footer>
    </div>
  );
}
