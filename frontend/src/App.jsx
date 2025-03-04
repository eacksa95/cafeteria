import { useState, useEffect } from 'react'

//estilos
import './estilos/app.css'

//bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

//componentes
import Login from './components/login/Login'
import Home from './components/home/Home'
import jwtDecode from 'jwt-decode'

function App() {
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const token = window.localStorage.getItem('accessToken')
    if (token){
      setUserId(jwtDecode(JSON.parse(token)).user_id)
    }
  }, [])

  const onLoginHandler = (userId) => {
    console.log(userId)
    setUserId(userId)
  }

  const onLogoutHandler = () => {
    setUserId(null)
    //window.localStorage.removeAll()
    window.localStorage.removeItem('accessToken')
  }

  return (
    <div className="app-wrapper">
      {userId ? (
        <Home onLogout={onLogoutHandler} userId={userId} />
      ) : (
        <Login onLogin={onLoginHandler} />
      )}

    </div>
  )
}




export default App
