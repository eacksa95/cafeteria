import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCheck, faCoffee, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { usePedidos, useUpdatePedido, useDeletePedido } from '../../api/queries';

const PedidosListos = ({ setMensaje }) => {
  const { data: pedidos, isLoading, error } = usePedidos();
  const updatePedido = useUpdatePedido();
  const deletePedido = useDeletePedido();

  const entregarPedido = async (pedido) => {
    const currentDate = new Date();
    const hora_entregado = currentDate.toLocaleTimeString([], { hour12: false });
    
    try {
      await updatePedido.mutateAsync({
        ...pedido,
        estado: "entregado",
        hora_entregado
      });
      
      setMensaje("Pedido entregado correctamente");
    } catch (error) {
      console.error('Error al entregar el pedido:', error);
      setMensaje("Error al entregar el pedido");
    }
  };

  const eliminarPedido = async (pedido) => {
    if (!window.confirm('¿Está seguro que desea eliminar este pedido?')) {
      return;
    }

    try {
      await deletePedido.mutateAsync(pedido.id);
      setMensaje("Pedido eliminado correctamente");
    } catch (error) {
      console.error('Error al eliminar el pedido:', error);
      setMensaje("Error al eliminar el pedido");
    }
  };

  if (isLoading) {
    return (
      <div className="pedidos-tabla">
        <div className="pedidos-table-header">
          <h4>Pedidos Listos</h4>
        </div>
        <div className="loading-container">
          <FontAwesomeIcon icon={faCoffee} spin />
          <p>Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pedidos-tabla">
        <div className="pedidos-table-header">
          <h4>Pedidos Listos</h4>
        </div>
        <div className="error-container">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          <p>Error al cargar los pedidos. Por favor, intente nuevamente.</p>
        </div>
      </div>
    );
  }

  const pedidosListos = pedidos?.filter(pedido => pedido.estado === "listo") || [];

  return (
    <div className="pedidos-tabla">
      <div className="pedidos-table-header">
        <h4>Pedidos Listos</h4>
      </div>

      <div className="table-content">
        {pedidosListos.map((pedido) => {
          const [hora, minutos] = pedido.hora_listo.split(':');
          const fechaActual = new Date();
          fechaActual.setHours(hora);
          fechaActual.setMinutes(minutos);

          const horaAMPM = fechaActual.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
          });

          return (
            <div className="card_pedido" key={pedido.id}>
              <div className="pedido-info">
                <h3>Pedido #{pedido.id}</h3>
                <p>
                  <span>Cliente:</span>
                  <span>{pedido.cliente}</span>
                </p>
                <p>
                  <span>Mesa:</span>
                  <span>{pedido.mesa}</span>
                </p>
                <p>
                  <span>Listo desde:</span>
                  <span>{horaAMPM}</span>
                </p>
                <p>
                  <span>Total:</span>
                  <span>${pedido.monto}</span>
                </p>
              </div>
              
              <div className="pedido-actions">
                <button 
                  className="btn-action btn-procesar"
                  onClick={() => entregarPedido(pedido)}
                  disabled={updatePedido.isLoading || deletePedido.isLoading}
                >
                  <FontAwesomeIcon icon={faCheck} />
                  <span>Entregar</span>
                </button>
                <button 
                  className="btn-action btn-eliminar"
                  onClick={() => eliminarPedido(pedido)}
                  disabled={updatePedido.isLoading || deletePedido.isLoading}
                >
                  <FontAwesomeIcon icon={faTrash} />
                  <span>Eliminar</span>
                </button>
              </div>
            </div>
          );
        })}

        {pedidosListos.length === 0 && (
          <div className="no-pedidos">
            <p>No hay pedidos listos</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PedidosListos;