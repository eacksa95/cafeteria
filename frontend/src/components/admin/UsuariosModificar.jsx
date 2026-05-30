import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser, useUpdateUser } from '../../api/queries';

const ROLES = [
  { value: 'admin',    label: 'Administrador' },
  { value: 'mozo',     label: 'Mozo' },
  { value: 'cocinero', label: 'Cocinero' },
  { value: 'cajero',   label: 'Cajero' },
];

const UsuariosModificar = ({ setMensaje }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: user, isLoading, error } = useUser(id);
  const updateUser = useUpdateUser();
  const [form, setForm] = useState({ username: '', first_name: '', last_name: '', email: '', group_name: 'mozo' });

  useEffect(() => {
    if (user) setForm({ username: user.username || '', first_name: user.first_name || '', last_name: user.last_name || '', email: user.email || '', group_name: user.group_name || 'mozo' });
  }, [user]);

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    try {
      await updateUser.mutateAsync({ id, ...form });
      setMensaje('Usuario actualizado');
      navigate('/usuariostabla');
    } catch { setMensaje('Error al actualizar'); }
  };

  if (isLoading) return <p className="state-loading">Cargando usuario...</p>;
  if (error)    return <p className="state-error">Error al cargar el usuario</p>;

  return (
    <div className="card max-w-md">
      <h3 className="text-lg font-semibold text-stone-100 mb-1">Modificar Usuario</h3>
      <p className="text-stone-400 text-sm mb-5">Actualizá los datos de <span className="text-amber-400">{user?.username}</span></p>

      <form onSubmit={submit} className="space-y-3">
        <input className="input-base" name="username" placeholder="Usuario" required value={form.username} onChange={handle} />
        <div className="grid grid-cols-2 gap-2">
          <input className="input-base" name="first_name" placeholder="Nombre" value={form.first_name} onChange={handle} />
          <input className="input-base" name="last_name" placeholder="Apellido" value={form.last_name} onChange={handle} />
        </div>
        <input className="input-base" type="email" name="email" placeholder="Email" required value={form.email} onChange={handle} />
        <select className="input-base" name="group_name" value={form.group_name} onChange={handle}>
          {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
        <button type="submit" className="btn-primary w-full" disabled={updateUser.isLoading}>
          {updateUser.isLoading ? 'Actualizando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
};

export default UsuariosModificar;
