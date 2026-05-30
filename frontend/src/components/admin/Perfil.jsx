import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPen } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../api/queries';

const ROLE_BADGE = {
  admin: 'bg-amber-900/50 text-amber-400 border-amber-700',
  mozo: 'bg-blue-900/50 text-blue-400 border-blue-700',
  cocinero: 'bg-orange-900/50 text-orange-400 border-orange-700',
  cajero: 'bg-emerald-900/50 text-emerald-400 border-emerald-700',
};

const Perfil = ({ userId }) => {
  const { data: user, isLoading, error } = useUser(userId);
  const navigate = useNavigate();

  if (isLoading) return <p className="state-loading">Cargando perfil...</p>;
  if (error) return <p className="state-error">Error al cargar el perfil</p>;

  const badge = ROLE_BADGE[user.group_name] || 'bg-stone-800 text-stone-400 border-stone-700';

  return (
    <div className="card max-w-md">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-14 h-14 bg-stone-800 rounded-xl flex items-center justify-center border border-stone-700 flex-shrink-0">
          <FontAwesomeIcon icon={faUser} className="text-stone-400 text-xl" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-stone-100">{user.username}</h3>
          <span className={`px-2 py-0.5 rounded-full text-xs border font-medium ${badge}`}>
            {user.group_name || 'sin rol'}
          </span>
        </div>
      </div>

      <dl className="space-y-3 text-sm mb-6">
        {[
          ['Nombre', `${user.first_name} ${user.last_name}`],
          ['Email', user.email],
        ].map(([label, val]) => (
          <div key={label} className="flex gap-3">
            <dt className="text-stone-500 w-20 flex-shrink-0">{label}</dt>
            <dd className="text-stone-200">{val || '—'}</dd>
          </div>
        ))}
      </dl>

      <button
        onClick={() => navigate(`/usuariosmodificar/${user.id}`)}
        className="btn-secondary flex items-center gap-2"
      >
        <FontAwesomeIcon icon={faPen} size="xs" />
        Editar perfil
      </button>
    </div>
  );
};

export default Perfil;
