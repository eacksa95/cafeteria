import { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { useLogin } from '../../api/queries';
import '../../estilos/login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const loginMutation = useLogin();

  useEffect(() => {
    if (mensaje) {
      setMostrarMensaje(true);
      setTimeout(() => {
        setMensaje('');
        setMostrarMensaje(false);
      }, 3000);
    }
  }, [mensaje]);

  const loginHandle = async (e) => {
    e.preventDefault();
    
    if (!username) {
      setMensaje("Por favor ingrese su nombre de usuario");
      return;
    }
    if (!password) {
      setMensaje("Por favor ingrese su contraseña");
      return;
    }

    try {
      const data = await loginMutation.mutateAsync({ username, password });
      window.localStorage.setItem("accessToken", JSON.stringify(data.access));
      onLogin(jwtDecode(data.access).user_id);
    } catch (error) {
      console.error('Error:', error);
      setMensaje(error.message || "Error al iniciar sesión. Por favor intente nuevamente.");
    }
  };

  return (
    <div className="login-container">
      {mostrarMensaje && (
        <div className="alert alert-error">
          {mensaje}
        </div>
      )}

      <form className="login-form" onSubmit={loginHandle}>
        <h2 className="login-title">Coffee Time</h2>
        <p className="text-center mb-4">Bienvenido a tu espacio de café</p>
        
        <div className="form-group">
          <input
            className="form-input"
            aria-label="Username"
            placeholder="Nombre de usuario"
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loginMutation.isLoading}
          />
        </div>

        <div className="form-group">
          <input
            className="form-input"
            aria-label="Password"
            placeholder="Contraseña"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loginMutation.isLoading}
          />
        </div>

        <button 
          type="submit" 
          className="btn-primary"
          disabled={loginMutation.isLoading}
        >
          {loginMutation.isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>
      </form>
    </div>
  );
};

export default Login;