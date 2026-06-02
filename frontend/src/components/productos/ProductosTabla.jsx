import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faMagnifyingGlass, faXmark, faArrowDown, faArrowUp, faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { useProductos, useDarBajaProducto } from '../../api/queries';

const IMG_FALLBACK = 'https://png.pngtree.com/template/20190323/ourmid/pngtree-coffee-logo-design-image_82183.jpg';

const ProductosTabla = ({ setMensaje }) => {
  const [search,       setSearch]       = useState('');
  const [selected,     setSelected]     = useState(null);
  const [mostrarBajas, setMostrarBajas] = useState(false);

  const { data: productos, isLoading, error } = useProductos();
  const darBaja = useDarBajaProducto();
  const navigate = useNavigate();

  const toggleDisponible = async () => {
    if (!selected) return;
    const nuevoEstado = !selected.disponible;
    const accion = nuevoEstado ? 'reactivar' : 'dar de baja';
    if (!window.confirm(`¿${nuevoEstado ? 'Reactivar' : 'Dar de baja'} "${selected.nombre}"?`)) return;
    try {
      await darBaja.mutateAsync({ id: selected.id, disponible: nuevoEstado });
      setMensaje(`"${selected.nombre}" ${nuevoEstado ? 'reactivado' : 'dado de baja'}`);
      setSelected(null);
    } catch { setMensaje(`Error al ${accion}`); }
  };

  const selectRow = (p) => setSelected(prev => prev?.id === p.id ? null : p);

  if (isLoading) return <p className="state-loading">Cargando productos...</p>;
  if (error)    return <p className="state-error">Error al cargar productos</p>;

  const filtered = (productos || []).filter(p => {
    const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase());
    const matchEstado = mostrarBajas ? true : p.disponible !== false;
    return matchSearch && matchEstado;
  });

  const bajasCount = (productos || []).filter(p => p.disponible === false).length;

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

        {/* Toggle mostrar dados de baja */}
        <button
          onClick={() => setMostrarBajas(v => !v)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border transition-colors ${
            mostrarBajas
              ? 'bg-stone-700 text-stone-200 border-stone-600'
              : 'bg-stone-900 text-stone-500 border-stone-800 hover:border-stone-700'
          }`}
        >
          <FontAwesomeIcon icon={mostrarBajas ? faEye : faEyeSlash} size="xs" />
          Dados de baja {bajasCount > 0 && <span className="ml-0.5 text-stone-400">({bajasCount})</span>}
        </button>

        {/* Acciones de fila seleccionada */}
        {selected ? (
          <div className="flex items-center gap-2 bg-stone-800 rounded-lg px-3 py-1.5 border border-stone-700">
            <span className={`text-xs font-medium truncate max-w-[120px] ${selected.disponible !== false ? 'text-amber-400' : 'text-stone-500 line-through'}`}>
              {selected.nombre}
            </span>
            <button
              onClick={() => navigate(`/productosmodificar/${selected.id}`)}
              className="btn-secondary flex items-center gap-1.5 py-1 px-2 text-xs"
            >
              <FontAwesomeIcon icon={faPen} size="xs" /> Editar
            </button>
            <button
              onClick={toggleDisponible}
              disabled={darBaja.isPending}
              title={selected.disponible !== false ? 'Dar de baja' : 'Reactivar'}
              className={`flex items-center gap-1.5 py-1 px-2 rounded text-xs border transition-colors disabled:opacity-40 ${
                selected.disponible !== false
                  ? 'bg-red-900/30 text-red-400 border-red-800 hover:bg-red-900/60'
                  : 'bg-emerald-900/30 text-emerald-400 border-emerald-800 hover:bg-emerald-900/60'
              }`}
            >
              <FontAwesomeIcon icon={selected.disponible !== false ? faArrowDown : faArrowUp} size="xs" />
              {selected.disponible !== false ? 'Dar de baja' : 'Reactivar'}
            </button>
            <button onClick={() => setSelected(null)} className="text-stone-500 hover:text-stone-300 p-1" title="Deseleccionar">
              <FontAwesomeIcon icon={faXmark} size="xs" />
            </button>
          </div>
        ) : (
          <p className="text-stone-600 text-xs hidden sm:block">Hacé clic en una fila para seleccionar</p>
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
              <th>Estado</th>
              <th>Imagen</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const inactivo = p.disponible === false;
              return (
                <tr
                  key={p.id}
                  onClick={() => selectRow(p)}
                  className={`cursor-pointer transition-colors ${
                    selected?.id === p.id
                      ? 'bg-amber-900/20 border-l-2 border-l-amber-500'
                      : inactivo
                        ? 'opacity-40 hover:opacity-60 hover:bg-stone-800/40'
                        : 'hover:bg-stone-800/40'
                  }`}
                >
                  <td className="text-stone-500">{p.id}</td>
                  <td className={`font-medium ${inactivo ? 'text-stone-500 line-through' : 'text-stone-100'}`}>{p.nombre}</td>
                  <td className="text-amber-400 font-semibold">${Number(p.precio).toFixed(2)}</td>
                  <td>
                    {inactivo
                      ? <span className="px-2 py-0.5 rounded-full text-[10px] bg-stone-800 text-stone-500 border border-stone-700">Inactivo</span>
                      : <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-900/40 text-emerald-400 border border-emerald-800">Activo</span>
                    }
                  </td>
                  <td>
                    <img
                      src={p.img || IMG_FALLBACK}
                      alt={p.nombre}
                      className="w-8 h-8 rounded object-cover border border-stone-700"
                      onError={e => { e.target.src = IMG_FALLBACK; }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!filtered.length && <p className="state-empty">No se encontraron productos</p>}
    </div>
  );
};

export default ProductosTabla;
