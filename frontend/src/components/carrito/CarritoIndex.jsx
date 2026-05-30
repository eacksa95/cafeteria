import { useState } from 'react';
import { Carrito } from './Carrito';
import { ListaProductos } from './ListaProductos';

export const CarritoIndex = ({ setMensaje }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [countProducts, setCountProducts] = useState(0);

  const pedidoNuevo = () => setMensaje('Pedido enviado a la cocina ✓');

  return (
    <div className="page">
      <h2 className="text-xl font-bold text-stone-100 mb-4">Carrito de Compras</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ListaProductos
            allProducts={allProducts} setAllProducts={setAllProducts}
            total={total} setTotal={setTotal}
            countProducts={countProducts} setCountProducts={setCountProducts}
          />
        </div>
        <div>
          <Carrito
            pedidoNuevo={pedidoNuevo}
            allProducts={allProducts} setAllProducts={setAllProducts}
            total={total} setTotal={setTotal}
            countProducts={countProducts} setCountProducts={setCountProducts}
          />
        </div>
      </div>
    </div>
  );
};
