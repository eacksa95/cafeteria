import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faCoffee, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { useProducto, useUpdateProducto } from '../../api/queries';

const ProductosModificar = ({ setMensaje }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: producto, isLoading, error, refetch } = useProducto(id);
  const updateMutation = useUpdateProducto();
  console.log("actualizar datos")
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    cantidad: 1,
    img: 'https://png.pngtree.com/template/20190323/ourmid/pngtree-coffee-logo-design-image_82183.jpg'
  });

  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre || '',
        precio: producto.precio || '',
        cantidad: producto.cantidad || 1,
        img: producto.img || 'https://png.pngtree.com/template/20190323/ourmid/pngtree-coffee-logo-design-image_82183.jpg'
      });
    }
  }, [producto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await updateMutation.mutateAsync({
        id,
        ...formData
      });
      
      setMensaje("Producto actualizado exitosamente");
      navigate('/productosindex');
    } catch (error) {
      setMensaje('Error al actualizar el producto');
      console.error('Error updating product:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <FontAwesomeIcon icon={faCoffee} spin />
        <p>Cargando producto...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error al cargar el producto: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="producto-nuevo-container">
      <div className="producto-nuevo-form-header">
        <h3>Modificar Producto</h3>
        <p>Actualizar datos del producto</p>
      </div>

      <form onSubmit={handleSubmit} className="producto-nuevo-form">
        <div className="form-group">
          <div className="input-icon">
            <FontAwesomeIcon icon={faCoffee} className="icon" />
            <input
              className="form-input"
              name="nombre"
              placeholder="Nombre del Producto"
              type="text"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <div className="input-icon">
            <FontAwesomeIcon icon={faDollarSign} className="icon" />
            <input
              className="form-input"
              name="precio"
              placeholder="Precio"
              type="number"
              step="0.01"
              min="0"
              value={formData.precio}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <div className="input-icon">
            <FontAwesomeIcon icon={faImage} className="icon" />
            <input
              className="form-input"
              name="img"
              placeholder="URL de la imagen"
              type="text"
              value={formData.img}
              onChange={handleChange}
            />
          </div>
        </div>

        {formData.img && (
          <div className="image-preview">
            <img 
              src={formData.img} 
              alt="Vista previa"
              onError={(e) => {
                e.target.src = 'https://png.pngtree.com/template/20190323/ourmid/pngtree-coffee-logo-design-image_82183.jpg';
              }}
            />
          </div>
        )}

        <button 
          type="submit" 
          className="btn-submit"
          disabled={updateMutation.isLoading}
        >
          {updateMutation.isLoading ? 'Actualizando...' : 'Guardar Cambios'}
        </button>
      </form>
    </div>
  );
};

export default ProductosModificar;