import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faMugHot } from '@fortawesome/free-solid-svg-icons';
import jwtDecode from 'jwt-decode';
import { useLogin } from '../../api/queries';

const Login = ({ onLogin, onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const loginMutation = useLogin();

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(''), 3000);
      return () => clearTimeout(t);
    }
  }, [error]);

  const loginHandle = async (e) => {
    e.preventDefault();
    if (!username) { setError('Ingresá tu nombre de usuario'); return; }
    if (!password) { setError('Ingresá tu contraseña'); return; }
    try {
      const data = await loginMutation.mutateAsync({ username, password });
      window.localStorage.setItem('accessToken', JSON.stringify(data.access));
      onLogin(jwtDecode(data.access).user_id);
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas');
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4">
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-900/90 text-red-200 px-4 py-2 rounded-lg text-sm border border-red-800 shadow-lg">
          {error}
        </div>
      )}

      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-600/20 rounded-2xl mb-4 border border-amber-600/30">
            <FontAwesomeIcon icon={faMugHot} className="text-amber-500 text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-stone-100">Coffee Shop</h1>
          <p className="text-stone-500 text-sm mt-1">Sistema de gestión</p>
        </div>

        <div className="bg-stone-900 rounded-2xl border border-stone-800 p-8 shadow-2xl">
          <form onSubmit={loginHandle} className="space-y-4">
            <div className="relative">
              <FontAwesomeIcon icon={faUser} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 text-sm" />
              <input
                className="input-base pl-9"
                placeholder="Usuario"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                disabled={loginMutation.isLoading}
                autoComplete="username"
              />
            </div>

            <div className="relative">
              <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 text-sm" />
              <input
                className="input-base pl-9"
                placeholder="Contraseña"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={loginMutation.isLoading}
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn-primary w-full py-2.5" disabled={loginMutation.isLoading}>
              {loginMutation.isLoading ? 'Iniciando...' : 'Iniciar sesión'}
            </button>
          </form>

          <button
            type="button"
            onClick={onRegister}
            className="w-full text-center text-amber-500 hover:text-amber-400 text-sm mt-4 transition-colors"
          >
            ¿No tenés cuenta? Registrate
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
