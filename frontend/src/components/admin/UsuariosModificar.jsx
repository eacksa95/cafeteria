import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faUserTag } from '@fortawesome/free-solid-svg-icons';
import { useUser, useUpdateUser } from '../../api/queries';

const UsuariosModificar = ({ setMensaje }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: user, isLoading, error } = useUser(id);
  const updateUser = useUpdateUser();

  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    group_name: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        group_name: user.group_name || 'recepcionista'
      });
    }
  }, [user]);

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
      await updateUser.mutateAsync({
        id,
        ...formData
      });
      setMensaje("Usuario actualizado exitosamente");
      navigate('/usuariostabla');
    } catch (error) {
      console.error("Error:", error);
      setMensaje("Error al actualizar el usuario");
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <FontAwesomeIcon icon={faUser} spin />
        <p>Cargando usuario...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error al cargar el usuario: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="usuario-modificar-container">
      <div className="usuario-form-header">
        <h2>Modificar Usuario</h2>
        <p>Actualice los datos del usuario</p>
      </div>

      <form onSubmit={handleSubmit} className="usuario-form">
        <div className="form-group">
          <div className="input-icon">
            <FontAwesomeIcon icon={faUser} className="icon" />
            <input
              className="form-input"
              name="username"
              placeholder="Nombre de usuario"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <div className="input-icon">
            <FontAwesomeIcon icon={faUser} className="icon" />
            <input
              className="form-input"
              name="first_name"
              placeholder="Nombre"
              type="text"
              value={formData.first_name}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <div className="input-icon">
            <FontAwesomeIcon icon={faUser} className="icon" />
            <input
              className="form-input"
              name="last_name"
              placeholder="Apellido"
              type="text"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <div className="input-icon">
            <FontAwesomeIcon icon={faEnvelope} className="icon" />
            <input
              className="form-input"
              name="email"
              placeholder="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <div className="input-icon">
            <FontAwesomeIcon icon={faUserTag} className="icon" />
            <select
              className="form-input"
              name="group_name"
              value={formData.group_name}
              onChange={handleChange}
            >
              <option value="admin">Administrador</option>
              <option value="recepcionista">Recepcionista</option>
              <option value="cocinero">Cocinero</option>
            </select>
          </div>
        </div>

        <button 
          type="submit" 
          className="btn-submit"
          disabled={updateUser.isLoading}
        >
          {updateUser.isLoading ? 'Actualizando...' : 'Actualizar Usuario'}
        </button>
      </form>
    </div>
  );
};

export default UsuariosModificar;