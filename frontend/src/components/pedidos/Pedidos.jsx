import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { usePedidos, useUpdatePedido, useDeletePedido, useProductos } from '../../api/queries';

// ── Helpers ───────────────────────────────────────────────────────────────────
function toList(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') { try { return JSON.parse(val); } catch {} }
  return [];
}

function fmtHora(str) {
  if (!str) return '—';
  try {
    const [h, m] = str.split(':');
    const d = new Date(); d.setHours(h, m);
    return d.toLocaleString('es', { hour: '2-digit', minute: '2-digit' });
  } catch { return str; }
}

function getElapsedMin(horaStr) {
  if (!horaStr) return 0;
  try {
    const [h, m, s] = horaStr.split(':').map(Number);
    const now  = new Date();
    const then = new Date();
    then.setHours(h, m, s || 0, 0);
    const diff = Math.floor((now - then) / 60000);
    return diff < 0 ? diff + 1440 : diff; // manejo de medianoche
  } catch { return 0; }
}

const CAT_EMOJI = { 1: '☕', 2: '🥤', 3: '🥐', 4: '🍟', 5: '🍽️', 6: '🍰' };

function getProdDisplay(listaProductos, productos) {
  const ids = toList(listaProductos);
  if (!ids.length) return '';
  if (!productos?.length) return `${ids.length}p`;
  const emojis = ids.slice(0, 5).map(id => {
    const p = productos.find(p => Number(p.id) === Number(id));
    return CAT_EMOJI[p?.categoria_id] || '·';
  });
  const extra = ids.length > 5 ? `+${ids.length - 5}` : '';
  return emojis.join('') + extra;
}

