import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const NoAuth = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
    <div className="w-14 h-14 bg-red-900/30 rounded-2xl flex items-center justify-center mb-4 border border-red-800/40">
      <FontAwesomeIcon icon={faLock} className="text-red-500 text-xl" />
    </div>
    <h2 className="text-xl font-semibold text-stone-100 mb-2">Acceso denegado</h2>
    <p className="text-stone-400 text-sm mb-6">No tenés permisos para ver esta sección.</p>
    <Link to="/" className="btn-secondary">Volver al inicio</Link>
  </div>
);

export default NoAuth;
