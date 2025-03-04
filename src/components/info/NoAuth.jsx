import { useEffect } from "react";

const NoAuth = ({setMensaje}) => {
    useEffect( () => {setMensaje("Acceso Denegado")}, [])
    return(
    <div className="About">
        <div className="titulo">
                <h4>Acceso Denegado</h4>
        </div>
        <div className="contenido">
                <p>
                    <span></span>
                    
                </p>        
        </div>    
    </div>
     )    
}
export default NoAuth;