import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShoppingCart, faPlus, faMinus, faTrash, faTimes,
  faPaperPlane, faChevronDown, faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import { useProductos, useCategorias } from '../../api/queries';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';
const CAT_EMOJI = { 1: '☕', 2: '🥤', 3: '🥐', 4: '🍟', 5: '🍽️', 6: '🍰' };

export const CarritoIndex = ({ setMensaje, userId }) => {
  const { data: productos, isLoading } = useProductos();
  const { data: categorias = [] }      = useCategorias();

  const [catActiva, setCatActiva]   = useState(null);
  const [cart, setCart]             = useState([]);
  const [cartOpen, setCartOpen]     = useState(false);
  const [mesa, setMesa]             = useState('');
  const [cliente, setCliente]       = useState('');
  const [sending, setSending]       = useState(false);

  // ── Cart operations ──────────────────────────────────────────────────────────
  const addToCart = (prod) => {
    setCart(prev => {
      const found = prev.find(i => i.id === prod.id);
      if (found) return prev.map(i => i.id === prod.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...prod, qty: 1 }];
    });
  };

  const changeQty = (id, delta) =>
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0));

  const total = cart.reduce((s, i) => s + Number(i.precio) * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  const filtrados = (productos || []).filter(p =>
    (catActiva ? Number(p.categoria_id) === catActiva : true) && p.disponible !== false
  );

  // ── Enviar pedido ────────────────────────────────────────────────────────────
  const handleEnviar = async () => {
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
          // id omitido — el backend auto-asigna
          mesa:             mesa.trim() || 'Sin mesa',
          cliente:          cliente.trim() || 'Anónimo',
          lista_productos:  cart.map(i => i.id),
          lista_cantidad:   cart.map(i => i.qty),
          monto:            total,
          estado:           'pendiente',
          hora_listo:       null,
          hora_entregado:   null,
          creado_por_id:    userId || null,
        }),
      });
      if (r.ok) {
        setCart([]); setMesa(''); setCliente(''); setCartOpen(false);
        setMensaje('Pedido enviado a la cocina ✓');
      } else {
        const err = await r.json().catch(() => ({}));
        setMensaje(`Error al enviar: ${JSON.stringify(err)}`);
      }
    } catch { setMensaje('Error de conexión al enviar el pedido'); }
    finally   { setSending(false); }
  };

  // ── Layout ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full bg-amber-50">

      {/* ── CART PANEL — siempre visible en la parte superior ── */}
      <div className="flex-shrink-0 bg-white border-b border-amber-100 shadow-sm">

        {/* Barra de resumen — siempre visible */}
        <div className="flex items-center gap-3 px-3 py-2">
          <button
            onClick={() => setCartOpen(v => !v)}
            className="flex items-center gap-2 flex-1 text-left"
          >
            <div className="relative">
              <FontAwesomeIcon icon={faShoppingCart} className="text-amber-700 text-lg" />
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-600 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                  {count}
                </span>
              )}
            </div>
            <span className="text-sm font-semibold text-stone-700">
              {count > 0 ? `${count} ítem${count > 1 ? 's' : ''} · $${total.toLocaleString()}` : 'Carrito vacío'}
            </span>
            <FontAwesomeIcon icon={cartOpen ? faChevronUp : faChevronDown} className="text-stone-400 text-xs ml-auto" />
          </button>

          {count > 0 && (
            <button onClick={handleEnviar} disabled={sending}
              className="btn-primary flex items-center gap-1.5 py-1.5 flex-shrink-0">
              <FontAwesomeIcon icon={faPaperPlane} size="sm" />
              {sending ? 'Enviando...' : 'Enviar'}
            </button>
          )}
        </div>

        {/* Panel expandible del carrito */}
        {cartOpen && (
          <div className="border-t border-amber-100">
            {/* Campos: mesa + cliente */}
            <div className="flex gap-2 px-3 pt-2 pb-1">
              <input
                className="input-base flex-1"
                placeholder="Mesa (opcional)"
                type="text"
                value={mesa}
                onChange={e => setMesa(e.target.value)}
              />
              <input
                className="input-base flex-1"
                placeholder="Cliente (opcional)"
                type="text"
                value={cliente}
                onChange={e => setCliente(e.target.value)}
              />
            </div>

            {/* Ítems del carrito */}
            {cart.length > 0 ? (
              <div className="px-3 pb-2 space-y-1 max-h-40 overflow-y-auto">
                {cart.map(i => (
                  <div key={i.id} className="flex items-center gap-2">
                    <span className="text-base">{CAT_EMOJI[i.categoria_id] || '🍽️'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-stone-700 text-xs font-medium truncate">{i.nombre}</p>
                      <p className="text-amber-600 text-xs">${(Number(i.precio) * i.qty).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => changeQty(i.id, -1)} className="w-5 h-5 bg-stone-100 hover:bg-stone-200 rounded text-stone-600 text-xs flex items-center justify-center">−</button>
                      <span className="text-stone-700 text-xs w-4 text-center font-bold">{i.qty}</span>
                      <button onClick={() => changeQty(i.id, 1)} className="w-5 h-5 bg-amber-100 hover:bg-amber-200 rounded text-amber-700 text-xs flex items-center justify-center">+</button>
                      <button onClick={() => changeQty(i.id, -i.qty)} className="text-stone-300 hover:text-red-400 ml-0.5">
                        <FontAwesomeIcon icon={faTrash} size="xs" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-stone-400 text-xs text-center py-3">Agregá productos abajo</p>
            )}
          </div>
        )}
      </div>

      {/* ── CATEGORY PILLS — flex-wrap para que entren en varias filas ── */}
      <div className="flex-shrink-0 bg-white border-b border-amber-100 px-3 py-2">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setCatActiva(null)}
            className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-medium transition-colors border ${
              !catActiva
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
            }`}
          >
            Todo
          </button>
          {categorias.map(cat => (
            <button key={cat.id} onClick={() => setCatActiva(cat.id)}
              className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors border ${
                catActiva === cat.id
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
              }`}>
              {cat.emoji} {cat.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* ── PRODUCT GRID ── */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        {isLoading ? (
          <p className="state-loading">Cargando productos...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {filtrados.map(p => {
              const inCart = cart.find(i => i.id === p.id);
              return (
                <div key={p.id} className="bg-white rounded-xl border border-amber-100 shadow-sm overflow-hidden">
                  {/* Imagen o emoji de categoría */}
                  <div className="h-16 bg-amber-50 flex items-center justify-center overflow-hidden">
                    {p.img
                      ? <img src={p.img} alt={p.nombre} className="w-full h-full object-cover"
                          onError={e => { e.target.parentNode.innerHTML = `<span style="font-size:2rem">${CAT_EMOJI[p.categoria_id] || '🍽️'}</span>`; }} />
                      : <span style={{ fontSize: '2rem' }}>{CAT_EMOJI[p.categoria_id] || '🍽️'}</span>
                    }
                  </div>
                  <div className="p-2">
                    <p className="text-stone-800 text-xs font-semibold line-clamp-2 leading-snug mb-0.5">{p.nombre}</p>
                    <p className="text-amber-700 font-bold text-sm mb-2">${Number(p.precio).toLocaleString()}</p>
                    {inCart ? (
                      <div className="flex items-center justify-between gap-1">
                        <button onClick={() => changeQty(p.id, -1)} className="flex-1 h-6 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded text-xs">−</button>
                        <span className="text-stone-700 text-xs font-bold w-5 text-center">{inCart.qty}</span>
                        <button onClick={() => changeQty(p.id, 1)} className="flex-1 h-6 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs">+</button>
                      </div>
                    ) : (
                      <button onClick={() => addToCart(p)}
                        className="w-full bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded py-1 text-xs font-medium transition-colors flex items-center justify-center gap-1">
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
    </div>
  );
};
