import { useState, useEffect } from 'react'
import Login from './components/login/Login'
import Register from './components/login/Register'
import Home from './components/home/Home'
import CartaMozo from './components/carta/CartaMozo'
import CartaTv1 from './components/carta/CartaTv1'
import CartaTv2 from './components/carta/CartaTv2'
import jwtDecode from 'jwt-decode'

const PATH = window.location.pathname

function App() {
  const [userId, setUserId] = useState(null)
  const [showRegister, setShowRegister] = useState(false)

  useEffect(() => {
    if (!['/carta', '/cartatv1', '/cartatv2'].includes(PATH)) {
      const token = window.localStorage.getItem('accessToken')
      if (token) {
        try { setUserId(jwtDecode(JSON.parse(token)).user_id) } catch {}
      }
    }
  }, [])

  // Rutas públicas (sin autenticación)
  if (PATH === '/carta')    return <CartaMozo />
  if (PATH === '/cartatv1') return <CartaTv1 />
  if (PATH === '/cartatv2') return <CartaTv2 />

  const onLoginHandler = (userId) => { setUserId(userId); setShowRegister(false) }
  const onLogoutHandler = () => { setUserId(null); window.localStorage.removeItem('accessToken') }

  return (
    <div className="min-h-screen bg-stone-950">
      {userId ? (
        <Home onLogout={onLogoutHandler} userId={userId} />
      ) : showRegister ? (
        <Register onBack={() => setShowRegister(false)} onRegistered={() => setShowRegister(false)} />
      ) : (
        <Login onLogin={onLoginHandler} onRegister={() => setShowRegister(true)} />
      )}
    </div>
  )
}

export default App
