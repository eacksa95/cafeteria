import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faCoffee, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useProductos } from '../../api/queries';

export const ListaProductos = ({
  allProducts,
  setAllProducts,
  countProducts,
  setCountProducts,
  total,
  setTotal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: productos, isLoading, error } = useProductos();

  const onAddProduct = producto => {
    if (allProducts.find(item => item.id === producto.id)) {
      const products = allProducts.map(item =>
        item.id === producto.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      );
      setTotal(total + producto.precio * producto.cantidad);
      setCountProducts(countProducts + producto.cantidad);
      return setAllProducts([...products]);
    }
    setTotal(total + producto.precio * producto.cantidad);
    setCountProducts(countProducts + producto.cantidad);
    setAllProducts([...allProducts, producto]);
  };

  const filteredProducts = productos?.filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (error) {
    return (
      <div className="productos-error">
        <FontAwesomeIcon icon={faCoffee} />
        <p>Error al cargar los productos. Por favor, intente nuevamente.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="productos-loading">
        <FontAwesomeIcon icon={faCoffee} spin />
        <p>Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="productos-section">
      <div className="productos-header">
        <h2 className="productos-title">Nuestros Productos</h2>
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

      <div className="productos-grid">
        {filteredProducts.map((producto) => (
          <div className="producto-card" key={producto.id}>
            <div className="producto-image-container">
              <img 
                src={producto.img} 
                alt={producto.nombre} 
                className="producto-image"
                onError={(e) => {
                  e.target.src = 'https://png.pngtree.com/template/20190323/ourmid/pngtree-coffee-logo-design-image_82183.jpg';
                }}
              />
              <div className="producto-overlay">
                <button 
                  className="btn-add"
                  onClick={() => onAddProduct(producto)}
                >
                  <FontAwesomeIcon icon={faShoppingCart} className="btn-icon" />
                  <span>Agregar al carrito</span>
                </button>
              </div>
            </div>
            <div className="producto-info">
              <h3 className="producto-title">{producto.nombre}</h3>
              <p className="producto-price">${producto.precio}</p>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="no-products">
          <FontAwesomeIcon icon={faCoffee} />
          <p>No se encontraron productos</p>
        </div>
      )}
    </div>
  );
};