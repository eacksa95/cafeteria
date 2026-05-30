import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const MOZO = ['mozo', 'recepcionista'];

// null en roles = visible para cualquier usuario autenticado
const NAV_LINKS = [
  { to: '/',             label: 'Inicio',    roles: null },
  { to: '/pedidosindex', label: 'Pedidos',   roles: null },
  { to: '/carrito',      label: 'Carrito',   roles: [...MOZO, 'admin'] },
  { to: '/productosindex', label: 'Productos', roles: [...MOZO, 'cocinero', 'admin'] },
  { to: '/admin',        label: 'Admin',     roles: ['admin'] },
];

const Navbar = ({ onLogout, role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  const visible = NAV_LINKS.filter(l => !l.roles || l.roles.includes(role));

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h4 className="navbar-brand">Coffee Shop</h4>

        <button className="navbar-toggle" onClick={() => setIsOpen(v => !v)}>
          <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
        </button>

        <div className={`navbar-collapse ${isOpen ? 'show' : ''}`}>
          <ul className="nav-list">
            {visible.map(l => (
              <li key={l.to} className="nav-item">
                <Link to={l.to} className="nav-link" onClick={close}>{l.label}</Link>
              </li>
            ))}
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
