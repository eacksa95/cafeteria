import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateUser } from '../../api/queries';

const ROLES = [
  { value: 'admin',    label: 'Administrador' },
  { value: 'mozo',     label: 'Mozo' },
  { value: 'cocinero', label: 'Cocinero' },
  { value: 'cajero',   label: 'Cajero' },
];

const UsuariosNuevo = ({ setMensaje }) => {
  const navigate = useNavigate();
  const createUser = useCreateUser();
  const [form, setForm] = useState({ username: '', password: '', first_name: '', last_name: '', email: '', group_name: 'mozo' });

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    try {
      await createUser.mutateAsync(form);
      setMensaje('Usuario creado exitosamente');
      navigate('/usuariostabla');
    } catch { setMensaje('Error al crear el usuario'); }
  };

  return (
    <div className="card max-w-md">
      <h3 className="text-lg font-semibold text-stone-100 mb-1">Nuevo Usuario</h3>
      <p className="text-stone-400 text-sm mb-5">Completá los datos del nuevo operador</p>

      <form onSubmit={submit} className="space-y-3">
        <input className="input-base" name="username" placeholder="Usuario *" required value={form.username} onChange={handle} />
        <input className="input-base" type="password" name="password" placeholder="Contraseña *" required value={form.password} onChange={handle} />
        <div className="grid grid-cols-2 gap-2">
          <input className="input-base" name="first_name" placeholder="Nombre" value={form.first_name} onChange={handle} />
          <input className="input-base" name="last_name" placeholder="Apellido" value={form.last_name} onChange={handle} />
        </div>
        <input className="input-base" type="email" name="email" placeholder="Email *" required value={form.email} onChange={handle} />
        <select className="input-base" name="group_name" value={form.group_name} onChange={handle}>
          {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
        <button type="submit" className="btn-primary w-full" disabled={createUser.isLoading}>
          {createUser.isLoading ? 'Creando...' : 'Crear Usuario'}
        </button>
      </form>
    </div>
  );
};

export default UsuariosNuevo;
