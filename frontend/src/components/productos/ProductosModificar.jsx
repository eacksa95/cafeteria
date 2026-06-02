import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { useProducto, useUpdateProducto, useCategorias } from '../../api/queries';
import CloudinaryUpload from '../common/CloudinaryUpload';

const ProductosModificar = ({ setMensaje, role }) => {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { data: producto, isLoading, error } = useProducto(id);
  const updateMutation = useUpdateProducto();
  const { data: categorias = [] } = useCategorias();
  const isAdmin = role === 'admin';

  const [form, setForm] = useState({ nombre: '', precio: '', img: '', categoria_id: 1 });

  useEffect(() => {
    if (producto) setForm({
      nombre:       producto.nombre       || '',
      precio:       producto.precio       || '',
      img:          producto.img          || '',
      categoria_id: producto.categoria_id || 1,
    });
  }, [producto]);

  const handle    = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleInt = e => setForm(p => ({ ...p, [e.target.name]: Number(e.target.value) }));

  const submit = async e => {
    e.preventDefault();
    try {
      const data = isAdmin
        ? { nombre: form.nombre, precio: form.precio, img: form.img, categoria_id: form.categoria_id }
        : { nombre: form.nombre, img: form.img };
      await updateMutation.mutateAsync({ id, ...data });
      setMensaje('Producto actualizado');
      navigate('/productosindex');
    } catch { setMensaje('Error al actualizar el producto'); }
  };

  if (isLoading) return <p className="state-loading">Cargando producto...</p>;
  if (error)    return <p className="state-error">Error al cargar el producto</p>;

  return (
    <div className="card max-w-md">
      <h3 className="text-base font-semibold text-stone-100 mb-1">Modificar Producto</h3>
      <p className="text-stone-400 text-sm mb-4">
        Actualizá: <span className="text-amber-400 font-medium">{producto?.nombre}</span>
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

        <select
          className={`input-base ${!isAdmin ? 'opacity-60 cursor-not-allowed' : ''}`}
          name="categoria_id"
          value={form.categoria_id}
          onChange={handleInt}
          disabled={!isAdmin}
        >
          {categorias.map(c => (
            <option key={c.id} value={c.id}>{c.emoji} {c.nombre}</option>
          ))}
          {!categorias.length && <option value={1}>Cargando categorías...</option>}
        </select>

        <CloudinaryUpload
          currentUrl={form.img}
          onUpload={url => setForm(p => ({ ...p, img: url }))}
          onRemove={() => setForm(p => ({ ...p, img: '' }))}
        />

        <button type="submit" className="btn-primary w-full" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
};

export default ProductosModificar;
