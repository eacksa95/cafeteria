import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { useProducto, useUpdateProducto } from '../../api/queries';

const IMG_DEFAULT = 'https://png.pngtree.com/template/20190323/ourmid/pngtree-coffee-logo-design-image_82183.jpg';

const ProductosModificar = ({ setMensaje, role }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: producto, isLoading, error } = useProducto(id);
  const updateMutation = useUpdateProducto();
  const isAdmin = role === 'admin';

  const [form, setForm] = useState({ nombre: '', precio: '', cantidad: 1, img: IMG_DEFAULT });

  useEffect(() => {
    if (producto) setForm({ nombre: producto.nombre || '', precio: producto.precio || '', cantidad: producto.cantidad || 1, img: producto.img || IMG_DEFAULT });
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
      <h3 className="text-lg font-semibold text-stone-100 mb-1">Modificar Producto</h3>
      <p className="text-stone-400 text-sm mb-5">Actualizá los datos de <span className="text-amber-400">{producto?.nombre}</span></p>

      <form onSubmit={submit} className="space-y-3">
        <input className="input-base" name="nombre" placeholder="Nombre *" required value={form.nombre} onChange={handle} />

        <div className="relative">
          <input
            className={`input-base ${!isAdmin ? 'opacity-60 cursor-not-allowed bg-stone-800/50' : ''}`}
            name="precio" placeholder="Precio" type="number" step="0.01" min="0"
            value={form.precio} onChange={handle} disabled={!isAdmin}
          />
          {!isAdmin && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-stone-500 text-xs">
              <FontAwesomeIcon icon={faLock} size="xs" /> Solo admin
            </div>
          )}
        </div>

        <input className="input-base" name="img" placeholder="URL imagen" value={form.img} onChange={handle} />

        {form.img && (
          <img src={form.img} alt="preview" className="w-20 h-20 rounded-lg object-cover border border-stone-700"
            onError={e => { e.target.src = IMG_DEFAULT; }} />
        )}

        <button type="submit" className="btn-primary w-full" disabled={updateMutation.isLoading}>
          {updateMutation.isLoading ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
};

export default ProductosModificar;
