import { Link } from "react-router-dom"
import '../../estilos/pedidos.css'

const PedidosIndex = ({ children }) => {
  return (
    <div className="pedidos-container">
      <div className="pedidos-header">
        <h2 className="pedidos-title">Pedidos</h2>
        <div className="pedidos-nav">
          <Link to="/pedidoslistos" className="pedidos-link">
            Pedidos Listos
          </Link>
          <Link to="/pedidospendientes" className="pedidos-link">
            Pedidos Pendientes
          </Link>
        </div>
      </div>
      
      <div className="pedidos-content">
        {children}
      </div>
    </div>
  )
}

export default PedidosIndex