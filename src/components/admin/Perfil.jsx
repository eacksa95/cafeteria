import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaintBrush, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../api/queries';

const Perfil = ({ userId }) => {
  const { data: user, isLoading, error } = useUser(userId);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="loading-container">
        <FontAwesomeIcon icon={faUser} spin />
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error al cargar el perfil: {error.message}</p>
      </div>
    );
  }

  const onModificarUsuario = () => {
    navigate(`/usuariosmodificar/${user.id}`);
  };

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <h2 className="perfil-title">Mi Perfil</h2>
      </div>

      <div className="perfil-content">
        <div className="perfil-card">
          <div className="perfil-avatar">
            <FontAwesomeIcon icon={faUser} className="avatar-icon" />
          </div>
          
          <div className="perfil-info">
            <div className="info-group">
              <label>Usuario:</label>
              <span>{user.username}</span>
            </div>
            
            <div className="info-group">
              <label>Nombre:</label>
              <span>{user.first_name}</span>
            </div>
            
            <div className="info-group">
              <label>Apellido:</label>
              <span>{user.last_name}</span>
            </div>
            
            <div className="info-group">
              <label>Email:</label>
              <span>{user.email}</span>
            </div>
            
            <div className="info-group">
              <label>Rol:</label>
              <span>{user.group_name}</span>
            </div>
          </div>

          <button 
            className="btn-edit-profile"
            onClick={onModificarUsuario}
          >
            <FontAwesomeIcon icon={faPaintBrush} />
            <span>Editar Perfil</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Perfil;