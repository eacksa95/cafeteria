import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCheck, faTrash, faEye, faTimes } from '@fortawesome/free-solid-svg-icons';
import { usePedidos, useUpdatePedido, useDeletePedido } from '../../api/queries';

// ── Columnas del tablero ──────────────────────────────────────────────────────
const COLUMNS = [
  { key: 'pendiente',  label: 'Pendientes',  next: 'en_proceso', nextLabel: 'Iniciar',  color: 'border-t-amber-500',   badge: 'bg-amber-900/50 text-amber-400' },
  { key: 'en_proceso', label: 'En proceso',  next: 'listo',      nextLabel: 'Listo',    color: 'border-t-blue-500',    badge: 'bg-blue-900/50 text-blue-400' },
  { key: 'listo',      label: 'Listos',      next: 'entregado',  nextLabel: 'Entregar', color: 'border-t-emerald-500', badge: 'bg-emerald-900/50 text-emerald-400' },
];

function fmtHora(str) {
  if (!str) return '—';
  try {
    const [h, m] = str.split(':');
    const d = new Date(); d.setHours(h, m);
    return d.toLocaleString('es', { hour: '2-digit', minute: '2-digit' });
  } catch { return str; }
}

// ── Modal de detalle ──────────────────────────────────────────────────────────
function DetalleModal({ pedido, onClose }) {
  if (!pedido) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative bg-stone-900 rounded-2xl border border-stone-700 p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-amber-400">Pedido #{pedido.id}</h3>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-300">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <dl className="space-y-2 text-sm">
          {[
            ['Mesa',    pedido.mesa],
            ['Cliente', pedido.cliente || '—'],
            ['Estado',  pedido.estado],
            ['Monto',   `$${pedido.monto}`],
            ['Recibido', fmtHora(pedido.hora_recepcion)],
            ['Listo',   fmtHora(pedido.hora_listo)],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <dt className="text-stone-500">{k}</dt>
              <dd className="text-stone-200 font-medium">{v}</dd>
            </div>
          ))}
        </dl>
        {pedido.lista_productos?.length > 0 && (
          <div className="mt-4 pt-4 border-t border-stone-800">
            <p className="text-stone-500 text-xs mb-2">Productos</p>
            <p className="text-stone-300 text-sm">{pedido.lista_productos.join(', ')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Card compacta de pedido ───────────────────────────────────────────────────
function PedidoCard({ pedido, column, onAction, onDelete, onVer, disabled }) {
  return (
    <div className="bg-stone-950 rounded-lg border border-stone-800 p-3 text-xs group">
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-bold text-stone-200">#{pedido.id} · Mesa {pedido.mesa}</span>
        <span className="text-stone-500">{fmtHora(pedido.hora_recepcion)}</span>
      </div>
      <p className="text-amber-400 font-semibold mb-2">${pedido.monto}</p>
      <div className="flex gap-1.5">
        <button
          onClick={() => onAction(pedido, column.next)}
          disabled={disabled}
          className="flex-1 flex items-center justify-center gap-1 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded px-2 py-1 transition-colors disabled:opacity-50"
        >
          {column.next === 'entregado'
            ? <><FontAwesomeIcon icon={faCheck} size="xs" /> {column.nextLabel}</>
            : <><FontAwesomeIcon icon={faArrowRight} size="xs" /> {column.nextLabel}</>
          }
        </button>
        <button
          onClick={() => onVer(pedido)}
          className="bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 rounded px-2 py-1 transition-colors"
          title="Ver detalle"
        >
          <FontAwesomeIcon icon={faEye} size="xs" />
        </button>
        <button
          onClick={() => onDelete(pedido)}
          disabled={disabled}
          className="bg-stone-800 hover:bg-red-900/60 text-stone-500 hover:text-red-400 rounded px-2 py-1 transition-colors disabled:opacity-50"
          title="Eliminar"
        >
          <FontAwesomeIcon icon={faTrash} size="xs" />
        </button>
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
const Pedidos = ({ setMensaje }) => {
  const { data: pedidos, isLoading, error } = usePedidos();
  const updatePedido = useUpdatePedido();
  const deletePedido = useDeletePedido();
  const [detalle, setDetalle] = useState(null);

  const onAction = async (pedido, nuevoEstado) => {
    try {
      const extra = {};
      if (nuevoEstado === 'listo')     extra.hora_listo      = new Date().toLocaleTimeString([], { hour12: false });
      if (nuevoEstado === 'entregado') extra.hora_entregado  = new Date().toLocaleTimeString([], { hour12: false });
      await updatePedido.mutateAsync({ ...pedido, estado: nuevoEstado, ...extra });
      setMensaje(`Pedido #${pedido.id} → ${nuevoEstado}`);
    } catch { setMensaje('Error al actualizar el pedido'); }
  };

  const onDelete = async (pedido) => {
    if (!window.confirm(`¿Eliminar Pedido #${pedido.id}?`)) return;
    try {
      await deletePedido.mutateAsync(pedido.id);
      setMensaje('Pedido eliminado');
    } catch { setMensaje('Error al eliminar'); }
  };

  if (isLoading) return <p className="state-loading">Cargando pedidos...</p>;
  if (error)    return <p className="state-error">Error al cargar pedidos</p>;

  const busy = updatePedido.isPending || deletePedido.isPending;

  return (
    <div className="page">
      <h2 className="text-xl font-bold text-stone-100 mb-4">Pedidos</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map(col => {
          const items = pedidos?.filter(p => p.estado === col.key) || [];
          return (
            <div key={col.key} className={`bg-stone-900 rounded-xl border border-stone-800 border-t-2 ${col.color} flex flex-col`}>
              {/* Column header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-stone-800">
                <span className="text-sm font-semibold text-stone-200">{col.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${col.badge}`}>
                  {items.length}
                </span>
              </div>

              {/* Cards */}
              <div className="p-3 space-y-2 flex-1 overflow-y-auto max-h-[65vh]">
                {!items.length && <p className="text-stone-600 text-xs text-center py-6">Sin pedidos</p>}
                {items.map(p => (
                  <PedidoCard
                    key={p.id}
                    pedido={p}
                    column={col}
                    onAction={onAction}
                    onDelete={onDelete}
                    onVer={setDetalle}
                    disabled={busy}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <DetalleModal pedido={detalle} onClose={() => setDetalle(null)} />
    </div>
  );
};

export default Pedidos;
