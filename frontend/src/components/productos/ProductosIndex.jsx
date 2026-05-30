import { Link } from 'react-router-dom';

const ProductosIndex = ({ children, role }) => {
  const canCreate = role === 'admin' || role === 'mozo';
  return (
    <div className="page">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-stone-100 mb-3">Productos</h2>
        <div className="sub-nav">
          <Link to="/productosindex">Ver listado</Link>
          {canCreate && <Link to="/productosnuevo">+ Nuevo producto</Link>}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default ProductosIndex;
