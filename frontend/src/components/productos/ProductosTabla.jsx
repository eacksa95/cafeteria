import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useProductos, useDeleteProducto } from '../../api/queries';

const ProductosTabla = ({ setMensaje }) => {
  const [search, setSearch] = useState('');
  const { data: productos, isLoading, error } = useProductos();
  const deleteProducto = useDeleteProducto();
  const navigate = useNavigate();

  const onDelete = async (p) => {
    if (!window.confirm(`¿Eliminar "${p.nombre}"?`)) return;
    try {
      await deleteProducto.mutateAsync(p.id);
      setMensaje('Producto eliminado');
    } catch { setMensaje('Error al eliminar'); }
  };

  if (isLoading) return <p className="state-loading">Cargando productos...</p>;
  if (error)    return <p className="state-error">Error al cargar productos</p>;

  const filtered = productos?.filter(p => p.nombre.toLowerCase().includes(search.toLowerCase())) || [];

  return (
    <div className="card overflow-x-auto">
      <div className="flex items-center justify-between mb-4 gap-3">
        <h3 className="text-lg font-semibold text-stone-100 flex-shrink-0">Productos ({filtered.length})</h3>
        <div className="relative max-w-xs w-full">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 text-xs" />
          <input
            className="input-base pl-8 py-1.5 text-xs"
            placeholder="Buscar..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <table className="table-base w-full">
        <thead>
          <tr>
            {['#', 'Nombre', 'Precio', 'Imagen', ''].map(h => <th key={h}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {filtered.map(p => (
            <tr key={p.id} className="hover:bg-stone-800/30 transition-colors">
              <td className="text-stone-500">{p.id}</td>
              <td className="font-medium text-stone-100">{p.nombre}</td>
              <td className="text-amber-400 font-medium">${Number(p.precio).toFixed(2)}</td>
              <td>
                {p.img && <img src={p.img} alt={p.nombre} className="w-8 h-8 rounded object-cover" onError={e => { e.target.style.display = 'none'; }} />}
              </td>
              <td>
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/productosmodificar/${p.id}`)} className="btn-edit" title="Editar">
                    <FontAwesomeIcon icon={faPen} size="xs" />
                  </button>
                  <button onClick={() => onDelete(p)} className="btn-danger" title="Eliminar" disabled={deleteProducto.isLoading}>
                    <FontAwesomeIcon icon={faTrash} size="xs" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!filtered.length && <p className="state-empty">No se encontraron productos</p>}
    </div>
  );
};

export default ProductosTabla;
