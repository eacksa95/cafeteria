import { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import '../../estilos/login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);

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
      const response = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Error en el login.");
      }

      const tokenData = await response.json();
      
      if (tokenData.error) {
        setMensaje("Credenciales inválidas");
        return;
      }

      window.localStorage.setItem("accessToken", JSON.stringify(tokenData.access));
      onLogin(jwtDecode(tokenData.access).user_id);
      
    } catch (error) {
      console.error('Error:', error);
      setMensaje("Error al iniciar sesión. Por favor intente nuevamente.");
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
          />
        </div>

        <button type="submit" className="btn-primary">
          Iniciar sesión
        </button>
      </form>
    </div>
  );
};

export default Login;