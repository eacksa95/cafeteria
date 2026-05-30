import { useState, useEffect } from 'react'
import './estilos/app.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import Login from './components/login/Login'
import Register from './components/login/Register'
import Home from './components/home/Home'
import jwtDecode from 'jwt-decode'

function App() {
  const [userId, setUserId] = useState(null)
  const [showRegister, setShowRegister] = useState(false)

  useEffect(() => {
    const token = window.localStorage.getItem('accessToken')
    if (token) {
      setUserId(jwtDecode(JSON.parse(token)).user_id)
    }
  }, [])

  const onLoginHandler = (userId) => {
    setUserId(userId)
    setShowRegister(false)
  }

  const onLogoutHandler = () => {
    setUserId(null)
    window.localStorage.removeItem('accessToken')
  }

  return (
    <div className="app-wrapper">
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
