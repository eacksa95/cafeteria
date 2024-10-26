import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import '../../estilos/carrito.css';

export const Carrito = ({
  pedidoNuevo,
  allProducts,
  setAllProducts,
  total,
  countProducts,
  setCountProducts,
  setTotal,
}) => {
  const [active, setActive] = useState(false);
  const [cliente, setCliente] = useState('');
  const [mesa, setMesa] = useState('');
  const [pedidos, setPedidos] = useState([]);
  const [id, setId] = useState();
  const [actualizar, setActualizar] = useState(false);
  const [productosIds, setProductosIds] = useState([]);
  const [productosCantidad, setProductosCantidad] = useState([]);

  useEffect(() => {
    fetchPedidos();
  }, [actualizar]);

  useEffect(() => {
    obtenerIdMasAlto();
  }, [pedidos]);

  useEffect(() => {
    const productIds = allProducts.map((producto) => producto.id);
    setProductosIds(productIds);
  }, [allProducts]);

  useEffect(() => {
    const cantidades = allProducts.map((producto) => producto.cantidad);
    setProductosCantidad(cantidades);
  }, [allProducts]);

  const fetchPedidos = async () => {
    try {
      const response = await fetch('http://localhost:8000/pedidos/', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${JSON.parse(window.localStorage.getItem('accessToken'))}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setPedidos(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const obtenerIdMasAlto = () => {
    const idMasAlto = pedidos.reduce((maxId, pedido) => {
      return pedido.id > maxId ? pedido.id : maxId;
    }, 0);
    setId(idMasAlto + 1);
  };

  const onDeleteProduct = (producto) => {
    const results = allProducts.filter(item => item.id !== producto.id);
    setTotal(total - producto.precio * producto.cantidad);
    setCountProducts(countProducts - producto.cantidad);
    setAllProducts(results);
  };

  const onCleanCart = () => {
    setAllProducts([]);
    setTotal(0);
    setCountProducts(0);
    setActive(false);
  };

  const onEnviarPedido = async () => {
    if (!cliente.trim()) {
      alert('Por favor ingrese el nombre del cliente');
      return;
    }
    if (!mesa) {
      alert('Por favor ingrese el número de mesa');
      return;
    }
    if (allProducts.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/pedidos/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${JSON.parse(window.localStorage.getItem('accessToken'))}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          cliente,
          mesa,
          lista_productos: productosIds,
          lista_cantidad: productosCantidad,
          monto: total,
          estado: "pendiente",
          fecha_recepcion: new Date().toISOString().split('T')[0],
          hora_recepcion: new Date().toLocaleTimeString([], { hour12: false }),
          hora_listo: null,
          hora_entregado: null
        }),
      });

      if (response.ok) {
        pedidoNuevo();
        setActive(false);
        setActualizar(!actualizar);
        onCleanCart();
        setCliente('');
        setMesa('');
      }
    } catch (error) {
      console.error('Error al enviar pedido:', error);
    }
  };

  return (
    <div className="carrito-container">
      <div className="carrito-header">
        <h2 className="carrito-title">Tu Pedido</h2>
        <div className="cart-icon-container" onClick={() => setActive(!active)}>
          <FontAwesomeIcon icon={faShoppingCart} className="cart-icon" />
          {countProducts > 0 && (
            <span className="cart-count">{countProducts}</span>
          )}
        </div>
      </div>

      <div className="cliente-form">
        <div className="form-group">
          <input
            className="form-input"
            placeholder="Nombre del Cliente"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            className="form-input"
            placeholder="Número de Mesa"
            type="number"
            value={mesa}
            onChange={(e) => setMesa(e.target.value)}
          />
        </div>
      </div>

      <div className={`modal-overlay ${active ? 'show' : ''}`} onClick={() => setActive(false)}>
        <div className="modal-container cart-modal" onClick={e => e.stopPropagation()}>
          <button className="modal-close" onClick={() => setActive(false)}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
          
          <div className="modal-content">
            <h3 className="cart-modal-title">Carrito de Compras</h3>
            
            {allProducts.length ? (
              <>
                <div className="cart-items">
                  {allProducts.map(producto => (
                    <div className="cart-item" key={producto.id}>
                      <div className="item-info">
                        <h4 className="item-title">{producto.nombre}</h4>
                        <div className="item-details">
                          <span className="item-quantity">x{producto.cantidad}</span>
                          <span className="item-price">${producto.precio}</span>
                        </div>
                      </div>
                      <button 
                        className="btn-remove"
                        onClick={() => onDeleteProduct(producto)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-footer">
                  <div className="cart-total">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <button className="btn-checkout" onClick={onEnviarPedido}>
                    Enviar Pedido
                  </button>
                  <button className="btn-remove" onClick={onCleanCart}>
                    Vaciar Carrito
                  </button>
                </div>
              </>
            ) : (
              <p className="cart-empty">El carrito está vacío</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};