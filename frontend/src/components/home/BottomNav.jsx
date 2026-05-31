import { useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faList, faShoppingCart, faBoxes, faGear } from '@fortawesome/free-solid-svg-icons';

const ITEMS = [
  { to: '/',               icon: faHouse,        label: 'Inicio',   roles: null },
  { to: '/pedidosindex',   icon: faList,         label: 'Pedidos',  roles: null },
  { to: '/carrito',        icon: faShoppingCart, label: 'Carrito',  roles: ['mozo', 'admin'] },
  { to: '/productosindex', icon: faBoxes,        label: 'Productos',roles: ['mozo', 'cocinero', 'admin'] },
  { to: '/admin',          icon: faGear,         label: 'Admin',    roles: ['admin'] },
];

const BottomNav = ({ role }) => {
  const { pathname } = useLocation();
  const visible = ITEMS.filter(i => !i.roles || i.roles.includes(role));

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-amber-200 shadow-lg">
      <div className="flex">
        {visible.map(item => {
          const active = pathname === item.to || (item.to !== '/' && pathname.startsWith(item.to));
          return (
            <Link key={item.to} to={item.to}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-colors ${
                active ? 'text-amber-700' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              <div className={`p-1.5 rounded-xl ${active ? 'bg-amber-100' : ''}`}>
                <FontAwesomeIcon icon={item.icon} className="text-base" />
              </div>
              <span className="text-[9px] font-medium leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
