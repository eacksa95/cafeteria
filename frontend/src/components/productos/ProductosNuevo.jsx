import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { useCreateProducto } from '../../api/queries';
import CloudinaryUpload from '../common/CloudinaryUpload';

const ProductosNuevo = ({ setMensaje, role }) => {
  const navigate = useNavigate();
  const createProducto = useCreateProducto();
  const isAdmin = role === 'admin';

  const CATS = [
    { value: 'cafe',     label: 'Cafés y calientes' },
    { value: 'bebida',   label: 'Bebidas frías' },
    { value: 'desayuno', label: 'Desayunos' },
    { value: 'comida',   label: 'Comidas' },
    { value: 'postre',   label: 'Postres' },
    { value: 'otro',     label: 'Otro' },
  ];
  const [form, setForm] = useState({ nombre: '', precio: '', cantidad: 1, img: '', categoria: 'otro' });

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    if (!form.nombre.trim()) { setMensaje('Ingresá el nombre del producto'); return; }
    if (!form.precio || form.precio <= 0) { setMensaje('Ingresá un precio válido'); return; }
    try {
      await createProducto.mutateAsync(form);
      setMensaje('Producto creado exitosamente');
      navigate('/productosindex');
    } catch { setMensaje('Error al crear el producto'); }
  };

  return (
    <div className="card max-w-md">
      <h3 className="text-lg font-semibold text-stone-100 mb-1">Nuevo Producto</h3>
      <p className="text-stone-400 text-sm mb-5">Completá los datos del producto</p>

      <form onSubmit={submit} className="space-y-3">
        <input className="input-base" name="nombre" placeholder="Nombre del producto *" required value={form.nombre} onChange={handle} />

        <div className="relative">
          <input
            className={`input-base ${!isAdmin ? 'opacity-60 cursor-not-allowed' : ''}`}
            name="precio" placeholder="Precio *" type="number" step="0.01" min="0"
            required value={form.precio} onChange={handle} disabled={!isAdmin}
          />
          {!isAdmin && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-stone-500 text-xs">
              <FontAwesomeIcon icon={faLock} size="xs" /> Solo admin
            </div>
          )}
        </div>

        <select className="input-base" name="categoria" value={form.categoria} onChange={handle}>
          {CATS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <input className="input-base" name="img" placeholder="URL imagen (opcional, o subí abajo)" value={form.img} onChange={handle} />
        <CloudinaryUpload currentUrl={form.img} onUpload={url => setForm(p => ({ ...p, img: url }))} />

        {form.img && (
          <img src={form.img} alt="preview" className="w-20 h-20 rounded-lg object-cover border border-stone-700"
            onError={e => { e.target.src = IMG_DEFAULT; }} />
        )}

        <button type="submit" className="btn-primary w-full" disabled={createProducto.isLoading}>
          {createProducto.isLoading ? 'Creando...' : 'Crear Producto'}
        </button>
      </form>
    </div>
  );
};

export default ProductosNuevo;
