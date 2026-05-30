import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faShoppingCart, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

export const Carrito = ({ pedidoNuevo, allProducts, setAllProducts, total, countProducts, setCountProducts, setTotal }) => {
  const [mesa, setMesa]     = useState('');
  const [pedidos, setPedidos] = useState([]);
  const [sending, setSending] = useState(false);

  useEffect(() => { fetchPedidos(); }, []);

  const fetchPedidos = async () => {
    try {
      const r = await fetch(`${API_URL}/pedidos/`, {
        headers: { Authorization: `Bearer ${JSON.parse(window.localStorage.getItem('accessToken'))}`, 'Content-Type': 'application/json' },
      });
      if (r.ok) setPedidos(await r.json());
    } catch {}
  };

  const onDelete = (producto) => {
    setAllProducts(allProducts.filter(i => i.id !== producto.id));
    setTotal(total - producto.precio * producto.cantidad);
    setCountProducts(countProducts - producto.cantidad);
  };

  const onClean = () => { setAllProducts([]); setTotal(0); setCountProducts(0); };

  const onEnviar = async () => {
    if (!mesa) { alert('Ingresá el número de mesa'); return; }
    if (!allProducts.length) { alert('El carrito está vacío'); return; }

    const nextId = pedidos.reduce((m, p) => p.id > m ? p.id : m, 0) + 1;
    setSending(true);
    try {
      const r = await fetch(`${API_URL}/pedidos/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${JSON.parse(window.localStorage.getItem('accessToken'))}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: nextId,
          mesa,
          cliente: `Mesa ${mesa}`,
          lista_productos: allProducts.map(p => p.id),
          lista_cantidad:  allProducts.map(p => p.cantidad),
          monto: total,
          estado: 'pendiente',
          fecha_recepcion: new Date().toISOString().split('T')[0],
          hora_recepcion:  new Date().toLocaleTimeString([], { hour12: false }),
          hora_listo: null, hora_entregado: null,
        }),
      });
      if (r.ok) {
        pedidoNuevo();
        onClean();
        setMesa('');
        fetchPedidos();
      } else {
        alert('Error al enviar el pedido');
      }
    } catch { alert('Error de conexión'); }
    finally { setSending(false); }
  };

  return (
    <div className="card sticky top-20">
      <div className="flex items-center gap-2 mb-4">
        <FontAwesomeIcon icon={faShoppingCart} className="text-amber-500" />
        <h3 className="font-semibold text-stone-100">Pedido</h3>
        {countProducts > 0 && (
          <span className="ml-auto bg-amber-600 text-white text-xs rounded-full px-2 py-0.5 font-bold">{countProducts}</span>
        )}
      </div>

      <input
        className="input-base mb-4"
        placeholder="Mesa # *"
        type="number"
        value={mesa}
        onChange={e => setMesa(e.target.value)}
      />

      {allProducts.length ? (
        <>
          <div className="space-y-2 mb-4 max-h-52 overflow-y-auto">
            {allProducts.map(p => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="text-stone-300 truncate flex-1">{p.nombre}</span>
                <span className="text-stone-500 mx-2">×{p.cantidad}</span>
                <span className="text-amber-400 font-medium mr-2">${(p.precio * p.cantidad).toFixed(2)}</span>
                <button onClick={() => onDelete(p)} className="text-red-500 hover:text-red-400 transition-colors p-1">
                  <FontAwesomeIcon icon={faTrash} size="xs" />
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-stone-800 pt-3 mb-4 flex justify-between font-semibold">
            <span className="text-stone-300">Total</span>
            <span className="text-amber-400 text-lg">${total.toFixed(2)}</span>
          </div>

          <button
            onClick={onEnviar}
            className="btn-primary w-full flex items-center justify-center gap-2 mb-2"
            disabled={sending}
          >
            <FontAwesomeIcon icon={faPaperPlane} size="sm" />
            {sending ? 'Enviando...' : 'Enviar a Cocina'}
          </button>
          <button onClick={onClean} className="w-full text-stone-600 hover:text-red-400 text-xs transition-colors py-1">
            Vaciar carrito
          </button>
        </>
      ) : (
        <p className="text-stone-600 text-sm text-center py-6">El carrito está vacío</p>
      )}
    </div>
  );
};
