import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen, faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useProductos, useDeleteProducto } from '../../api/queries';

const IMG_FALLBACK = 'https://png.pngtree.com/template/20190323/ourmid/pngtree-coffee-logo-design-image_82183.jpg';

const ProductosTabla = ({ setMensaje }) => {
  const [search, setSearch]     = useState('');
  const [selected, setSelected] = useState(null);

  const { data: productos, isLoading, error } = useProductos();
  const deleteProducto = useDeleteProducto();
  const navigate = useNavigate();

  const onDelete = async () => {
    if (!selected) return;
    if (!window.confirm(`¿Eliminar "${selected.nombre}"?`)) return;
    try {
      await deleteProducto.mutateAsync(selected.id);
      setMensaje('Producto eliminado');
      setSelected(null);
    } catch { setMensaje('Error al eliminar'); }
  };

  const selectRow = (p) => setSelected(prev => prev?.id === p.id ? null : p);

  if (isLoading) return <p className="state-loading">Cargando productos...</p>;
  if (error)    return <p className="state-error">Error al cargar productos</p>;

  const filtered = productos?.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="card">
      {/* Search + action bar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[160px]">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 text-xs" />
          <input
            className="input-base pl-8 py-1.5 text-sm"
            placeholder="Buscar producto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Acciones aparecen al seleccionar una fila */}
        {selected ? (
          <div className="flex items-center gap-2 bg-stone-800 rounded-lg px-3 py-1.5 border border-stone-700">
            <span className="text-amber-400 text-xs font-medium truncate max-w-[120px]">{selected.nombre}</span>
            <button
              onClick={() => navigate(`/productosmodificar/${selected.id}`)}
              className="btn-secondary flex items-center gap-1.5 py-1 px-2 text-xs"
            >
              <FontAwesomeIcon icon={faPen} size="xs" /> Editar
            </button>
            <button onClick={onDelete} className="btn-danger p-1.5" disabled={deleteProducto.isLoading} title="Eliminar">
              <FontAwesomeIcon icon={faTrash} size="xs" />
            </button>
            <button onClick={() => setSelected(null)} className="text-stone-500 hover:text-stone-300 p-1" title="Deseleccionar">
              <FontAwesomeIcon icon={faXmark} size="xs" />
            </button>
          </div>
        ) : (
          <p className="text-stone-600 text-xs">Hacé clic en una fila para seleccionar</p>
        )}
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="table-base w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Imagen</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr
                key={p.id}
                onClick={() => selectRow(p)}
                className={`cursor-pointer transition-colors ${
                  selected?.id === p.id
                    ? 'bg-amber-900/20 border-l-2 border-l-amber-500'
                    : 'hover:bg-stone-800/40'
                }`}
              >
                <td className="text-stone-500">{p.id}</td>
                <td className="font-medium text-stone-100">{p.nombre}</td>
                <td className="text-amber-400 font-semibold">${Number(p.precio).toFixed(2)}</td>
                <td>
                  <img
                    src={p.img || IMG_FALLBACK}
                    alt={p.nombre}
                    className="w-8 h-8 rounded object-cover border border-stone-700"
                    onError={e => { e.target.src = IMG_FALLBACK; }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!filtered.length && <p className="state-empty">No se encontraron productos</p>}
    </div>
  );
};

export default ProductosTabla;
