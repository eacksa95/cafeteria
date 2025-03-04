import { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="dropdown-container mb-3">
      <Dropdown show={isOpen} onToggle={() => setIsOpen(!isOpen)}>
        <Dropdown.Toggle 
          variant="secondary" 
          id="dropdown-menu-toggle" 
          className="btn btn-secondary"
        >
          <i className="bi bi-three-dots-vertical"></i>
        </Dropdown.Toggle>
        
        <Dropdown.Menu className="dropdown-menu mt-1">
          <Dropdown.Item className="dropdown-item py-2">
            <Link to="/pedidoslistos" className="nav-link">
              Pedidos Listos
            </Link>
          </Dropdown.Item>
          <Dropdown.Item className="dropdown-item py-2">
            <Link to="/pedidospendientes" className="nav-link">
              Pedidos pendientes
            </Link>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default DropdownMenu;