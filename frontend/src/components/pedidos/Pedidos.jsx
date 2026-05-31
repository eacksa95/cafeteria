import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCheck, faTrash, faEye, faTimes } from '@fortawesome/free-solid-svg-icons';
import { usePedidos, useUpdatePedido, useDeletePedido, useProductos } from '../../api/queries';

const COLUMNS = [
  { key: 'pendiente',  label: 'Pendientes',  next: 'en_proceso', nextLabel: 'Iniciar',  accent: 'border-t-amber-500',   badge: 'bg-amber-100 text-amber-800', dot: 'bg-amber-400' },
  { key: 'en_proceso', label: 'En proceso',  next: 'listo',      nextLabel: 'Listo',    accent: 'border-t-blue-400',    badge: 'bg-blue-100 text-blue-800',   dot: 'bg-blue-400' },
  { key: 'listo',      label: 'Listos',      next: 'entregado',  nextLabel: 'Entregar', accent: 'border-t-emerald-500', badge: 'bg-emerald-100 text-emerald-800', dot: 'bg-emerald-500' },
];

function fmtHora(str) {
  if (!str) return '—';
  try {
    const [h, m] = str.split(':');
    const d = new Date(); d.setHours(h, m);
    return d.toLocaleString('es', { hour: '2-digit', minute: '2-digit' });
  } catch { return str; }
}

function toList(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') { try { return JSON.parse(val); } catch {} }
  return [];
}

// ── Modal de detalle ──────────────────────────────────────────────────────────
function DetalleModal({ pedido, productos, onClose }) {
  if (!pedido) return null;

  const ids      = toList(pedido.lista_productos);
  const cantidades = toList(pedido.lista_cantidad);
  const nombres  = ids.map(id => {
    const p = productos?.find(p => Number(p.id) === Number(id));
    return p ? p.nombre : `Producto #${id}`;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      <div className="relative bg-white rounded-2xl border border-amber-100 shadow-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-amber-800 text-lg">Pedido #{pedido.id}</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <dl className="space-y-2 text-sm mb-4">
          {[
            ['Mesa', pedido.mesa],
            ['Estado', pedido.estado],
            ['Total', `$${pedido.monto}`],
            ['Recibido', fmtHora(pedido.hora_recepcion)],
            ['Listo', fmtHora(pedido.hora_listo)],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <dt className="text-stone-500">{k}</dt>
              <dd className="text-stone-800 font-medium">{v}</dd>
            </div>
          ))}
        </dl>

        {nombres.length > 0 && (
          <div className="border-t border-amber-100 pt-3">
            <p className="text-stone-500 text-xs mb-2 uppercase tracking-wide">Productos</p>
            <ul className="space-y-1">
              {nombres.map((nombre, i) => (
                <li key={i} className="text-stone-700 text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0" />
                  {nombre}
                  {cantidades[i] != null && <span className="text-stone-400 text-xs">×{cantidades[i]}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Card compacta ─────────────────────────────────────────────────────────────
function PedidoCard({ pedido, column, onAction, onDelete, onVer, disabled }) {
  return (
    <div className="bg-white rounded-lg border border-amber-100 shadow-sm p-2.5 text-xs">
      <div className="flex items-center justify-between mb-1">
        <span className="font-bold text-stone-700">#{pedido.id} · Mesa {pedido.mesa}</span>
        <span className="text-stone-400 text-[10px]">{fmtHora(pedido.hora_recepcion)}</span>
      </div>
      <p className="text-amber-700 font-bold text-sm mb-2">${pedido.monto}</p>
      <div className="flex gap-1">
        <button onClick={() => onAction(pedido, column)} disabled={disabled}
          className="flex-1 flex items-center justify-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded px-2 py-1.5 transition-colors disabled:opacity-40 font-medium">
          {column.next === 'entregado'
            ? <><FontAwesomeIcon icon={faCheck} size="xs" /> {column.nextLabel}</>
            : <><FontAwesomeIcon icon={faArrowRight} size="xs" /> {column.nextLabel}</>
          }
        </button>
        <button onClick={() => onVer(pedido)}
          className="bg-stone-50 hover:bg-stone-100 text-stone-500 border border-stone-200 rounded px-2 py-1.5 transition-colors" title="Ver detalle">
          <FontAwesomeIcon icon={faEye} size="xs" />
        </button>
        <button onClick={() => onDelete(pedido)} disabled={disabled}
          className="bg-red-50 hover:bg-red-100 text-red-500 border border-red-200 rounded px-2 py-1.5 transition-colors disabled:opacity-40" title="Eliminar">
          <FontAwesomeIcon icon={faTrash} size="xs" />
        </button>
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
const Pedidos = ({ setMensaje }) => {
  const { data: pedidos, isLoading, error } = usePedidos();
  const { data: productos } = useProductos();
  const updatePedido = useUpdatePedido();
  const deletePedido = useDeletePedido();
  const [detalle, setDetalle] = useState(null);

  const onAction = async (pedido, column) => {
    try {
      const update = { id: pedido.id, estado: column.next };
      if (column.next === 'listo')     update.hora_listo     = new Date().toLocaleTimeString([], { hour12: false });
      if (column.next === 'entregado') update.hora_entregado = new Date().toLocaleTimeString([], { hour12: false });
      await updatePedido.mutateAsync(update);
      setMensaje(`Pedido #${pedido.id} → ${column.nextLabel}`);
    } catch { setMensaje('Error al actualizar el pedido'); }
  };

  const onDelete = async (pedido) => {
    if (!window.confirm(`¿Eliminar Pedido #${pedido.id}?`)) return;
    try { await deletePedido.mutateAsync(pedido.id); setMensaje('Pedido eliminado'); }
    catch { setMensaje('Error al eliminar'); }
  };

  if (isLoading) return <p className="state-loading">Cargando pedidos...</p>;
  if (error)    return <p className="state-error">Error al cargar pedidos</p>;

  const busy = updatePedido.isPending || deletePedido.isPending;

  return (
    <div className="page">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {COLUMNS.map(col => {
          const items = pedidos?.filter(p => p.estado === col.key) || [];
          return (
            <div key={col.key} className={`bg-white rounded-xl border border-amber-100 shadow-sm border-t-2 ${col.accent} flex flex-col`}>
              <div className="flex items-center justify-between px-3 py-2.5 border-b border-amber-50">
                <span className="text-sm font-semibold text-stone-700">{col.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${col.badge}`}>{items.length}</span>
              </div>
              <div className="p-2 space-y-2 flex-1 overflow-y-auto max-h-[55vh]">
                {!items.length && <p className="text-stone-300 text-xs text-center py-6">Sin pedidos</p>}
                {items.map(p => (
                  <PedidoCard key={p.id} pedido={p} column={col}
                    onAction={onAction} onDelete={onDelete} onVer={setDetalle} disabled={busy} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <DetalleModal pedido={detalle} productos={productos} onClose={() => setDetalle(null)} />
    </div>
  );
};

export default Pedidos;
