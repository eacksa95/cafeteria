import '../../estilos/productos.css'
import { Link } from 'react-router-dom'

const ProductosIndex = ({ children }) => {
    return (
        <div className="productos-container">
        <div className="productos-header">
          <h2 className="productos-title">Productos</h2>
          <div className="productos-nav">
            <Link to="/productosnuevo" className="productos-link">
              Nuevo Producto
            </Link>
            <Link to="/productosindex" className="productos-link">
              Ver Listado
            </Link>
          </div>
        </div>
        
        <div className="productos-content">
          {children}
        </div>
      </div>
    )

}
export default ProductosIndex