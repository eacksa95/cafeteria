import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPen, faMagnifyingGlass, faXmark, faEyeSlash, faEye,
  faPlus, faChevronLeft, faChevronRight, faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { useProductos, useDarBajaProducto, useDeleteProducto } from '../../api/queries';
import { fmtPrecio } from '../../utils/format';
import ProductosNuevoModal from './ProductosNuevoModal';

const PAGE_SIZE = 25;
const CAT_EMOJI = { 1: '☕', 2: '🥤', 3: '🥐', 4: '🍟', 5: '🍽️', 6: '🍰' };

const ProductosTabla = ({ setMensaje, role }) => {
  const [search,       setSearch]       = useState('');
  const [selected,     setSelected]     = useState(null);
  const [page,         setPage]         = useState(1);
  const [showModal,    setShowModal]    = useState(false);
  const [mostrarBajas, setMostrarBajas] = useState(false);

  const { data: productos, isLoading, error } = useProductos();
  const darBaja        = useDarBajaProducto();
  const deleteProducto = useDeleteProducto();
  const navigate       = useNavigate();
  const canCreate      = role === 'admin' || role === 'mozo';

  const toggleDisponible = async () => {
    if (!selected) return;
    const nuevoEstado = !selected.disponible;
    if (!window.confirm(`¿${nuevoEstado ? 'Reactivar' : 'Dar de baja'} "${selected.nombre}"?`)) return;
    try {
      await darBaja.mutateAsync({ id: selected.id, disponible: nuevoEstado });
      setMensaje(`"${selected.nombre}" ${nuevoEstado ? 'reactivado' : 'dado de baja'}`);
      setSelected(null);
    } catch { setMensaje('Error al cambiar disponibilidad'); }
  };

  const onDelete = async () => {
    if (!selected) return;
    if (!window.confirm(`¿Eliminar "${selected.nombre}"?`)) return;
    try {
      await deleteProducto.mutateAsync(selected.id);
      setMensaje('Producto eliminado');
      setSelected(null);
    } catch { setMensaje('Error al eliminar'); }
  };

  const selectRow = p => setSelected(prev => prev?.id === p.id ? null : p);

  if (isLoading) return <p className="state-loading">Cargando productos...</p>;
  if (error)    return <p className="state-error">Error al cargar productos</p>;

  const bajasCount = (productos || []).filter(p => p.disponible === false).length;

  const filtered = (productos || []).filter(p => {
    const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase());
    const matchEstado = mostrarBajas ? true : p.disponible !== false;
    return matchSearch && matchEstado;
  });

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged       = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const handleSearch = val => { setSearch(val); setPage(1); };

  return (
    <div className="card">

      {/* ── Barra superior fija ── */}
      <div className="sticky top-0 bg-white z-10 pb-3 mb-1 border-b border-amber-50">
        <div className="flex items-center gap-2 flex-wrap">

          {/* Buscador */}
          <div className="relative flex-1 min-w-[180px]">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs" />
            <input
              className="input-base pl-8 py-1.5 text-sm"
              placeholder="Buscar producto..."
              value={search}
              onChange={e => handleSearch(e.target.value)}
            />
          </div>

          {/* Toggle bajas */}
          <button
            onClick={() => setMostrarBajas(v => !v)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border transition-colors ${
              mostrarBajas ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-stone-50 text-stone-500 border-stone-200 hover:border-stone-300'
            }`}
          >
            <FontAwesomeIcon icon={mostrarBajas ? faEye : faEyeSlash} size="xs" />
            Bajas {bajasCount > 0 && <span className="text-stone-400">({bajasCount})</span>}
          </button>

          {/* Acciones de fila seleccionada */}
          {selected && (
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
              <span className={`text-xs font-semibold truncate max-w-[110px] ${selected.disponible !== false ? 'text-amber-700' : 'text-stone-400 line-through'}`}>
                {selected.nombre}
              </span>
              <button onClick={() => navigate(`/productosmodificar/${selected.id}`)}
                className="btn-secondary flex items-center gap-1 py-1 px-2 text-xs">
                <FontAwesomeIcon icon={faPen} size="xs" /> Editar
              </button>
              <button onClick={toggleDisponible} disabled={darBaja.isPending}
                title={selected.disponible !== false ? 'Dar de baja' : 'Reactivar'}
                className="btn-secondary flex items-center gap-1 py-1 px-2 text-xs">
                <FontAwesomeIcon icon={selected.disponible !== false ? faEyeSlash : faEye} size="xs" />
                {selected.disponible !== false ? 'Baja' : 'Activar'}
              </button>
              {role === 'admin' && (
                <button onClick={onDelete} className="btn-danger p-1.5" disabled={deleteProducto.isLoading} title="Eliminar">
                  <FontAwesomeIcon icon={faTrash} size="xs" />
                </button>
              )}
              <button onClick={() => setSelected(null)} className="text-stone-400 hover:text-stone-600 p-1 transition-colors">
                <FontAwesomeIcon icon={faXmark} size="xs" />
              </button>
            </div>
          )}

          {!selected && <p className="text-stone-400 text-xs hidden sm:block">Clic en una fila para seleccionar</p>}

          {/* Botón nuevo → abre modal */}
          {canCreate && (
            <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-1.5 flex-shrink-0">
              <FontAwesomeIcon icon={faPlus} size="xs" /> Nuevo
            </button>
          )}
        </div>

        <p className="text-[10px] text-stone-400 mt-1.5">
          {filtered.length} producto{filtered.length !== 1 ? 's' : ''}
          {filtered.length > PAGE_SIZE && ` · Página ${currentPage} de ${totalPages}`}
        </p>
      </div>

      {/* ── Tabla ── */}
      <div className="overflow-x-auto">
        <table className="table-base w-full">
          <thead>
            <tr>
              <th className="w-8">#</th>
              <th>Nombre</th>
              <th className="w-28">Precio</th>
              <th className="w-12 hidden sm:table-cell">Cat.</th>
              <th className="w-12 hidden sm:table-cell">Img</th>
            </tr>
          </thead>
          <tbody>
            {paged.map(p => (
              <tr key={p.id} onClick={() => selectRow(p)}
                className={`cursor-pointer transition-colors ${
                  selected?.id === p.id ? 'bg-amber-100 border-l-2 border-l-amber-500' :
                  p.disponible === false ? 'opacity-40 hover:opacity-60 hover:bg-stone-50' :
                  'hover:bg-amber-50/60'
                }`}
              >
                <td className="text-stone-400 text-xs">{p.id}</td>
                <td className={`font-medium ${p.disponible === false ? 'text-stone-400 line-through' : 'text-stone-800'}`}>
                  {p.nombre}
                </td>
                <td className="text-amber-700 font-semibold tabular-nums">{fmtPrecio(p.precio)}</td>
                <td className="hidden sm:table-cell text-center">
                  <span>{CAT_EMOJI[p.categoria_id] || '🍽️'}</span>
                </td>
                <td className="hidden sm:table-cell">
                  {p.img ? (
                    <img src={p.img} alt={p.nombre} className="w-8 h-8 rounded object-cover border border-amber-100"
                      onError={e => { e.target.style.display = 'none'; }} />
                  ) : <span className="text-stone-300 text-xs">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!paged.length && <p className="state-empty">No se encontraron productos</p>}

      {/* ── Paginación ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-amber-50">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
            className="btn-secondary flex items-center gap-1 py-1 px-2 text-xs disabled:opacity-40">
            <FontAwesomeIcon icon={faChevronLeft} size="xs" /> Anterior
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(n => n === 1 || n === totalPages || Math.abs(n - currentPage) <= 1)
              .reduce((acc, n, idx, arr) => { if (idx > 0 && n - arr[idx - 1] > 1) acc.push('…'); acc.push(n); return acc; }, [])
              .map((n, i) => n === '…'
                ? <span key={`e-${i}`} className="px-1 text-stone-400 text-xs">…</span>
                : <button key={n} onClick={() => setPage(n)}
                    className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${currentPage === n ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'}`}>
                    {n}
                  </button>
              )}
          </div>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
            className="btn-secondary flex items-center gap-1 py-1 px-2 text-xs disabled:opacity-40">
            Siguiente <FontAwesomeIcon icon={faChevronRight} size="xs" />
          </button>
        </div>
      )}

      {showModal && (
        <ProductosNuevoModal role={role} onClose={() => setShowModal(false)} onCreated={() => setMensaje('Producto creado ✓')} />
      )}
    </div>
  );
};

export default ProductosTabla;
