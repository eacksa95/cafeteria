import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useUsers, useDeleteUser } from '../../api/queries';

const ROLE_BADGE = {
  admin: 'bg-amber-900/50 text-amber-400 border-amber-700',
  mozo: 'bg-blue-900/50 text-blue-400 border-blue-700',
  cocinero: 'bg-orange-900/50 text-orange-400 border-orange-700',
  cajero: 'bg-emerald-900/50 text-emerald-400 border-emerald-700',
};

const UsuariosTabla = ({ setMensaje }) => {
  const { data: usuarios, isLoading, error } = useUsers();
  const deleteUser = useDeleteUser();
  const navigate = useNavigate();

  const onDelete = async (u) => {
    if (!window.confirm(`¿Eliminar al usuario ${u.username}?`)) return;
    try {
      await deleteUser.mutateAsync(u.id);
      setMensaje('Usuario eliminado');
    } catch { setMensaje('Error al eliminar'); }
  };

  if (isLoading) return <p className="state-loading">Cargando usuarios...</p>;
  if (error)    return <p className="state-error">Error al cargar usuarios</p>;

  return (
    <div className="card overflow-x-auto">
      <h3 className="text-lg font-semibold text-stone-100 mb-4">Usuarios ({usuarios?.length})</h3>
      <table className="table-base w-full">
        <thead>
          <tr>
            {['#', 'Usuario', 'Nombre', 'Email', 'Rol', ''].map(h => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {usuarios?.map(u => (
            <tr key={u.id} className="hover:bg-stone-800/30 transition-colors">
              <td className="text-stone-500">{u.id}</td>
              <td className="font-medium text-stone-100">{u.username}</td>
              <td>{u.first_name} {u.last_name}</td>
              <td className="text-stone-400">{u.email}</td>
              <td>
                <span className={`px-2 py-0.5 rounded-full text-xs border ${ROLE_BADGE[u.group_name] || 'bg-stone-800 text-stone-400 border-stone-700'}`}>
                  {u.group_name || '—'}
                </span>
              </td>
              <td>
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/usuariosmodificar/${u.id}`)} className="btn-edit" title="Editar">
                    <FontAwesomeIcon icon={faPen} size="xs" />
                  </button>
                  <button onClick={() => onDelete(u)} className="btn-danger" title="Eliminar" disabled={deleteUser.isLoading}>
                    <FontAwesomeIcon icon={faTrash} size="xs" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!usuarios?.length && <p className="state-empty">No hay usuarios registrados</p>}
    </div>
  );
};

export default UsuariosTabla;
