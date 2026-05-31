import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMugHot, faHouse, faShoppingCart, faTimes, faPlus, faMinus, faTrash, faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

// Mapeo de emoji por categoría_id
const CAT_EMOJI = { 1: '☕', 2: '🥤', 3: '🥐', 4: '🍟', 5: '🍽️', 6: '🍰' };
const CAT_COLOR = {
  1: 'bg-amber-900/40 text-amber-300 border-amber-700',
  2: 'bg-blue-900/40 text-blue-300 border-blue-700',
  3: 'bg-orange-900/40 text-orange-300 border-orange-700',
  4: 'bg-yellow-900/40 text-yellow-300 border-yellow-700',
  5: 'bg-green-900/40 text-green-300 border-green-700',
  6: 'bg-pink-900/40 text-pink-300 border-pink-700',
};
const IMG_FALLBACK = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>';

export default function CartaMozo() {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos]   = useState([]);
  const [catActiva, setCatActiva]   = useState(null);
  const [cart, setCart]             = useState([]);
  const [cartOpen, setCartOpen]     = useState(false);
  const [mesa, setMesa]             = useState('');
  const [sending, setSending]       = useState(false);
  const [msg, setMsg]               = useState('');

  useEffect(() => {
    fetch(`${API_URL}/categorias/`).then(r => r.json()).then(d => {
      setCategorias(d);
      if (d.length) setCatActiva(d[0].id);
    }).catch(() => {});
    fetch(`${API_URL}/api/productos/menu/`).then(r => r.json()).then(setProductos).catch(() => {});
  }, []);

  const showMsg = (text) => { setMsg(text); setTimeout(() => setMsg(''), 3000); };

  const addToCart = (prod) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === prod.id);
      if (existing) return prev.map(i => i.id === prod.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...prod, qty: 1 }];
    });
  };

  const changeQty = (id, delta) => {
    setCart(prev => {
      const updated = prev.map(i => i.id === id ? { ...i, qty: i.qty + delta } : i);
      return updated.filter(i => i.qty > 0);
    });
  };

  const total  = cart.reduce((s, i) => s + Number(i.precio) * i.qty, 0);
  const count  = cart.reduce((s, i) => s + i.qty, 0);

  // Filtrar por categoria_id — Number() para comparar correctamente
  const filtrados = catActiva
    ? productos.filter(p => Number(p.categoria_id) === catActiva)
    : productos;

  const handleEnviar = async () => {
    if (!mesa) { showMsg('Ingresá el número de mesa'); return; }
    if (!cart.length) { showMsg('El carrito está vacío'); return; }
    const token = window.localStorage.getItem('accessToken');
    if (!token) { showMsg('Necesitás iniciar sesión'); return; }
    setSending(true);
    try {
      const r = await fetch(`${API_URL}/pedidos/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${JSON.parse(token)}` },
        body: JSON.stringify({
          id: Date.now(),
          mesa, cliente: `Mesa ${mesa}`,
          lista_productos: cart.map(i => i.id),
          lista_cantidad: cart.map(i => i.qty),
          monto: total,
          estado: 'pendiente',
          fecha_recepcion: new Date().toISOString().split('T')[0],
          hora_recepcion: new Date().toLocaleTimeString([], { hour12: false }),
          hora_listo: null, hora_entregado: null,
        }),
      });
      if (r.ok) {
        setCart([]); setMesa(''); setCartOpen(false);
        showMsg('¡Pedido enviado a cocina! ✓');
      } else showMsg('Error al enviar el pedido');
    } catch { showMsg('Error de conexión'); }
    finally { setSending(false); }
  };

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-stone-950 border-b border-stone-800 flex items-center justify-between px-4 h-14 flex-shrink-0">
        <div className="flex items-center gap-2">
          <a href="/" className="text-stone-500 hover:text-amber-400 transition-colors p-1">
            <FontAwesomeIcon icon={faHouse} />
          </a>
          <FontAwesomeIcon icon={faMugHot} className="text-amber-500" />
          <span className="font-bold text-stone-100 text-sm">Carta</span>
        </div>
        <button onClick={() => setCartOpen(true)} className="relative flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
          <FontAwesomeIcon icon={faShoppingCart} />
          {count > 0 && <span className="bg-white text-amber-700 text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">{count}</span>}
          <span className="hidden sm:inline">${total.toFixed(0)}</span>
        </button>
      </header>

      {msg && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-stone-800 text-stone-100 px-4 py-2 rounded-lg text-sm border border-stone-600 shadow-lg">
          {msg}
        </div>
      )}

      {/* Category tabs */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto flex-shrink-0 bg-stone-950 border-b border-stone-800/50">
        <button
          onClick={() => setCatActiva(null)}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${!catActiva ? 'bg-amber-600 text-white' : 'bg-stone-800 text-stone-400 hover:text-stone-200'}`}
        >
          Todo
        </button>
        {categorias.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCatActiva(cat.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${catActiva === cat.id ? 'bg-amber-600 text-white' : 'bg-stone-800 text-stone-400 hover:text-stone-200'}`}
          >
            <span>{cat.emoji}</span>
            {cat.nombre}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <main className="flex-1 px-3 py-3 overflow-y-auto pb-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filtrados.map(p => {
            const inCart = cart.find(i => i.id === p.id);
            const catColor = CAT_COLOR[p.categoria_id] || 'bg-stone-800 text-stone-300 border-stone-700';
            return (
              <div key={p.id} className="bg-stone-950 rounded-xl border border-stone-800 overflow-hidden">
                {/* Image / category visual */}
                <div className={`h-24 flex items-center justify-center text-4xl bg-stone-800`}>
                  {p.img
                    ? <img src={p.img} alt={p.nombre} className="w-full h-full object-cover" onError={e => { e.target.parentNode.innerHTML = `<span class="text-4xl">${CAT_EMOJI[p.categoria_id] || '🍽️'}</span>`; }} />
                    : <span>{CAT_EMOJI[p.categoria_id] || '🍽️'}</span>
                  }
                </div>
                <div className="p-2.5">
                  <p className="text-stone-100 text-xs font-semibold leading-snug mb-0.5 line-clamp-2">{p.nombre}</p>
                  <p className="text-amber-400 font-bold text-sm mb-2">${Number(p.precio).toLocaleString()}</p>
                  {inCart ? (
                    <div className="flex items-center justify-between">
                      <button onClick={() => changeQty(p.id, -1)} className="w-7 h-7 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition-colors">
                        <FontAwesomeIcon icon={faMinus} size="xs" />
                      </button>
                      <span className="text-stone-200 font-bold text-sm">{inCart.qty}</span>
                      <button onClick={() => changeQty(p.id, 1)} className="w-7 h-7 rounded-lg bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center transition-colors">
                        <FontAwesomeIcon icon={faPlus} size="xs" />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => addToCart(p)} className="w-full bg-stone-800 hover:bg-amber-600/80 text-stone-300 hover:text-white rounded-lg py-1.5 text-xs font-medium transition-colors flex items-center justify-center gap-1">
                      <FontAwesomeIcon icon={faPlus} size="xs" /> Agregar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {!filtrados.length && <p className="text-stone-600 text-center py-12 text-sm">No hay productos en esta categoría</p>}
      </main>

      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={() => setCartOpen(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative bg-stone-900 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[85dvh] flex flex-col border border-stone-800 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800">
              <h3 className="font-bold text-stone-100">Pedido</h3>
              <button onClick={() => setCartOpen(false)} className="text-stone-500 hover:text-stone-300">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-5 py-3 space-y-2">
              {cart.map(i => (
                <div key={i.id} className="flex items-center gap-3">
                  <span className="text-lg">{CAT_EMOJI[i.categoria_id] || '🍽️'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-stone-200 text-sm font-medium truncate">{i.nombre}</p>
                    <p className="text-amber-400 text-xs">${(Number(i.precio) * i.qty).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => changeQty(i.id, -1)} className="w-6 h-6 bg-stone-800 rounded text-stone-400 flex items-center justify-center">
                      <FontAwesomeIcon icon={faMinus} size="xs" />
                    </button>
                    <span className="text-stone-200 text-sm w-4 text-center">{i.qty}</span>
                    <button onClick={() => changeQty(i.id, 1)} className="w-6 h-6 bg-amber-600 rounded text-white flex items-center justify-center">
                      <FontAwesomeIcon icon={faPlus} size="xs" />
                    </button>
                    <button onClick={() => changeQty(i.id, -i.qty)} className="text-stone-600 hover:text-red-400 ml-1">
                      <FontAwesomeIcon icon={faTrash} size="xs" />
                    </button>
                  </div>
                </div>
              ))}
              {!cart.length && <p className="text-stone-600 text-sm text-center py-6">El carrito está vacío</p>}
            </div>

            {cart.length > 0 && (
              <div className="px-5 py-4 border-t border-stone-800 space-y-3">
                <div className="flex justify-between font-bold">
                  <span className="text-stone-300">Total</span>
                  <span className="text-amber-400 text-lg">${total.toLocaleString()}</span>
                </div>
                <input
                  className="input-base"
                  placeholder="Mesa # *"
                  type="number"
                  value={mesa}
                  onChange={e => setMesa(e.target.value)}
                />
                <button onClick={handleEnviar} disabled={sending}
                  className="btn-primary w-full flex items-center justify-center gap-2">
                  <FontAwesomeIcon icon={faPaperPlane} size="sm" />
                  {sending ? 'Enviando...' : 'Enviar a Cocina'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
