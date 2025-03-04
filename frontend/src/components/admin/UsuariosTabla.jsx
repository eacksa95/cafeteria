import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPaintBrush, faUser, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useUsers, useDeleteUser } from '../../api/queries';

const UsuariosTabla = ({ setMensaje }) => {
  const { data: usuarios, isLoading, error } = useUsers();
  const deleteUser = useDeleteUser();
  const navigate = useNavigate();

  const onModificarUsuario = (usuario) => {
    navigate(`/usuariosmodificar/${usuario.id}`);
  };

  const onDeleteUsuario = async (usuario) => {
    if (!window.confirm('¿Está seguro que desea eliminar este usuario?')) {
      return;
    }

    try {
      await deleteUser.mutateAsync(usuario.id);
      setMensaje("Usuario eliminado exitosamente");
    } catch (error) {
      console.error("Error:", error);
      setMensaje("Error al eliminar el usuario");
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <FontAwesomeIcon icon={faUser} spin />
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <FontAwesomeIcon icon={faExclamationTriangle} />
        <p>Error al cargar los usuarios: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="usuarios-tabla">
      <div className="usuarios-header">
        <h2 className="usuarios-title">Lista de Usuarios</h2>
      </div>

      <div className="usuarios-content">
        <div className="table-wrapper">
          <table className="usuarios-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.username}</td>
                  <td>{usuario.first_name}</td>
                  <td>{usuario.last_name}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.group_name}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-edit"
                        onClick={() => onModificarUsuario(usuario)}
                        disabled={deleteUser.isLoading}
                      >
                        <FontAwesomeIcon icon={faPaintBrush} />
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => onDeleteUsuario(usuario)}
                        disabled={deleteUser.isLoading}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsuariosTabla;