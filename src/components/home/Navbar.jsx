import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h4 className="navbar-brand">Coffee Shop</h4>
        
        <button className="navbar-toggle" onClick={toggleMenu}>
          <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
        </button>

        <div className={`navbar-collapse ${isOpen ? 'show' : ''}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={toggleMenu}>Inicio</Link>
            </li>
            <li className="nav-item">
              <Link to="/pedidosindex" className="nav-link" onClick={toggleMenu}>Pedidos</Link>
            </li>
            <li className="nav-item">
              <Link to="/productosindex" className="nav-link" onClick={toggleMenu}>Productos</Link>
            </li>
            <li className="nav-item">
              <Link to="/carrito" className="nav-link" onClick={toggleMenu}>Carrito</Link>
            </li>
            <li className="nav-item">
              <Link to="/admin" className="nav-link" onClick={toggleMenu}>Admin</Link>
            </li>
          </ul>

          <button onClick={onLogout} className="btn btn-logout">
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;