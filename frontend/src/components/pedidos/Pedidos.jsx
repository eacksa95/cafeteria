import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { usePedidos, useUpdatePedido, useDeletePedido, useProductos } from '../../api/queries';
import { fmtPrecio } from '../../utils/format';

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
    const now = new Date(), then = new Date();
    then.setHours(h, m, s || 0, 0);
    const diff = Math.floor((now - then) / 60000);
    return diff < 0 ? diff + 1440 : diff;
  } catch { return 0; }
}

function buildProductLines(pedido, productos) {
  const ids   = toList(pedido.lista_productos);
  const cants = toList(pedido.lista_cantidad);
  return ids.map((id, i) => {
    const p = productos?.find(p => Number(p.id) === Number(id));
    return { nombre: p ? p.nombre : `#${id}`, cant: cants[i] };
  });
}

// ── Siguiente acción por estado ───────────────────────────────────────────────
const NEXT = {
  pendiente:  { state: 'en_proceso', label: 'Iniciar',    timeKey: null,             userKey: 'procesado_por_id', confirm: true },
  en_proceso: { state: 'listo',      label: '✓ Listo',    timeKey: 'hora_listo',     userKey: null,               confirm: false },
  listo:      { state: 'entregado',  label: '↗ Entregar', timeKey: 'hora_entregado', userKey: 'entregado_por_id', confirm: false },
};

// ── Colores del header de card ────────────────────────────────────────────────
function getHeaderStyle(estado, mins) {
  if (estado === 'entregado') return 'bg-stone-200 text-stone-600';
  if (estado === 'listo')     return 'bg-emerald-500 text-white';
  if (estado === 'en_proceso') return 'bg-orange-400 text-white';
  if (mins > 10) return 'bg-red-500 text-white';
  if (mins > 5)  return 'bg-amber-400 text-amber-900';
  return 'bg-green-100 text-green-800';
}

