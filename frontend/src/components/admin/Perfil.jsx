import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faEnvelope, faIdBadge } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useUser, useUpdateUser } from '../../api/queries';
import ProfilePhotoUpload from '../common/ProfilePhotoUpload';

const ROLE_BADGE = {
  admin:    'bg-amber-900/60 text-amber-300 border-amber-600',
  mozo:     'bg-blue-900/60 text-blue-300 border-blue-600',
  cocinero: 'bg-orange-900/60 text-orange-300 border-orange-600',
  cajero:   'bg-emerald-900/60 text-emerald-300 border-emerald-600',
};

const Perfil = ({ userId }) => {
  const { data: user, isLoading, error } = useUser(userId);
  const updateUser = useUpdateUser();
  const navigate   = useNavigate();
  const [fotoUrl, setFotoUrl] = useState('');

  useEffect(() => {
    if (user) setFotoUrl(user.foto_url || '');
  }, [user]);

  const saveFoto = async (url) => {
    setFotoUrl(url);
    try {
      await updateUser.mutateAsync({ id: userId, foto_url: url });
    } catch {}
  };

  if (isLoading) return <p className="state-loading">Cargando perfil...</p>;
  if (error)    return <p className="state-error">Error al cargar el perfil</p>;

  const badge       = ROLE_BADGE[user.group_name] || 'bg-stone-800 text-stone-300 border-stone-600';
  const fullName    = [user.first_name, user.last_name].filter(Boolean).join(' ') || '—';

  return (
    <div className="card max-w-sm">

      {/* Avatar + nombre + rol */}
      <div className="flex flex-col items-center gap-3 pb-5 border-b border-stone-800 mb-5">
        <ProfilePhotoUpload
          currentUrl={fotoUrl}
          onUpload={saveFoto}
          onRemove={() => saveFoto('')}
          size="lg"
        />
        <div className="text-center">
          <h3 className="text-xl font-bold text-stone-100 mb-1">{user.username}</h3>
          <span className={`px-3 py-0.5 rounded-full text-xs font-semibold border ${badge}`}>
            {user.group_name || 'sin rol'}
          </span>
        </div>
      </div>

      {/* Info */}
      <dl className="space-y-3 mb-5">
        <div className="flex items-center gap-3">
          <FontAwesomeIcon icon={faIdBadge} className="text-stone-500 w-4 flex-shrink-0" />
          <div>
            <dt className="text-stone-500 text-[10px] uppercase tracking-wide">Nombre completo</dt>
            <dd className="text-stone-200 text-sm font-medium">{fullName}</dd>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <FontAwesomeIcon icon={faEnvelope} className="text-stone-500 w-4 flex-shrink-0" />
          <div>
            <dt className="text-stone-500 text-[10px] uppercase tracking-wide">Email</dt>
            <dd className="text-stone-200 text-sm font-medium">{user.email || '—'}</dd>
          </div>
        </div>
      </dl>

      <button
        onClick={() => navigate(`/usuariosmodificar/${user.id}`)}
        className="btn-secondary flex items-center gap-2 w-full justify-center"
      >
        <FontAwesomeIcon icon={faPen} size="xs" />
        Editar perfil
      </button>
    </div>
  );
};

export default Perfil;
