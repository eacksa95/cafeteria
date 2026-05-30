import { Link } from 'react-router-dom';

const PedidosIndex = ({ children }) => (
  <div className="page">
    <div className="mb-4">
      <h2 className="text-xl font-bold text-stone-100 mb-3">Pedidos</h2>
      <div className="sub-nav">
        <Link to="/pedidospendientes">Pendientes</Link>
        <Link to="/pedidoslistos">Listos para entregar</Link>
      </div>
    </div>
    <div>{children}</div>
  </div>
);

export default PedidosIndex;
