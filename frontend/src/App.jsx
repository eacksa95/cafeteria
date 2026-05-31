import { useState, useEffect } from 'react'
import Login from './components/login/Login'
import Register from './components/login/Register'
import Home from './components/home/Home'
import Carta from './components/carta/Carta'
import jwtDecode from 'jwt-decode'

const IS_CARTA = window.location.pathname === '/carta'

function App() {
  const [userId, setUserId] = useState(null)
  const [showRegister, setShowRegister] = useState(false)

  useEffect(() => {
    if (!IS_CARTA) {
      const token = window.localStorage.getItem('accessToken')
      if (token) {
        try { setUserId(jwtDecode(JSON.parse(token)).user_id) } catch {}
      }
    }
  }, [])

  // Ruta pública para TV y pantallas de presentación
  if (IS_CARTA) return <Carta />

  const onLoginHandler = (userId) => {
    setUserId(userId)
    setShowRegister(false)
  }

  const onLogoutHandler = () => {
    setUserId(null)
    window.localStorage.removeItem('accessToken')
  }

  return (
    <div className="min-h-screen bg-stone-950">
      {userId ? (
        <Home onLogout={onLogoutHandler} userId={userId} />
      ) : showRegister ? (
        <Register
          onBack={() => setShowRegister(false)}
          onRegistered={() => setShowRegister(false)}
        />
      ) : (
        <Login
          onLogin={onLoginHandler}
          onRegister={() => setShowRegister(true)}
        />
      )}
    </div>
  )
}

export default App
