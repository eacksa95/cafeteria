import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faUserTag } from '@fortawesome/free-solid-svg-icons';
import { useCreateUser } from '../../api/queries';

const UsuariosNuevo = ({ setMensaje }) => {
  const navigate = useNavigate();
  const createUser = useCreateUser();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    email: '',
    group_name: 'recepcionista'
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

    if (!formData.username.trim()) {
      setMensaje("Por favor ingrese un nombre de usuario");
      return;
    }
    if (!formData.password.trim()) {
      setMensaje("Por favor ingrese una contraseña");
      return;
    }
    if (!formData.email.trim()) {
      setMensaje("Por favor ingrese un email");
      return;
    }

    try {
      await createUser.mutateAsync(formData);
      setMensaje("Usuario creado exitosamente");
      navigate('/usuariostabla');
    } catch (error) {
      console.error("Error:", error);
      setMensaje("Error al crear el usuario");
    }
  };

  return (
    <div className="usuario-nuevo-container">
      <div className="usuario-form-header">
        <h2>Nuevo Usuario</h2>
        <p>Complete los datos del nuevo usuario</p>
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
            <FontAwesomeIcon icon={faLock} className="icon" />
            <input
              className="form-input"
              name="password"
              placeholder="Contraseña"
              type="password"
              value={formData.password}
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
          disabled={createUser.isLoading}
        >
          {createUser.isLoading ? 'Creando usuario...' : 'Crear Usuario'}
        </button>
      </form>
    </div>
  );
};

export default UsuariosNuevo;