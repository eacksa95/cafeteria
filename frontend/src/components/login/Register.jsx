import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faMugHot } from '@fortawesome/free-solid-svg-icons';
import { useRegister } from '../../api/queries';

const ROLES = [
  { value: 'mozo',     label: 'Mozo / Atención al cliente' },
  { value: 'cocinero', label: 'Cocina' },
  { value: 'cajero',   label: 'Cajero' },
];

const EMPTY = { username: '', password: '', password2: '', email: '', first_name: '', last_name: '', group_name: 'mozo' };

const Register = ({ onBack, onRegistered }) => {
  const [form, setForm]   = useState(EMPTY);
  const [error, setError] = useState('');
  const [ok, setOk]       = useState(false);
  const mutation = useRegister();

  const handle = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setError('');
    if (form.password !== form.password2) { setError('Las contraseñas no coinciden'); return; }
    try {
      const { password2, ...data } = form;
      await mutation.mutateAsync(data);
      setOk(true);
      setTimeout(onRegistered, 1500);
    } catch (err) {
      setError(err.message || 'Error al registrar. Intentá con otro nombre de usuario.');
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-600/20 rounded-2xl mb-3 border border-amber-600/30">
            <FontAwesomeIcon icon={faMugHot} className="text-amber-500 text-xl" />
          </div>
          <h1 className="text-xl font-bold text-stone-100">Crear cuenta</h1>
          <p className="text-stone-500 text-sm mt-1">Registrate para acceder al sistema</p>
        </div>

        <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 shadow-2xl">
          {error && <div className="bg-red-900/50 text-red-300 text-sm px-3 py-2 rounded-lg border border-red-800 mb-4">{error}</div>}
          {ok    && <div className="bg-emerald-900/50 text-emerald-300 text-sm px-3 py-2 rounded-lg border border-emerald-800 mb-4">¡Cuenta creada! Redirigiendo al login...</div>}

          <form onSubmit={submit} className="space-y-3">
            <input className="input-base" name="username" placeholder="Usuario *" required value={form.username} onChange={handle} />

            <div className="grid grid-cols-2 gap-2">
              <input className="input-base" name="first_name" placeholder="Nombre" value={form.first_name} onChange={handle} />
              <input className="input-base" name="last_name"  placeholder="Apellido" value={form.last_name}  onChange={handle} />
            </div>

            <input className="input-base" type="email" name="email" placeholder="Email" value={form.email} onChange={handle} />
            <input className="input-base" type="password" name="password" placeholder="Contraseña *" required value={form.password} onChange={handle} />
            <input className="input-base" type="password" name="password2" placeholder="Confirmar contraseña *" required value={form.password2} onChange={handle} />

            <select className="input-base" name="group_name" value={form.group_name} onChange={handle}>
              {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>

            <button type="submit" className="btn-primary w-full py-2.5" disabled={mutation.isPending || ok}>
              {mutation.isPending ? 'Registrando...' : 'Crear cuenta'}
            </button>
          </form>

          <button type="button" onClick={onBack} className="w-full flex items-center justify-center gap-2 text-stone-400 hover:text-stone-200 text-sm mt-4 transition-colors">
            <FontAwesomeIcon icon={faArrowLeft} size="xs" />
            Volver al login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
