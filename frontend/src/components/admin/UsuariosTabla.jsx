import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useUsers, useDeleteUser } from '../../api/queries';

const ROLE_BADGE = {
  admin:    'bg-amber-900/60 text-amber-300 border-amber-600',
  mozo:     'bg-blue-900/60 text-blue-300 border-blue-600',
  cocinero: 'bg-orange-900/60 text-orange-300 border-orange-600',
  cajero:   'bg-emerald-900/60 text-emerald-300 border-emerald-600',
};

function UserAvatar({ url, username, size = 8 }) {
  const cls = `w-${size} h-${size} rounded-full object-cover border border-stone-700 flex-shrink-0`;
  if (url) {
    return <img src={url} alt={username} className={cls} onError={e => { e.target.style.display = 'none'; }} />;
  }
  const initials = (username || '?')[0].toUpperCase();
  return (
    <div className={`w-${size} h-${size} rounded-full bg-stone-700 border border-stone-600 flex items-center justify-center flex-shrink-0`}>
      <span className="text-stone-300 text-xs font-bold">{initials}</span>
    </div>
  );
}

const UsuariosTabla = ({ setMensaje }) => {
  const { data: usuarios, isLoading, error } = useUsers();
  const deleteUser = useDeleteUser();
  const navigate   = useNavigate();

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
      <h3 className="text-base font-semibold text-stone-200 mb-4">
        Usuarios <span className="text-stone-500 font-normal">({usuarios?.length})</span>
      </h3>
      <table className="table-base w-full">
        <thead>
          <tr>
            {['', 'Usuario', 'Nombre', 'Email', 'Rol', ''].map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {usuarios?.map(u => (
            <tr key={u.id} className="hover:bg-stone-800/30 transition-colors">
              <td className="w-10">
                <UserAvatar url={u.foto_url} username={u.username} size={8} />
              </td>
              <td className="font-semibold text-stone-100">{u.username}</td>
              <td className="text-stone-300">{[u.first_name, u.last_name].filter(Boolean).join(' ') || '—'}</td>
              <td className="text-stone-400 text-sm">{u.email || '—'}</td>
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
                  <button onClick={() => onDelete(u)} className="btn-danger" title="Eliminar" disabled={deleteUser.isPending}>
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
