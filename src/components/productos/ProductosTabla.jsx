import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPaintBrush, faCoffee, faSearch, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useProductos } from '../../api/queries';

const ProductosTabla = ({ setMensaje }) => {
  const [actualizar, setActualizar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { data: productos, isLoading, error } = useProductos();
  const navigate = useNavigate();

  const onModificarProducto = (producto) => {
    navigate(`/productosmodificar/${producto.id}`);
  };

  const onDeleteProducto = async (producto) => {
    if (!window.confirm('¿Está seguro que desea eliminar este producto?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/productos/${producto.id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${JSON.parse(window.localStorage.getItem('accessToken'))}`
        },
      });

      if (response.ok) {
        setMensaje("Producto eliminado exitosamente");
        setActualizar(!actualizar);
      } else {
        throw new Error('Error al eliminar el producto');
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setMensaje("Error al eliminar el producto");
    }
  };

  const filteredProducts = productos?.filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="productos-table-container">
        <div className="table-header">
          <h4>Lista de Productos</h4>
        </div>
        <div className="loading-container">
          <FontAwesomeIcon icon={faCoffee} spin />
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="productos-table-container">
        <div className="table-header">
          <h4>Lista de Productos</h4>
        </div>
        <div className="error-container">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          <p>Error al cargar los productos. Por favor, intente nuevamente.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="productos-table-container">
      <div className="table-header">
        <h4>Lista de Productos</h4>
        <div className="search-container">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      
      <div className="table-wrapper">
        <table className="productos-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Producto</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.id}</td>
                <td>{producto.nombre}</td>
                <td className="precio-column">
                  ${Number(producto.precio).toFixed(2)}
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-edit"
                      onClick={() => onModificarProducto(producto)}
                      title="Editar producto"
                    >
                      <FontAwesomeIcon icon={faPaintBrush} />
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => onDeleteProducto(producto)}
                      title="Eliminar producto"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className="no-products">
            <FontAwesomeIcon icon={faCoffee} />
            <p>No se encontraron productos</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductosTabla;