import { useState } from "react";
import { Carrito } from "./Carrito";
import { ListaProductos } from "./ListaProductos";
import '../../estilos/carrito.css';

export const CarritoIndex = ({ setMensaje }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [countProducts, setCountProducts] = useState(0);

  const pedidoNuevo = () => {
    setMensaje("Pedido enviado a la cocina");
  };

  return (
    <div className="carrito-container">
      <div className="carrito-wrapper">
        <Carrito
          pedidoNuevo={pedidoNuevo}
          allProducts={allProducts}
          setAllProducts={setAllProducts}
          total={total}
          setTotal={setTotal}
          countProducts={countProducts}
          setCountProducts={setCountProducts}
        />
        <ListaProductos
          allProducts={allProducts}
          setAllProducts={setAllProducts}
          total={total}
          setTotal={setTotal}
          countProducts={countProducts}
          setCountProducts={setCountProducts}
        />
      </div>
    </div>
  );
};