// ── Modal de detalle / eliminación ───────────────────────────────────────────
function DetalleModal({ pedido, productos, onClose, onDelete }) {
  if (!pedido) return null;
  const lines = buildProductLines(pedido, productos);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative bg-white rounded-2xl border border-amber-100 shadow-2xl p-5 max-w-xs w-full" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-amber-800">#{pedido.id} · Mesa {pedido.mesa}</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <dl className="grid grid-cols-2 gap-y-1.5 mb-3">
          {[['Estado', pedido.estado], ['Recibido', fmtHora(pedido.hora_recepcion)], ['Listo', fmtHora(pedido.hora_listo)], ['Entregado', fmtHora(pedido.hora_entregado)]].map(([k, v]) => (
            <div key={k}><dt className="text-stone-400 text-xs">{k}</dt><dd className="text-stone-800 font-medium text-xs">{v}</dd></div>
          ))}
        </dl>
        {lines.length > 0 && (
          <div className="border-t border-amber-100 pt-2 mb-3">
            <p className="text-stone-400 text-[10px] uppercase tracking-wide mb-1">Productos</p>
            <ul className="space-y-0.5">
              {lines.map(({ nombre, cant }, i) => (
                <li key={i} className="text-stone-700 text-xs flex gap-1.5">
                  <span className="text-amber-400">·</span> {nombre}
                  {cant != null && <span className="text-stone-400">×{cant}</span>}
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

// ── Dialog de confirmación para Iniciar ──────────────────────────────────────
function IniciarDialog({ pedido, productos, onClose, onConfirm, busy }) {
  if (!pedido) return null;
  const lines = buildProductLines(pedido, productos);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative bg-white rounded-2xl border border-orange-100 shadow-2xl p-5 max-w-xs w-full" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-orange-800">Iniciar · #{pedido.id} · Mesa {pedido.mesa}</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600"><FontAwesomeIcon icon={faTimes} /></button>
        </div>
        {lines.length > 0 && (
          <div className="mb-4">
            <p className="text-stone-400 text-[10px] uppercase tracking-wide mb-1.5">Productos</p>
            <ul className="space-y-1">
              {lines.map(({ nombre, cant }, i) => (
                <li key={i} className="text-stone-700 text-sm flex gap-1.5">
                  <span className="text-orange-400">·</span> {nombre}
                  {cant != null && <span className="text-stone-400">×{cant}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 border border-stone-200 text-stone-500 hover:bg-stone-50 rounded-lg py-2 text-sm font-medium">Cancelar</button>
          <button onClick={onConfirm} disabled={busy}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-2 text-sm font-bold disabled:opacity-40">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Card de pedido (tamaño completo con lista de productos) ──────────────────
function PedidoCard({ pedido, onAdvance, onIniciar, onVer, productos, busy }) {
  const mins    = getElapsedMin(pedido.hora_recepcion);
  const lines   = buildProductLines(pedido, productos);
  const next    = NEXT[pedido.estado];
  const hdrCls  = getHeaderStyle(pedido.estado, mins);
  const isAlarm = ['pendiente', 'en_proceso'].includes(pedido.estado) && mins > 10;

  const actionCls = {
    pendiente:  'bg-orange-100 hover:bg-orange-200 text-orange-800',
    en_proceso: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800',
    listo:      'bg-blue-100 hover:bg-blue-200 text-blue-800',
  }[pedido.estado] || '';

  const handleAction = () => {
    if (next?.confirm) onIniciar(pedido);
    else onAdvance(pedido, next);
  };

  return (
    <div className="rounded-xl border border-stone-200 shadow-sm overflow-hidden bg-white flex flex-col">
      {/* Header — color = estado + tiempo */}
      <div className={`flex items-center justify-between px-2.5 py-1.5 ${hdrCls} flex-shrink-0`}>
        <span className="text-xs font-black truncate">#{pedido.id} M{pedido.mesa}</span>
        <span className="text-[10px] font-bold tabular-nums flex-shrink-0 ml-1">
          {mins}m{isAlarm ? ' ⚠' : ''}
        </span>
      </div>

      {/* Productos */}
      <div className="flex-1 px-2.5 pt-1.5 pb-1 min-h-[3rem]">
        {lines.length > 0 ? (
          <ul className="space-y-0.5">
            {lines.map(({ nombre, cant }, i) => (
              <li key={i} className="flex items-start gap-1 text-[10px] leading-tight">
                <span className="text-stone-300 mt-px flex-shrink-0">·</span>
                <span className="flex-1 text-stone-700 truncate">{nombre}</span>
                {cant > 1 && <span className="text-stone-400 flex-shrink-0">×{cant}</span>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[10px] text-stone-400 italic">Cargando...</p>
        )}
      </div>

      {/* Footer: acciones + hora */}
      <div className="px-2 pb-1.5 pt-1 flex-shrink-0">
        {next ? (
          <div className="flex gap-1 mb-0.5">
            <button onClick={handleAction} disabled={busy}
              className={`flex-1 text-[10px] font-semibold py-1 rounded-lg ${actionCls} transition-colors disabled:opacity-40`}>
              {next.label}
            </button>
            <button onClick={() => onVer(pedido)}
              className="px-2 py-1 bg-stone-50 hover:bg-stone-100 rounded-lg text-stone-400 transition-colors">
              <FontAwesomeIcon icon={faEye} style={{ fontSize: '9px' }} />
            </button>
          </div>
        ) : (
          <div className="flex justify-end mb-0.5">
            <button onClick={() => onVer(pedido)}
              className="px-2 py-0.5 bg-stone-50 hover:bg-stone-100 rounded-lg text-stone-400 transition-colors">
              <FontAwesomeIcon icon={faEye} style={{ fontSize: '9px' }} />
            </button>
          </div>
        )}
        <p className="text-[9px] text-stone-300 text-right leading-none">
          {fmtHora(pedido.hora_recepcion)}
        </p>
      </div>
    </div>
  );
}

// ── Pill filtro ───────────────────────────────────────────────────────────────
function FilterPill({ label, count, color, active, onClick }) {
  return (
    <button onClick={onClick}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-all
        ${color} ${active ? 'ring-2 ring-offset-1 ring-current shadow-sm scale-105' : 'opacity-60 hover:opacity-90'}`}>
      <span className="font-black text-sm leading-none">{count}</span>
      {label}
    </button>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
const Pedidos = ({ setMensaje, userId }) => {
  const { data: pedidos, isLoading, error } = usePedidos();
  const { data: productos } = useProductos();
  const updatePedido = useUpdatePedido();
  const deletePedido = useDeletePedido();
  const [detalle,   setDetalle]   = useState(null);
  const [iniciando, setIniciando] = useState(null);
  const [filtro,    setFiltro]    = useState('todos');

  const onAdvance = async (pedido, next) => {
    try {
      const update = { id: pedido.id, estado: next.state };
      if (next.timeKey) update[next.timeKey] = new Date().toLocaleTimeString([], { hour12: false });
      if (next.userKey && userId) update[next.userKey] = userId;
      await updatePedido.mutateAsync(update);
      setMensaje(`Mesa ${pedido.mesa} → ${next.label}`);
    } catch { setMensaje('Error al actualizar'); }
  };

  const confirmarIniciar = async () => {
    const pedido = iniciando;
    setIniciando(null);
    try {
      const update = { id: pedido.id, estado: 'en_proceso' };
      if (userId) update.procesado_por_id = userId;
      await updatePedido.mutateAsync(update);
      setMensaje(`Mesa ${pedido.mesa} → En proceso`);
    } catch { setMensaje('Error al actualizar'); }
  };

  const onDelete = async (pedido) => {
    if (!window.confirm(`¿Eliminar Pedido #${pedido.id}?`)) return;
    try { await deletePedido.mutateAsync(pedido.id); setMensaje('Pedido eliminado'); }
    catch { setMensaje('Error al eliminar'); }
  };

  if (isLoading) return <p className="state-loading">Cargando pedidos...</p>;
  if (error)    return <p className="state-error">Error al cargar pedidos</p>;

  const busy       = updatePedido.isPending || deletePedido.isPending;
  const allPedidos = pedidos || [];
  const activos    = allPedidos.filter(p => !['entregado', 'rechazado'].includes(p.estado));
  const entregados = allPedidos.filter(p => p.estado === 'entregado');

  const sorted = [...activos].sort((a, b) => {
    const order = { pendiente: 0, en_proceso: 1, listo: 2 };
    if (order[a.estado] !== order[b.estado]) return order[a.estado] - order[b.estado];
    return getElapsedMin(b.hora_recepcion) - getElapsedMin(a.hora_recepcion);
  });

  const filtrados =
    filtro === 'entregado' ? [...entregados].sort((a, b) => getElapsedMin(a.hora_recepcion) - getElapsedMin(b.hora_recepcion)) :
    filtro === 'todos'     ? sorted :
    sorted.filter(p => p.estado === filtro);

  const counts = {
    todos:      activos.length,
    pendiente:  activos.filter(p => p.estado === 'pendiente').length,
    en_proceso: activos.filter(p => p.estado === 'en_proceso').length,
    listo:      activos.filter(p => p.estado === 'listo').length,
    entregado:  entregados.length,
  };

  const pills = [
    { key: 'todos',      label: 'Todos',      color: 'bg-stone-100 text-stone-700 border-stone-300' },
    { key: 'pendiente',  label: 'Pendiente',  color: 'bg-amber-100 text-amber-800 border-amber-200' },
    { key: 'en_proceso', label: 'En proceso', color: 'bg-orange-100 text-orange-800 border-orange-200' },
    { key: 'listo',      label: 'Listos',     color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    { key: 'entregado',  label: 'Entregados', color: 'bg-stone-200 text-stone-600 border-stone-300' },
  ];

  return (
    <div className="px-2 pt-2 pb-1 sm:px-3 sm:pt-3">

      {/* Pills filtrables */}
      <div className="flex items-center gap-1.5 flex-wrap mb-2">
        {pills.map(p => (
          <FilterPill key={p.key} label={p.label} count={counts[p.key]}
            color={p.color} active={filtro === p.key} onClick={() => setFiltro(p.key)} />
        ))}
        <div className="flex-1" />
        <div className="hidden sm:flex items-center gap-2 text-[9px] text-stone-400">
          <span className="flex items-center gap-0.5"><span className="w-2 h-2 rounded bg-green-100 border border-green-300 inline-block" />&lt;5m</span>
          <span className="flex items-center gap-0.5"><span className="w-2 h-2 rounded bg-amber-300 border border-amber-400 inline-block" />5-10m</span>
          <span className="flex items-center gap-0.5"><span className="w-2 h-2 rounded bg-red-500 inline-block" />&gt;10m ⚠</span>
        </div>
      </div>

      {/* Grid de cards — 2 columnas mobile, más en desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
        {filtrados.map(p => (
          <PedidoCard key={p.id} pedido={p} onAdvance={onAdvance}
            onIniciar={setIniciando} onVer={setDetalle}
            productos={productos} busy={busy} />
        ))}
        {!filtrados.length && (
          <p className="col-span-full text-center text-stone-400 text-sm py-16">
            {filtro === 'todos' ? 'Sin pedidos activos' :
             filtro === 'entregado' ? 'Sin pedidos entregados' :
             `Sin pedidos ${pills.find(p => p.key === filtro)?.label.toLowerCase()}`}
          </p>
        )}
      </div>

      <DetalleModal pedido={detalle} productos={productos} onClose={() => setDetalle(null)} onDelete={onDelete} />
      <IniciarDialog pedido={iniciando} productos={productos} onClose={() => setIniciando(null)} onConfirm={confirmarIniciar} busy={busy} />
    </div>
  );
};

export default Pedidos;