// ── Colores por estado + tiempo ───────────────────────────────────────────────
function getCardStyle(estado, mins) {
  if (estado === 'listo')
    return { wrap: 'bg-emerald-50 border-emerald-300', timer: 'text-emerald-700', action: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800' };
  if (estado === 'en_proceso')
    return { wrap: 'bg-orange-50 border-orange-300',  timer: 'text-orange-700',  action: 'bg-orange-100 hover:bg-orange-200 text-orange-800' };
  if (mins > 15)
    return { wrap: 'bg-red-50 border-red-400',        timer: 'text-red-700 font-black animate-pulse', action: 'bg-red-100 hover:bg-red-200 text-red-800' };
  if (mins > 8)
    return { wrap: 'bg-amber-50 border-amber-300',    timer: 'text-amber-700',   action: 'bg-amber-100 hover:bg-amber-200 text-amber-800' };
  return   { wrap: 'bg-green-50 border-green-200',    timer: 'text-green-700',   action: 'bg-green-100 hover:bg-green-200 text-green-800' };
}

const NEXT = {
  pendiente:  { state: 'en_proceso', label: 'Iniciar',   timeKey: null },
  en_proceso: { state: 'listo',      label: '✓ Listo',   timeKey: 'hora_listo' },
  listo:      { state: 'entregado',  label: '↗ Entregar', timeKey: 'hora_entregado' },
};

// ── Modal detalle (también tiene botón eliminar) ──────────────────────────────
function DetalleModal({ pedido, productos, onClose, onDelete }) {
  if (!pedido) return null;
  const ids   = toList(pedido.lista_productos);
  const cants = toList(pedido.lista_cantidad);
  const nombres = ids.map(id => {
    const p = productos?.find(p => Number(p.id) === Number(id));
    return p ? p.nombre : `#${id}`;
  });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative bg-white rounded-2xl border border-amber-100 shadow-2xl p-5 max-w-xs w-full" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-amber-800">Pedido #{pedido.id} · Mesa {pedido.mesa}</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <dl className="grid grid-cols-2 gap-y-1.5 text-sm mb-3">
          {[['Estado', pedido.estado], ['Total', `$${pedido.monto}`], ['Recibido', fmtHora(pedido.hora_recepcion)], ['Listo', fmtHora(pedido.hora_listo)]].map(([k, v]) => (
            <div key={k}><dt className="text-stone-400 text-xs">{k}</dt><dd className="text-stone-800 font-medium text-xs">{v}</dd></div>
          ))}
        </dl>
        {nombres.length > 0 && (
          <div className="border-t border-amber-100 pt-2 mb-3">
            <p className="text-stone-400 text-[10px] uppercase tracking-wide mb-1">Productos</p>
            <ul className="space-y-0.5">
              {nombres.map((n, i) => (
                <li key={i} className="text-stone-700 text-xs flex items-center gap-1.5">
                  <span className="text-amber-500">·</span> {n}
                  {cants[i] != null && <span className="text-stone-400">×{cants[i]}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
        <button onClick={() => { onClose(); onDelete(pedido); }}
          className="w-full flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg py-1.5 text-xs font-medium transition-colors">
          <FontAwesomeIcon icon={faTrash} size="xs" /> Eliminar pedido
        </button>
      </div>
    </div>
  );
}

// ── Mini card ─────────────────────────────────────────────────────────────────
function MiniCard({ pedido, onAdvance, onVer, productos, busy }) {
  const mins  = getElapsedMin(pedido.hora_recepcion);
  const style = getCardStyle(pedido.estado, mins);
  const next  = NEXT[pedido.estado];
  const prods = getProdDisplay(pedido.lista_productos, productos);

  return (
    <div className={`rounded-lg border-2 ${style.wrap} p-1.5 flex flex-col gap-1 min-w-0`}>
      {/* Mesa + timer */}
      <div className="flex items-center justify-between leading-none">
        <span className="text-[11px] font-black text-stone-800 truncate">M{pedido.mesa}</span>
        <span className={`text-[9px] font-bold tabular-nums ${style.timer}`}>{mins}m</span>
      </div>

      {/* Productos (emojis o conteo) */}
      <p className="text-[11px] leading-none text-stone-600 truncate" title={`Pedido #${pedido.id}`}>
        {prods || <span className="text-stone-400">#{pedido.id}</span>}
      </p>

      {/* Botones de acción */}
      {next && (
        <div className="flex gap-0.5 mt-auto">
          <button
            onClick={() => onAdvance(pedido, next)}
            disabled={busy}
            className={`flex-1 text-[9px] font-semibold py-0.5 rounded ${style.action} transition-colors disabled:opacity-40 truncate px-0.5`}
          >
            {next.label}
          </button>
          <button
            onClick={() => onVer(pedido)}
            className="bg-white/70 hover:bg-white text-stone-500 rounded px-1 py-0.5 transition-colors"
            title="Ver detalle"
          >
            <FontAwesomeIcon icon={faEye} style={{ fontSize: '9px' }} />
          </button>
        </div>
      )}
    </div>
  );
}

// ── Status chip ───────────────────────────────────────────────────────────────
function StatusChip({ label, count, color }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${color}`}>
      <span className="font-black text-sm leading-none">{count}</span>
      {label}
    </span>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
const Pedidos = ({ setMensaje }) => {
  const { data: pedidos, isLoading, error } = usePedidos();
  const { data: productos } = useProductos();
  const updatePedido = useUpdatePedido();
  const deletePedido = useDeletePedido();
  const [detalle, setDetalle] = useState(null);

  const onAdvance = async (pedido, next) => {
    try {
      const update = { id: pedido.id, estado: next.state };
      if (next.timeKey) update[next.timeKey] = new Date().toLocaleTimeString([], { hour12: false });
      await updatePedido.mutateAsync(update);
      setMensaje(`Mesa ${pedido.mesa} → ${next.label}`);
    } catch { setMensaje('Error al actualizar'); }
  };

  const onDelete = async (pedido) => {
    if (!window.confirm(`¿Eliminar Pedido #${pedido.id}?`)) return;
    try { await deletePedido.mutateAsync(pedido.id); setMensaje('Pedido eliminado'); }
    catch { setMensaje('Error al eliminar'); }
  };

  if (isLoading) return <p className="state-loading">Cargando pedidos...</p>;
  if (error)    return <p className="state-error">Error al cargar pedidos</p>;

  const busy   = updatePedido.isPending || deletePedido.isPending;
  const activos = (pedidos || []).filter(p => !['entregado', 'rechazado'].includes(p.estado));

  // Ordenar: pendientes con más tiempo primero (urgentes), luego en_proceso, luego listos
  const sorted = [...activos].sort((a, b) => {
    const order = { pendiente: 0, en_proceso: 1, listo: 2 };
    if (order[a.estado] !== order[b.estado]) return order[a.estado] - order[b.estado];
    return getElapsedMin(b.hora_recepcion) - getElapsedMin(a.hora_recepcion);
  });

  const counts = {
    pendiente:  activos.filter(p => p.estado === 'pendiente').length,
    en_proceso: activos.filter(p => p.estado === 'en_proceso').length,
    listo:      activos.filter(p => p.estado === 'listo').length,
  };

  return (
    <div className="px-2 pt-2 pb-1 sm:px-3 sm:pt-3">

      {/* Barra de estado + leyenda */}
      <div className="flex items-center gap-1.5 flex-wrap mb-2">
        <StatusChip label="Pendiente"  count={counts.pendiente}  color="bg-amber-100 text-amber-800 border-amber-200" />
        <StatusChip label="En proceso" count={counts.en_proceso} color="bg-orange-100 text-orange-800 border-orange-200" />
        <StatusChip label="Listos"     count={counts.listo}      color="bg-emerald-100 text-emerald-800 border-emerald-200" />
        <div className="flex-1" />
        {/* Leyenda de tiempo */}
        <div className="hidden xs:flex items-center gap-2 text-[9px] text-stone-400">
          <span className="flex items-center gap-0.5"><span className="w-2 h-2 rounded-sm bg-green-100 border border-green-300 inline-block" /> &lt;8m</span>
          <span className="flex items-center gap-0.5"><span className="w-2 h-2 rounded-sm bg-amber-100 border border-amber-300 inline-block" /> 8-15m</span>
          <span className="flex items-center gap-0.5"><span className="w-2 h-2 rounded-sm bg-red-100 border border-red-400 inline-block" /> &gt;15m</span>
        </div>
      </div>

      {/* Grid de mini-cards */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-1.5">
        {sorted.map(p => (
          <MiniCard
            key={p.id}
            pedido={p}
            onAdvance={onAdvance}
            onVer={setDetalle}
            productos={productos}
            busy={busy}
          />
        ))}
        {!sorted.length && (
          <p className="col-span-full text-center text-stone-400 text-sm py-16">
            Sin pedidos activos
          </p>
        )}
      </div>

      <DetalleModal pedido={detalle} productos={productos} onClose={() => setDetalle(null)} onDelete={onDelete} />
    </div>
  );
};

export default Pedidos;
