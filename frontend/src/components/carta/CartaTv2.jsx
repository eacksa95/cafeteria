/**
 * CartaTv2 — Pizarrón de menú (estilo McDonald's) para TV/pantalla grande.
 * URL: /cartatv2
 * Muestra categorías con sus productos, precios y disponibilidad.
 */
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMugHot, faCircle } from '@fortawesome/free-solid-svg-icons';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

function useClock() {
  const [t, setT] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id); }, []);
  return t;
}

const CAT_HEADER_COLOR = [
  'bg-amber-900/60 border-amber-700',
  'bg-blue-900/60 border-blue-700',
  'bg-orange-900/60 border-orange-700',
  'bg-yellow-900/60 border-yellow-700',
  'bg-green-900/60 border-green-700',
  'bg-pink-900/60 border-pink-700',
];

export default function CartaTv2() {
  const [menuData, setMenuData] = useState([]);
  const clock = useClock();

  const fetchMenu = () => {
    fetch(`${API_URL}/api/productos/menu-completo/`)
      .then(r => r.json()).then(setMenuData).catch(() => {});
  };

  useEffect(() => {
    fetchMenu();
    const id = setInterval(fetchMenu, 60000);
    return () => clearInterval(id);
  }, []);

  // Mostrar hasta 6 categorías en una grilla
  const visible = menuData.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#111827] flex flex-col overflow-hidden select-none">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-stone-950 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <FontAwesomeIcon icon={faMugHot} className="text-amber-500 text-xl" />
          <span className="text-xl font-bold text-stone-100">Coffee Shop</span>
          <span className="text-stone-600 text-sm ml-2">· Menú del día</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-stone-400">
          <span className="flex items-center gap-1.5"><FontAwesomeIcon icon={faCircle} className="text-emerald-500 text-[8px]" /> Disponible</span>
          <span className="flex items-center gap-1.5"><FontAwesomeIcon icon={faCircle} className="text-red-600 text-[8px]" /> Agotado</span>
          <span className="font-mono text-amber-400 text-lg font-bold">
            {clock.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </header>

      {/* Grid de categorías */}
      <main className="flex-1 p-4 overflow-hidden">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 h-full">
          {visible.map(({ categoria, productos }, idx) => (
            <div key={categoria.id} className={`rounded-xl border overflow-hidden flex flex-col ${CAT_HEADER_COLOR[idx % 6]}`}>
              {/* Category header */}
              <div className={`px-4 py-3 border-b ${CAT_HEADER_COLOR[idx % 6]} flex items-center gap-2`}>
                <span className="text-xl">{categoria.emoji}</span>
                <h3 className="font-bold text-stone-100 text-base tracking-wide">{categoria.nombre}</h3>
              </div>

              {/* Products list */}
              <div className="flex-1 overflow-y-auto bg-[#111827]/80 px-3 py-2 space-y-1">
                {productos.map(p => (
                  <div key={p.id} className={`flex items-center justify-between py-1.5 border-b border-stone-800/50 last:border-0 ${!p.disponible ? 'opacity-40' : ''}`}>
                    <div className="flex items-center gap-2 min-w-0">
                      <FontAwesomeIcon icon={faCircle}
                        className={`text-[8px] flex-shrink-0 ${p.disponible ? 'text-emerald-500' : 'text-red-600'}`}
                      />
                      <span className={`text-sm leading-tight truncate ${p.disponible ? 'text-stone-200' : 'text-stone-500 line-through'}`}>
                        {p.nombre}
                      </span>
                    </div>
                    <span className={`text-sm font-bold flex-shrink-0 ml-2 ${p.disponible ? 'text-amber-400' : 'text-stone-600'}`}>
                      ${Number(p.precio).toLocaleString()}
                    </span>
                  </div>
                ))}
                {!productos.length && (
                  <p className="text-stone-600 text-xs text-center py-4">Sin productos</p>
                )}
              </div>
            </div>
          ))}

          {/* Placeholder si hay menos de 6 categorías */}
          {visible.length < 6 && Array.from({ length: 6 - visible.length }).map((_, i) => (
            <div key={`empty-${i}`} className="rounded-xl border border-stone-800/30 bg-stone-900/20 flex items-center justify-center">
              <span className="text-stone-700 text-sm">—</span>
            </div>
          ))}
        </div>
      </main>

      <footer className="px-8 py-2 border-t border-stone-800 text-stone-700 text-xs text-center">
        Actualiza cada minuto · {window.location.host}/cartatv2
      </footer>
    </div>
  );
}
