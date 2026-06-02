import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useUser } from '../../api/queries';
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import { Foo } from './Foo';
import { ProtectedRoute } from '../ProtectedRoute';
import { Inicio } from './Inicio';
import NoAuth from '../info/NoAuth';
import AdminIndex from '../admin/AdminIndex';
import Perfil from '../admin/Perfil';
import UsuariosNuevo from '../admin/UsuariosNuevo';
import UsuariosModificar from '../admin/UsuariosModificar';
import UsuariosTabla from '../admin/UsuariosTabla';
import { CarritoIndex } from '../carrito/CarritoIndex';
import Pedidos from '../pedidos/Pedidos';
import ProductosIndex from '../productos/ProductosIndex';
import ProductosTabla from '../productos/ProductosTabla';
import ProductosNuevo from '../productos/ProductosNuevo';
import ProductosModificar from '../productos/ProductosModificar';

// Mapa de rutas → título visible en header
const TITLES = {
  '/':               null,
  '/pedidosindex':   'Pedidos',
  '/pedidospendientes': 'Pedidos',
  '/pedidoslistos':  'Pedidos',
  '/carrito':        'Carrito',
  '/productosindex': 'Productos',
  '/productosnuevo': 'Nuevo producto',
  '/admin':          'Administración',
  '/usuariostabla':  'Usuarios',
  '/usuariosnuevo':  'Nuevo usuario',
};

function AppRoutes({ userId, role, username, setMensaje, onLogout, mostrarMensaje, mensaje }) {
  const { pathname } = useLocation();
  const title = TITLES[pathname] ?? TITLES[Object.keys(TITLES).find(k => pathname.startsWith(k) && k !== '/') || ''];

  const isAdmin        = role === 'admin';
  const canViewProducts = ['mozo', 'cocinero', 'admin'].includes(role);
  const canViewCarrito  = ['mozo', 'admin'].includes(role);

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
      <Navbar onLogout={onLogout} role={role} username={username} title={title} />

      {mostrarMensaje && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-amber-800 text-amber-50 px-4 py-2 rounded-lg text-sm shadow-lg border border-amber-700">
          {mensaje}
        </div>
      )}

      <main className="flex-1 pb-16 md:pb-0 overflow-auto">
        <Routes>
          <Route path="/" element={<Inicio role={role} username={username} />} />
          <Route path="/noauth" element={<NoAuth />} />

          <Route element={<ProtectedRoute isAllowed={!!role} />}>
            <Route path="/pedidosindex"    element={<Pedidos setMensaje={setMensaje} userId={userId} />} />
            <Route path="/pedidospendientes" element={<Pedidos setMensaje={setMensaje} userId={userId} />} />
            <Route path="/pedidoslistos"   element={<Pedidos setMensaje={setMensaje} userId={userId} />} />
          </Route>

          <Route element={<ProtectedRoute redirectTo="/noauth" isAllowed={!!role && canViewProducts} />}>
            <Route path="/productosindex" element={<ProductosIndex role={role}><ProductosTabla setMensaje={setMensaje} /></ProductosIndex>} />
            <Route path="/productosnuevo" element={<ProductosIndex role={role}><ProductosNuevo setMensaje={setMensaje} role={role} /></ProductosIndex>} />
            <Route path="/productosmodificar/:id" element={<ProductosIndex role={role}><ProductosModificar setMensaje={setMensaje} role={role} /></ProductosIndex>} />
          </Route>

          <Route element={<ProtectedRoute redirectTo="/noauth" isAllowed={!!role && canViewCarrito} />}>
            <Route path="/carrito" element={<CarritoIndex setMensaje={setMensaje} userId={userId} />} />
          </Route>

          <Route element={<ProtectedRoute redirectTo="/noauth" isAllowed={!!role && isAdmin} />}>
            <Route path="/admin"               element={<AdminIndex><Perfil userId={userId} /></AdminIndex>} />
            <Route path="/usuariostabla"        element={<AdminIndex><UsuariosTabla setMensaje={setMensaje} /></AdminIndex>} />
            <Route path="/usuariosnuevo"        element={<AdminIndex><UsuariosNuevo setMensaje={setMensaje} /></AdminIndex>} />
            <Route path="/usuariosmodificar/:id" element={<AdminIndex><UsuariosModificar setMensaje={setMensaje} /></AdminIndex>} />
          </Route>
        </Routes>
      </main>

      <BottomNav role={role} />
      <Foo />
    </div>
  );
}

const Home = ({ onLogout, userId }) => {
  const { data: user, isLoading } = useUser(userId);
  const [mensaje, setMensaje]     = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);

  const role     = user?.group_name;
  const username = user?.username;

  useEffect(() => {
    if (mensaje) {
      setMostrarMensaje(true);
      const t = setTimeout(() => { setMensaje(''); setMostrarMensaje(false); }, 3000);
      return () => clearTimeout(t);
    }
  }, [mensaje]);

  if (isLoading) return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center">
      <p className="text-amber-600 animate-pulse text-sm">Cargando...</p>
    </div>
  );

  return (
    <BrowserRouter>
      <AppRoutes
        userId={userId} role={role} username={username}
        setMensaje={setMensaje} onLogout={onLogout}
        mostrarMensaje={mostrarMensaje} mensaje={mensaje}
      />
    </BrowserRouter>
  );
};

export default Home;
