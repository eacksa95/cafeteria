import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCheck, faCoffee, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { usePedidos } from '../../api/queries';

const PedidosPendientes = ({ setMensaje }) => {
  const { data: pedidos, isLoading, error } = usePedidos();
  const [actualizar, setActualizar] = useState(false);

  if (isLoading) {
    return (
      <div className="contenedorTabla">
        <div className="table-header">
          <h4>Pedidos Pendientes</h4>
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
      <div className="contenedorTabla">
        <div className="table-header">
          <h4>Pedidos Pendientes</h4>
        </div>
        <div className="error-container">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          <p>Error al cargar los pedidos. Por favor, intente nuevamente.</p>
        </div>
      </div>
    );
  }

  const procesarPedido = async (pedido) => {
    const currentDate = new Date();
    const hora_listo = currentDate.toLocaleTimeString([], { hour12: false });
    
    try {
      const response = await fetch(`http://localhost:8000/pedidos/${pedido.id}/`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${JSON.parse(window.localStorage.getItem('accessToken'))}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...pedido,
          estado: "listo",
          hora_listo
        }),
      });
      
      if (response.ok) {
        setMensaje("Pedido marcado como listo");
        setActualizar(!actualizar);
      }
    } catch (error) {
      console.error('Error al procesar el pedido:', error);
      setMensaje("Error al procesar el pedido");
    }
  };

  const eliminarPedido = async (pedido) => {
    if (!window.confirm('¿Está seguro que desea eliminar este pedido?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/pedidos/${pedido.id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${JSON.parse(window.localStorage.getItem('accessToken'))}`,
        }
      });
      
      if (response.ok) {
        setMensaje("Pedido eliminado correctamente");
        setActualizar(!actualizar);
      }
    } catch (error) {
      console.error('Error al eliminar el pedido:', error);
      setMensaje("Error al eliminar el pedido");
    }
  };

  const pedidosPendientes = pedidos?.filter(pedido => pedido.estado === "pendiente") || [];

  return (
    <div className="contenedorTabla">
      <div className="table-header">
        <h4>Pedidos Pendientes</h4>
      </div>

      <div className="table-content">
        {pedidosPendientes.map((pedido) => {
          const [hora, minutos] = pedido.hora_recepcion.split(':');
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
                  <span>Hora:</span>
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
                  onClick={() => procesarPedido(pedido)}
                >
                  <FontAwesomeIcon icon={faCheck} />
                  <span>Procesar</span>
                </button>
                <button 
                  className="btn-action btn-eliminar"
                  onClick={() => eliminarPedido(pedido)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                  <span>Eliminar</span>
                </button>
              </div>
            </div>
          );
        })}

        {pedidosPendientes.length === 0 && (
          <div className="no-pedidos">
            <p>No hay pedidos pendientes</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PedidosPendientes;