import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faCoffee, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { useCreateProducto } from '../../api/queries';

const ProductosNuevo = ({ setMensaje }) => {
  const navigate = useNavigate();
  const createMutation = useCreateProducto();
  
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    cantidad: 1,
    img: 'https://png.pngtree.com/template/20190323/ourmid/pngtree-coffee-logo-design-image_82183.jpg'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      setMensaje("Por favor ingrese el nombre del producto");
      return;
    }
    if (!formData.precio || formData.precio <= 0) {
      setMensaje("Por favor ingrese un precio válido");
      return;
    }

    try {
      await createMutation.mutateAsync(formData);
      setMensaje("Producto registrado exitosamente");
      navigate('/productosindex');
    } catch (error) {
      console.error("Error:", error);
      setMensaje("Error al registrar el producto");
    }
  };

  return (
    <div className="producto-nuevo-container">
      <div className="producto-nuevp-form-header">
        <h3>Nuevo Producto</h3>
        <p>Complete los datos del nuevo producto</p>
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
          disabled={createMutation.isLoading}
        >
          {createMutation.isLoading ? 'Registrando...' : 'Registrar Producto'}
        </button>
      </form>
    </div>
  );
};

export default ProductosNuevo;