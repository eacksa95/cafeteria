import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useProductos } from '../../api/queries';

const IMG_FALLBACK = 'https://png.pngtree.com/template/20190323/ourmid/pngtree-coffee-logo-design-image_82183.jpg';

export const ListaProductos = ({ allProducts, setAllProducts, countProducts, setCountProducts, total, setTotal }) => {
  const [search, setSearch] = useState('');
  const { data: productos, isLoading, error } = useProductos();

  const onAdd = producto => {
    if (allProducts.find(item => item.id === producto.id)) {
      setAllProducts(allProducts.map(item => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item));
    } else {
      setAllProducts([...allProducts, { ...producto, cantidad: 1 }]);
    }
    setTotal(total + Number(producto.precio));
    setCountProducts(countProducts + 1);
  };

  if (isLoading) return <p className="state-loading">Cargando productos...</p>;
  if (error)    return <p className="state-error">Error al cargar productos</p>;

  const filtered = productos?.filter(p => p.nombre.toLowerCase().includes(search.toLowerCase())) || [];

  return (
    <div>
      <div className="relative mb-3">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 text-xs" />
        <input className="input-base pl-8 py-1.5 text-sm" placeholder="Buscar producto..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {filtered.map(p => (
          <div key={p.id} className="bg-stone-900 rounded-xl border border-stone-800 overflow-hidden group">
            <div className="relative">
              <img src={p.img || IMG_FALLBACK} alt={p.nombre} className="w-full h-28 object-cover"
                onError={e => { e.target.src = IMG_FALLBACK; }} />
              <button onClick={() => onAdd(p)}
                className="absolute inset-0 bg-stone-950/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <div className="bg-amber-600 text-white rounded-full p-2">
                  <FontAwesomeIcon icon={faPlus} />
                </div>
              </button>
            </div>
            <div className="p-2.5">
              <p className="text-stone-100 text-sm font-medium truncate">{p.nombre}</p>
              <p className="text-amber-400 text-sm font-bold">${Number(p.precio).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      {!filtered.length && <p className="state-empty">No se encontraron productos</p>}
    </div>
  );
};
