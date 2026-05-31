import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faPlus, faMinus, faTrash, faTimes, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useProductos, useCategorias } from '../../api/queries';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';
const CAT_EMOJI = { 1: '☕', 2: '🥤', 3: '🥐', 4: '🍟', 5: '🍽️', 6: '🍰' };

export const CarritoIndex = ({ setMensaje }) => {
  const { data: productos, isLoading } = useProductos();
  const { data: categorias = [] } = useCategorias();
  const [catActiva, setCatActiva] = useState(null);
  const [cart, setCart]           = useState([]);
  const [cartOpen, setCartOpen]   = useState(false);
  const [mesa, setMesa]           = useState('');
  const [sending, setSending]     = useState(false);

  const addToCart = (prod) => {
    setCart(prev => {
      const found = prev.find(i => i.id === prod.id);
      if (found) return prev.map(i => i.id === prod.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...prod, qty: 1 }];
    });
  };

  const changeQty = (id, delta) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0));
  };

  const total = cart.reduce((s, i) => s + Number(i.precio) * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  const filtrados = catActiva
    ? (productos || []).filter(p => p.categoria_id === catActiva && p.disponible !== false)
    : (productos || []).filter(p => p.disponible !== false);

  const handleEnviar = async () => {
    if (!mesa) { setMensaje('Ingresá el número de mesa'); return; }
    if (!cart.length) { setMensaje('El carrito está vacío'); return; }
    setSending(true);
    try {
      const r = await fetch(`${API_URL}/pedidos/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${JSON.parse(window.localStorage.getItem('accessToken'))}`,
        },
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
        setMensaje('Pedido enviado a la cocina ✓');
      } else setMensaje('Error al enviar el pedido');
    } catch { setMensaje('Error de conexión'); }
    finally { setSending(false); }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Category filter */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto border-b border-stone-800 bg-stone-900 flex-shrink-0">
        <button
          onClick={() => setCatActiva(null)}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${!catActiva ? 'bg-amber-600 text-white' : 'bg-stone-800 text-stone-400 hover:text-stone-200'}`}
        >
          Todo
        </button>
        {categorias.map(cat => (
          <button key={cat.id} onClick={() => setCatActiva(cat.id)}
            className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${catActiva === cat.id ? 'bg-amber-600 text-white' : 'bg-stone-800 text-stone-400 hover:text-stone-200'}`}>
            {cat.emoji} {cat.nombre}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {isLoading ? (
          <p className="state-loading">Cargando productos...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filtrados.map(p => {
              const inCart = cart.find(i => i.id === p.id);
              return (
                <div key={p.id} className="bg-stone-900 rounded-xl border border-stone-800 overflow-hidden">
                  <div className="h-20 bg-stone-800 flex items-center justify-center text-4xl overflow-hidden">
                    {p.img
                      ? <img src={p.img} alt={p.nombre} className="w-full h-full object-cover" onError={e => { e.target.parentNode.innerHTML = `<span style="font-size:2.2rem">${CAT_EMOJI[p.categoria_id] || '🍽️'}</span>`; }} />
                      : <span style={{ fontSize: '2.2rem' }}>{CAT_EMOJI[p.categoria_id] || '🍽️'}</span>
                    }
                  </div>
                  <div className="p-2">
                    <p className="text-stone-100 text-xs font-semibold line-clamp-2 leading-snug mb-0.5">{p.nombre}</p>
                    <p className="text-amber-400 font-bold text-sm mb-2">${Number(p.precio).toLocaleString()}</p>
                    {inCart ? (
                      <div className="flex items-center justify-between gap-1">
                        <button onClick={() => changeQty(p.id, -1)} className="flex-1 h-6 bg-stone-700 hover:bg-stone-600 text-stone-300 rounded text-xs transition-colors">−</button>
                        <span className="text-stone-200 text-xs font-bold w-5 text-center">{inCart.qty}</span>
                        <button onClick={() => changeQty(p.id, 1)} className="flex-1 h-6 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs transition-colors">+</button>
                      </div>
                    ) : (
                      <button onClick={() => addToCart(p)}
                        className="w-full bg-stone-800 hover:bg-amber-600/80 text-stone-400 hover:text-white rounded py-1 text-xs font-medium transition-colors flex items-center justify-center gap-1">
                        <FontAwesomeIcon icon={faPlus} size="xs" /> Agregar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {!filtrados.length && <p className="state-empty col-span-full">No hay productos disponibles</p>}
          </div>
        )}
      </div>

      {/* Floating cart bar */}
      {count > 0 && (
        <div className="flex-shrink-0 px-4 py-3 bg-stone-950 border-t border-stone-800">
          <button onClick={() => setCartOpen(true)}
            className="w-full btn-primary flex items-center justify-between py-3 px-5">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faShoppingCart} />
              <span className="bg-white text-amber-700 text-xs font-black rounded-full w-5 h-5 flex items-center justify-center">{count}</span>
            </div>
            <span className="font-bold">Ver pedido</span>
            <span className="font-bold">${total.toLocaleString()}</span>
          </button>
        </div>
      )}

      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={() => setCartOpen(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative bg-stone-900 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[80dvh] flex flex-col border border-stone-700 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800">
              <h3 className="font-bold text-stone-100">Tu pedido · {count} ítems</h3>
              <button onClick={() => setCartOpen(false)} className="text-stone-500 hover:text-stone-300 p-1">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-5 py-3 space-y-2">
              {cart.map(i => (
                <div key={i.id} className="flex items-center gap-3">
                  <span className="text-xl">{CAT_EMOJI[i.categoria_id] || '🍽️'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-stone-200 text-sm font-medium truncate">{i.nombre}</p>
                    <p className="text-amber-400 text-xs">${(Number(i.precio) * i.qty).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => changeQty(i.id, -1)} className="w-6 h-6 bg-stone-800 rounded text-stone-300 flex items-center justify-center text-xs">−</button>
                    <span className="text-stone-200 text-sm w-4 text-center">{i.qty}</span>
                    <button onClick={() => changeQty(i.id, 1)} className="w-6 h-6 bg-amber-600 rounded text-white flex items-center justify-center text-xs">+</button>
                    <button onClick={() => changeQty(i.id, -i.qty)} className="text-stone-600 hover:text-red-400 p-1"><FontAwesomeIcon icon={faTrash} size="xs" /></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-stone-800 space-y-3">
              <div className="flex justify-between font-bold"><span className="text-stone-300">Total</span><span className="text-amber-400 text-lg">${total.toLocaleString()}</span></div>
              <input className="input-base" placeholder="Mesa # *" type="number" value={mesa} onChange={e => setMesa(e.target.value)} />
              <button onClick={handleEnviar} disabled={sending} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                <FontAwesomeIcon icon={faPaperPlane} size="sm" />
                {sending ? 'Enviando...' : 'Enviar a Cocina'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
