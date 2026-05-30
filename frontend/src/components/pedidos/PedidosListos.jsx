import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTrash, faClock } from '@fortawesome/free-solid-svg-icons';
import { usePedidos, useUpdatePedido, useDeletePedido } from '../../api/queries';

const PedidosListos = ({ setMensaje }) => {
  const { data: pedidos, isLoading, error } = usePedidos();
  const updatePedido = useUpdatePedido();
  const deletePedido = useDeletePedido();

  const entregar = async (pedido) => {
    try {
      await updatePedido.mutateAsync({ ...pedido, estado: 'entregado', hora_entregado: new Date().toLocaleTimeString([], { hour12: false }) });
      setMensaje('Pedido entregado ✓');
    } catch { setMensaje('Error al entregar'); }
  };

  const eliminar = async (pedido) => {
    if (!window.confirm(`¿Eliminar Pedido #${pedido.id}?`)) return;
    try {
      await deletePedido.mutateAsync(pedido.id);
      setMensaje('Pedido eliminado');
    } catch { setMensaje('Error al eliminar'); }
  };

  if (isLoading) return <p className="state-loading">Cargando pedidos...</p>;
  if (error)    return <p className="state-error">Error al cargar pedidos</p>;

  const listos = pedidos?.filter(p => p.estado === 'listo') || [];

  return (
    <div>
      <h3 className="text-base font-semibold text-stone-300 mb-3">
        Listos para entregar <span className="ml-1 text-emerald-400 font-bold">{listos.length}</span>
      </h3>

      {!listos.length && <p className="state-empty">No hay pedidos listos</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {listos.map(pedido => {
          const hora = new Date();
          try { const [h, m] = (pedido.hora_listo || '').split(':'); hora.setHours(h, m); } catch {}
          return (
            <div key={pedido.id} className="bg-stone-900 rounded-xl border border-emerald-800/40 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-emerald-400">Pedido #{pedido.id}</span>
                <span className="text-xs text-stone-500 flex items-center gap-1">
                  <FontAwesomeIcon icon={faClock} size="xs" />
                  Listo: {hora.toLocaleString('es', { hour: 'numeric', minute: '2-digit' })}
                </span>
              </div>
              <div className="space-y-1 text-sm text-stone-300 mb-4">
                <p><span className="text-stone-500">Cliente:</span> {pedido.cliente}</p>
                <p><span className="text-stone-500">Mesa:</span> {pedido.mesa}</p>
                <p><span className="text-stone-500">Total:</span> <span className="text-amber-400 font-medium">${pedido.monto}</span></p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => entregar(pedido)} className="btn-success flex-1 justify-center" disabled={updatePedido.isPending}>
                  <FontAwesomeIcon icon={faCheck} size="xs" /> Entregar
                </button>
                <button onClick={() => eliminar(pedido)} className="btn-danger" disabled={deletePedido.isPending}>
                  <FontAwesomeIcon icon={faTrash} size="xs" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PedidosListos;
