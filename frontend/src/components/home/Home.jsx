import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useUser } from '../../api/queries';
import Navbar from './Navbar';
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

const Home = ({ onLogout, userId }) => {
  const { data: user, isLoading } = useUser(userId);
  const [mensaje, setMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);

  const role = user?.group_name;

  useEffect(() => {
    if (mensaje) {
      setMostrarMensaje(true);
      const t = setTimeout(() => { setMensaje(''); setMostrarMensaje(false); }, 3000);
      return () => clearTimeout(t);
    }
  }, [mensaje]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <p className="text-stone-400 animate-pulse">Cargando...</p>
      </div>
    );
  }

  const isAdmin        = role === 'admin';
  const canViewProducts = ['mozo', 'cocinero', 'admin'].includes(role);
  const canViewCarrito  = ['mozo', 'admin'].includes(role);

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col">
      <BrowserRouter>
        <Navbar onLogout={onLogout} role={role} username={user?.username} />

        {mostrarMensaje && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-stone-800 text-stone-100 px-4 py-2 rounded-lg text-sm border border-stone-600 shadow-lg">
            {mensaje}
          </div>
        )}

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Inicio role={role} username={user?.username} />} />
            <Route path="/noauth" element={<NoAuth />} />

            {/* Todos los autenticados */}
            <Route element={<ProtectedRoute isAllowed={!!user} />}>
              <Route path="/pedidosindex"    element={<Pedidos setMensaje={setMensaje} />} />
              <Route path="/pedidospendientes" element={<Pedidos setMensaje={setMensaje} />} />
              <Route path="/pedidoslistos"   element={<Pedidos setMensaje={setMensaje} />} />
            </Route>

            {/* Mozo + Cocinero + Admin — Productos */}
            <Route element={<ProtectedRoute redirectTo="/noauth" isAllowed={!!user && canViewProducts} />}>
              <Route path="/productosindex" element={<ProductosIndex role={role}><ProductosTabla setMensaje={setMensaje} /></ProductosIndex>} />
              <Route path="/productosnuevo" element={<ProductosIndex role={role}><ProductosNuevo setMensaje={setMensaje} role={role} /></ProductosIndex>} />
              <Route path="/productosmodificar/:id" element={<ProductosIndex role={role}><ProductosModificar setMensaje={setMensaje} role={role} /></ProductosIndex>} />
            </Route>

            {/* Mozo + Admin — Carrito */}
            <Route element={<ProtectedRoute redirectTo="/noauth" isAllowed={!!user && canViewCarrito} />}>
              <Route path="/carrito" element={<CarritoIndex setMensaje={setMensaje} />} />
            </Route>

            {/* Solo Admin */}
            <Route element={<ProtectedRoute redirectTo="/noauth" isAllowed={!!user && isAdmin} />}>
              <Route path="/admin"               element={<AdminIndex><Perfil userId={userId} /></AdminIndex>} />
              <Route path="/usuariostabla"        element={<AdminIndex><UsuariosTabla setMensaje={setMensaje} /></AdminIndex>} />
              <Route path="/usuariosnuevo"        element={<AdminIndex><UsuariosNuevo setMensaje={setMensaje} /></AdminIndex>} />
              <Route path="/usuariosmodificar/:id" element={<AdminIndex><UsuariosModificar setMensaje={setMensaje} /></AdminIndex>} />
            </Route>
          </Routes>
        </main>

        <Foo />
      </BrowserRouter>
    </div>
  );
};

export default Home;
