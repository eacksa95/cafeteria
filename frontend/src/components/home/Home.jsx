import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
//Origen de los Datos QUERY
import { useUser } from '../../api/queries';
//estilos
import '../../estilos/home.css';
//componentes de Home
import Navbar from './Navbar';
import { Foo } from './Foo';
import DropdownMenu from './DropdownMenu';
import { ProtectedRoute } from '../ProtectedRoute';
//componentes de rutas
import { Inicio } from './Inicio';
import NoAuth from '../info/NoAuth';
import AdminIndex from '../admin/AdminIndex';
import Perfil from '../admin/Perfil';
import UsuariosNuevo from '../admin/UsuariosNuevo';
import UsuariosModificar from '../admin/UsuariosModificar';
import { CarritoIndex } from '../carrito/CarritoIndex';
import PedidosIndex from '../pedidos/PedidosIndex';
import PedidosListos from '../pedidos/PedidosListos';
import PedidosPendientes from '../pedidos/PedidosPendientes';
import ProductosIndex from '../productos/ProductosIndex';
import ProductosTabla from '../productos/ProductosTabla';
import ProductosNuevo from '../productos/ProductosNuevo';
import ProductosModificar from '../productos/ProductosModificar';
import UsuariosTabla from '../admin/UsuariosTabla';

/**Componente principal de la aplicacion
 * Desde aqui se pueden acceder a todas las rutas
*/
const Home = ({ onLogout, userId }) => {
  const { data: user, isLoading } = useUser(userId);
  const [mensaje, setMensaje] = useState('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  
  const role = user?.group_name;

  useEffect(() => {
    if (mensaje) {
      setMostrarMensaje(true);
      setTimeout(() => {
        setMensaje('');
        setMostrarMensaje(false);
      }, 3000);
    }
  }, [mensaje]);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="home-container">
      <BrowserRouter>
        <Navbar onLogout={onLogout} role={role} />

        <main className="main-content">
          <div className="container">
            <div className="page-header">

              <div className="mensaje-container">
                  {mostrarMensaje && <span className="mensaje">{mensaje}</span>}
              </div>
           </div>

          <div className="page-container">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/noauth" element={
              <Inicio>
                <NoAuth setMensaje={setMensaje} />
              </Inicio>
            } />
            
            <Route element={<ProtectedRoute isAllowed={!!user} />}>
              <Route path="/pedidosindex" element={
                <PedidosIndex>
                  <PedidosPendientes setMensaje={setMensaje} />
                </PedidosIndex>
              } />
              <Route path="/pedidospendientes" element={
                <PedidosIndex>
                  <PedidosPendientes setMensaje={setMensaje} />
                </PedidosIndex>
              } />
              <Route path="/pedidoslistos" element={
                <PedidosIndex>
                  <PedidosListos setMensaje={setMensaje} />
                </PedidosIndex>
              } />
            </Route>

            <Route element={
              <ProtectedRoute 
                redirectTo="/noauth" 
                isAllowed={!!user && (role?.includes("recepcionista") || role?.includes("mozo") || role?.includes("admin"))}
              />
            }>
              <Route path="/productosindex" element={
                <ProductosIndex>
                  <ProductosTabla setMensaje={setMensaje} />
                </ProductosIndex>
              } />
              <Route path="/productosnuevo" element={
                <ProductosIndex>
                  <ProductosNuevo setMensaje={setMensaje} />
                </ProductosIndex>
              } />
              <Route path="/productosmodificar/:id" element={
                <ProductosIndex>
                  <ProductosModificar setMensaje={setMensaje} />
                </ProductosIndex>
              } />
              <Route path="/carrito" element={
                <CarritoIndex setMensaje={setMensaje} />
              } />
            </Route>

            <Route element={
              <ProtectedRoute 
                redirectTo="/noauth" 
                isAllowed={!!user && role?.includes("admin")} 
              />
            }>
              <Route path="/admin" element={
                <AdminIndex>
                  <Perfil userId={userId} />
                </AdminIndex>
              } />
              <Route path="/usuariostabla" element={
                <AdminIndex>
                  <UsuariosTabla setMensaje={setMensaje} />
                </AdminIndex>
              } />
              <Route path="/usuariosnuevo" element={
                <AdminIndex>
                  <UsuariosNuevo setMensaje={setMensaje} />
                </AdminIndex>
              } />
              <Route path="/usuariosmodificar/:id" element={
                <AdminIndex>
                  <UsuariosModificar setMensaje={setMensaje} />
                </AdminIndex>
              } />
            </Route>
          </Routes>
          </div>
          </div>
        </main>

        <footer className="footer">
        <Foo />
        </footer>
      </BrowserRouter>
    </div>
  );
};

export default Home;