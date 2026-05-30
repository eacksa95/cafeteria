import { useState } from 'react';
import { useRegister } from '../../api/queries';
import '../../estilos/login.css';

const ROLES = [
  { value: 'mozo',      label: 'Mozo / Recepcionista' },
  { value: 'cocinero',  label: 'Cocina' },
  { value: 'cajero',    label: 'Cajero' },
];

const EMPTY = {
  username: '', password: '', password2: '',
  email: '', first_name: '', last_name: '', group_name: 'mozo',
};

const Register = ({ onBack, onRegistered }) => {
  const [form, setForm]   = useState(EMPTY);
  const [error, setError] = useState('');
  const mutation = useRegister();

  const handle = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.password2) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    try {
      const { password2, ...data } = form;
      await mutation.mutateAsync(data);
      onRegistered();
    } catch (err) {
      setError(err.message || 'Error al registrar. Intentá con otro nombre de usuario.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={submit}>
        <h2 className="login-title">Crear cuenta</h2>
        <p className="login-text-center">Completá tus datos para registrarte</p>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-group">
          <input className="form-input" name="username" placeholder="Usuario *"
            required value={form.username} onChange={handle} />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <input className="form-input" name="first_name" placeholder="Nombre"
              value={form.first_name} onChange={handle} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <input className="form-input" name="last_name" placeholder="Apellido"
              value={form.last_name} onChange={handle} />
          </div>
        </div>
        <div className="form-group">
          <input className="form-input" type="email" name="email" placeholder="Email"
            value={form.email} onChange={handle} />
        </div>
        <div className="form-group">
          <input className="form-input" type="password" name="password" placeholder="Contraseña *"
            required value={form.password} onChange={handle} />
        </div>
        <div className="form-group">
          <input className="form-input" type="password" name="password2" placeholder="Confirmar contraseña *"
            required value={form.password2} onChange={handle} />
        </div>
        <div className="form-group">
          <select className="form-input" name="group_name" value={form.group_name} onChange={handle}
            style={{ paddingLeft: '12px', cursor: 'pointer' }}>
            {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>

        <button type="submit" className="btn-login" disabled={mutation.isPending}>
          {mutation.isPending ? 'Registrando...' : 'Crear cuenta'}
        </button>
        <button type="button" className="btn-register" onClick={onBack}
          style={{ marginTop: '8px', background: 'transparent', border: '2px solid var(--primary-color)',
            color: 'var(--primary-color)', borderRadius: 'var(--border-radius-md)',
            width: '100%', padding: '8px', fontWeight: 600, cursor: 'pointer' }}>
          ← Volver al login
        </button>
      </form>
    </div>
  );
};

export default Register;
