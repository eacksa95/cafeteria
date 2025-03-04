import { useState, useEffect } from "react"


export const Dashboard = () => {
    const [valorInteresante, setvalorInteresante] = useState()

    useEffect(() => { setvalorInteresante("Es importante hacer deportes") }, [])

    return (
        <>
            <div className="titulo">
                <h2>reportes de ventas</h2>
            </div>
            <div className="contenido">
                <span>numeros sobre pedidos del dia, mes...</span>
            </div>
            <div className="graficos">
                <span>
                    alguna tabla dinamica con bootstrap
                </span>
            </div>

        </>
    )
}