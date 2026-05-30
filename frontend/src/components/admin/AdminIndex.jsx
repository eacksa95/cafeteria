import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUsers, faUserPlus } from '@fortawesome/free-solid-svg-icons';

const AdminIndex = ({ children }) => (
  <div className="page">
    <div className="mb-4">
      <h2 className="text-xl font-bold text-stone-100 mb-3">Panel de Administración</h2>
      <div className="sub-nav">
        <Link to="/admin"><FontAwesomeIcon icon={faUser} className="mr-1.5" />Mi Perfil</Link>
        <Link to="/usuariostabla"><FontAwesomeIcon icon={faUsers} className="mr-1.5" />Usuarios</Link>
        <Link to="/usuariosnuevo"><FontAwesomeIcon icon={faUserPlus} className="mr-1.5" />Nuevo Usuario</Link>
      </div>
    </div>
    <div>{children}</div>
  </div>
);

export default AdminIndex;
