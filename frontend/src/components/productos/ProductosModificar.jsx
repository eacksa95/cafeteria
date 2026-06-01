import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { useProducto, useUpdateProducto } from '../../api/queries';
import CloudinaryUpload from '../common/CloudinaryUpload';

const CATS = [
  { value: 'cafe',     label: 'Cafés y calientes' },
  { value: 'bebida',   label: 'Bebidas frías' },
  { value: 'desayuno', label: 'Desayunos' },
  { value: 'comida',   label: 'Comidas' },
  { value: 'postre',   label: 'Postres' },
  { value: 'otro',     label: 'Otro' },
];

const ProductosModificar = ({ setMensaje, role }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: producto, isLoading, error } = useProducto(id);
  const updateMutation = useUpdateProducto();
  const isAdmin = role === 'admin';

  const [form, setForm] = useState({ nombre: '', precio: '', cantidad: 1, img: '', categoria: 'otro' });

  useEffect(() => {
    if (producto) setForm({
      nombre:    producto.nombre    || '',
      precio:    producto.precio    || '',
      cantidad:  producto.cantidad  || 1,
      img:       producto.img       || '',
      categoria: producto.categoria || 'otro',
    });
  }, [producto]);

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    try {
      const data = isAdmin ? form : { nombre: form.nombre, cantidad: form.cantidad, img: form.img };
      await updateMutation.mutateAsync({ id, ...data });
      setMensaje('Producto actualizado');
      navigate('/productosindex');
    } catch { setMensaje('Error al actualizar el producto'); }
  };

  if (isLoading) return <p className="state-loading">Cargando producto...</p>;
  if (error)    return <p className="state-error">Error al cargar el producto</p>;

  return (
    <div className="card max-w-md">
      <h3 className="text-base font-semibold text-stone-800 mb-1">Modificar Producto</h3>
      <p className="text-stone-400 text-sm mb-4">
        Actualizá: <span className="text-amber-700 font-medium">{producto?.nombre}</span>
      </p>

      <form onSubmit={submit} className="space-y-3">
        <input className="input-base" name="nombre" placeholder="Nombre *" required value={form.nombre} onChange={handle} />

        <div className="relative">
          <input
            className={`input-base ${!isAdmin ? 'opacity-60 cursor-not-allowed' : ''}`}
            name="precio" placeholder="Precio" type="number" step="0.01" min="0"
            value={form.precio} onChange={handle} disabled={!isAdmin}
          />
          {!isAdmin && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-stone-400 text-xs">
              <FontAwesomeIcon icon={faLock} size="xs" /> Solo admin
            </div>
          )}
        </div>

        <select className="input-base" name="categoria" value={form.categoria} onChange={handle}>
          {CATS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>

        <CloudinaryUpload
          currentUrl={form.img}
          onUpload={url => setForm(p => ({ ...p, img: url }))}
          onRemove={() => setForm(p => ({ ...p, img: '' }))}
        />

        <button type="submit" className="btn-primary w-full" disabled={updateMutation.isLoading}>
          {updateMutation.isLoading ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
};

export default ProductosModificar;
