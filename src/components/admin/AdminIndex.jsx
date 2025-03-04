import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUsers, faUserPlus } from '@fortawesome/free-solid-svg-icons';

const AdminIndex = ({ children }) => {
  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2 className="admin-title">Panel de Administración</h2>
        <nav className="admin-nav">
          <Link to="/admin" className="admin-nav-link">
            <FontAwesomeIcon icon={faUser} className="admin-icon" />
            <span>Mi Perfil</span>
          </Link>
          <Link to="/usuariostabla" className="admin-nav-link">
            <FontAwesomeIcon icon={faUsers} className="admin-icon" />
            <span>Lista de Usuarios</span>
          </Link>
          <Link to="/usuariosnuevo" className="admin-nav-link">
            <FontAwesomeIcon icon={faUserPlus} className="admin-icon" />
            <span>Nuevo Usuario</span>
          </Link>
        </nav>
      </div>
      
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
};

export default AdminIndex;