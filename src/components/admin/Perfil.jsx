import { useEffect, useState } from "react"
import { Table } from "react-bootstrap"
import { useNavigate } from 'react-router-dom';

//estilos
import '../../estilos/admin.css'

//iconos FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPaintBrush } from '@fortawesome/free-solid-svg-icons';


const Perfil = ({ userId }) => {
    const [user, setUser] = useState([])
    const navigate = useNavigate();

    // datos de usuario
    useEffect(() => {
        fetch('http://localhost:8000/users/' + userId, {
            method: 'GET' /* or POST/PUT/PATCH/DELETE */,
            headers: {
                Authorization: `Bearer ${JSON.parse(window.localStorage.getItem('accessToken'))}`,
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((userData) => {
                setUser(userData)
            })
    }, [])

    const onModificarUsuario = (user) => {
        navigate(`/usuariosmodificar/${user.id}`);
    }



    return (<>
        <div className="contenedorTabla">
            <div className="titulo">
                Datos del Usuario
            </div>
            <Table striped bordered hover className='Tabla'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Usuario</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>E-mail</th>
                        <th>Editar</th>
                    </tr>
                </thead>
                <tbody>
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.first_name}</td>
                        <td> {user.last_name}</td>
                        <td>{user.email}</td>
                        <td>
                            <button className='botonProcesar' onClick={() => { onModificarUsuario(user) }}>
                                <FontAwesomeIcon icon={faPaintBrush} />
                            </button>
                        </td>

                    </tr>
                </tbody>
            </Table>
        </div>
    </>)
}

export default Perfil