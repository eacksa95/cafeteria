/**
 * CartaTv1 — Carrusel de productos para TV/pantalla grande
 * URL: /cartatv1
 * Rota automáticamente entre los productos disponibles.
 */
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMugHot } from '@fortawesome/free-solid-svg-icons';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';
const CAT_EMOJI = { 1: '☕', 2: '🥤', 3: '🥐', 4: '🍟', 5: '🍽️', 6: '🍰' };
const SLIDE_DURATION = 6000; // ms por slide

function useClock() {
  const [t, setT] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id); }, []);
  return t;
}

export default function CartaTv1() {
  const [productos, setProductos] = useState([]);
  const [current, setCurrent]     = useState(0);
  const [fade, setFade]           = useState(true);
  const clock = useClock();

  useEffect(() => {
    const fetch_ = () => fetch(`${API_URL}/api/productos/menu/`).then(r => r.json()).then(setProductos).catch(() => {});
    fetch_();
    const refreshId = setInterval(fetch_, 60000);
    return () => clearInterval(refreshId);
  }, []);

  useEffect(() => {
    if (!productos.length) return;
    const id = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent(c => (c + 1) % productos.length);
        setFade(true);
      }, 400);
    }, SLIDE_DURATION);
    return () => clearInterval(id);
  }, [productos]);

  const prod = productos[current];

  return (
    <div className="min-h-screen bg-[#1a1512] flex flex-col overflow-hidden select-none">
      {/* Header bar */}
      <header className="flex items-center justify-between px-10 py-5 border-b border-amber-900/30">
        <div className="flex items-center gap-3">
          <FontAwesomeIcon icon={faMugHot} className="text-amber-500 text-2xl" />
          <span className="text-2xl font-bold text-stone-100 tracking-wide">Coffee Shop</span>
        </div>
        <div className="text-right">
          <p className="text-4xl font-mono font-bold text-amber-400">
            {clock.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="text-stone-500 text-sm capitalize">
            {clock.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
      </header>

      {/* Slide principal */}
      <main className="flex-1 flex items-center justify-center px-10">
        {prod ? (
          <div className={`flex flex-col lg:flex-row items-center gap-16 transition-opacity duration-400 ${fade ? 'opacity-100' : 'opacity-0'}`}>

            {/* Visual */}
            <div className="flex-shrink-0 w-72 h-72 rounded-3xl bg-stone-800 border border-stone-700 flex items-center justify-center text-[120px] shadow-2xl overflow-hidden">
              {prod.img
                ? <img src={prod.img} alt={prod.nombre} className="w-full h-full object-cover" onError={e => { e.target.parentNode.innerHTML = `<span style="font-size:7rem">${CAT_EMOJI[prod.categoria_id] || '🍽️'}</span>`; }} />
                : <span style={{ fontSize: '7rem' }}>{CAT_EMOJI[prod.categoria_id] || '🍽️'}</span>
              }
            </div>

            {/* Info */}
            <div className="text-center lg:text-left">
              {prod.descripcion && <p className="text-stone-400 text-xl mb-3">{prod.descripcion}</p>}
              <h2 className="text-6xl lg:text-7xl font-bold text-stone-100 leading-tight mb-4">{prod.nombre}</h2>
              <p className="text-7xl font-black text-amber-400">${Number(prod.precio).toLocaleString()}</p>
            </div>
          </div>
        ) : (
          <p className="text-stone-500 text-2xl animate-pulse">Cargando menú...</p>
        )}
      </main>

      {/* Progress dots */}
      <footer className="flex justify-center gap-2 py-6">
        {productos.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`transition-all rounded-full ${i === current ? 'w-8 h-2 bg-amber-500' : 'w-2 h-2 bg-stone-700 hover:bg-stone-500'}`}
          />
        ))}
      </footer>
    </div>
  );
}
