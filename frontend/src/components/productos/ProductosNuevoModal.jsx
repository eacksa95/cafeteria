import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faLock } from '@fortawesome/free-solid-svg-icons';
import { useCreateProducto } from '../../api/queries';
import CloudinaryUpload from '../common/CloudinaryUpload';

const CATS = [
  { value: 'cafe',     label: 'Cafés y calientes' },
  { value: 'bebida',   label: 'Bebidas frías' },
  { value: 'desayuno', label: 'Desayunos' },
  { value: 'comida',   label: 'Comidas' },
  { value: 'postre',   label: 'Postres' },
  { value: 'otro',     label: 'Otro' },
];

const EMPTY = { nombre: '', precio: '', cantidad: 1, img: '', categoria: 'otro', categoria_id: 1 };

const CATID = { cafe: 1, bebida: 2, desayuno: 3, comida: 4, postre: 5, otro: 6 };

export default function ProductosNuevoModal({ role, onClose, onCreated }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const createProducto = useCreateProducto();
  const isAdmin = role === 'admin';

  const handle = e => {
    const { name, value } = e.target;
    setForm(p => ({
      ...p,
      [name]: value,
      // Sincronizar categoria_id cuando cambia categoria
      ...(name === 'categoria' ? { categoria_id: CATID[value] || 1 } : {}),
    }));
  };

  const submit = async e => {
    e.preventDefault();
    setError('');
    if (!form.nombre.trim()) { setError('Ingresá el nombre del producto'); return; }
    if (!form.precio || Number(form.precio) <= 0) { setError('Ingresá un precio válido'); return; }
    try {
      await createProducto.mutateAsync(form);
      onCreated?.();
      onClose();
    } catch (err) {
      setError('Error al crear el producto. Intentá de nuevo.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div
        className="relative bg-white rounded-2xl border border-amber-100 shadow-2xl w-full max-w-md max-h-[90dvh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-amber-100">
          <h2 className="font-bold text-stone-800 text-base">Nuevo Producto</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto flex-1 px-5 py-4">
          {error && (
            <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg px-3 py-2 text-sm mb-4">
              {error}
            </div>
          )}

          <form id="nuevo-form" onSubmit={submit} className="space-y-3">
            <input
              className="input-base"
              name="nombre"
              placeholder="Nombre del producto *"
              required
              value={form.nombre}
              onChange={handle}
            />

            <div className="relative">
              <input
                className={`input-base ${!isAdmin ? 'opacity-60 cursor-not-allowed' : ''}`}
                name="precio"
                placeholder="Precio (Gs.) *"
                type="number"
                step="1"
                min="0"
                required
                value={form.precio}
                onChange={handle}
                disabled={!isAdmin}
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
          </form>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 py-4 border-t border-amber-100">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">
            Cancelar
          </button>
          <button
            type="submit"
            form="nuevo-form"
            className="btn-primary flex-1"
            disabled={createProducto.isLoading}
          >
            {createProducto.isLoading ? 'Guardando...' : 'Crear Producto'}
          </button>
        </div>
      </div>
    </div>
  );
}
