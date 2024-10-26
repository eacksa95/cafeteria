import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faCoffee, faDollarSign } from '@fortawesome/free-solid-svg-icons';

const ProductosNuevo = ({ setMensaje }) => {
    const [producto, setProducto] = useState([]);
    const [productos, setProductos] = useState([]);
    const [id, setId] = useState();
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [cantidad, setCantidad] = useState(1);
    const [img, setImg] = useState('https://png.pngtree.com/template/20190323/ourmid/pngtree-coffee-logo-design-image_82183.jpg');
    const [actualizar, setActualizar] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        fetchProductos();
    }, []);

    useEffect(() => {
        fetchProductos();
    }, [actualizar]);

    useEffect(() => {
        obtenerIdMasAlto();
    }, [productos]);

    const fetchProductos = async () => {
        try {
            const response = await fetch('http://localhost:8000/productos', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${JSON.parse(window.localStorage.getItem('accessToken'))}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setProductos(data);
        } catch (error) {
            console.error('Error:', error);
            setMensaje('Error al cargar los productos');
        }
    };

    const obtenerIdMasAlto = () => {
        const idMasAlto = productos.reduce((maxId, producto) => {
            return producto.id > maxId ? producto.id : maxId;
        }, 0);
        setId(idMasAlto + 1);
        setCantidad(1);
    };

    const handleImageChange = (e) => {
        const url = e.target.value;
        setImg(url);
        setPreviewImage(url);
    };

    const onNuevoProducto = async (e) => {
        e.preventDefault();

        if (!nombre.trim()) {
            setMensaje("Por favor ingrese el nombre del producto");
            return;
        }
        if (!precio || precio <= 0) {
            setMensaje("Por favor ingrese un precio válido");
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/productos/', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${JSON.parse(window.localStorage.getItem('accessToken'))}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id,
                    nombre,
                    precio,
                    cantidad,
                    img
                }),
            });
            const data = await response.json();
            setProducto(data);
            setMensaje("Producto registrado exitosamente");
            setActualizar(!actualizar);
            
            // Limpiar formulario
            setNombre('');
            setPrecio('');
            setImg('https://png.pngtree.com/template/20190323/ourmid/pngtree-coffee-logo-design-image_82183.jpg');
            setPreviewImage(null);
        } catch (error) {
            console.error("Error:", error);
            setMensaje("Error al registrar el producto");
        }
    };

    return (
        <div className="producto-nuevo-container">
            <div className="producto-form-header">
                <h3>Nuevo Producto</h3>
                <p>Complete los datos del nuevo producto</p>
            </div>

            <div className="producto-form-content">
                <form onSubmit={onNuevoProducto} className="producto-form">
                    <div className="form-group">
                        <div className="input-icon">
                            <FontAwesomeIcon icon={faCoffee} className="icon" />
                            <input
                                className="form-input"
                                aria-label="Nombre del Producto"
                                placeholder="Nombre del Producto"
                                id="name"
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="input-icon">
                            <FontAwesomeIcon icon={faDollarSign} className="icon" />
                            <input
                                className="form-input"
                                aria-label="Precio"
                                placeholder="Precio"
                                id="precio"
                                type="number"
                                step="0.01"
                                min="0"
                                value={precio}
                                onChange={(e) => setPrecio(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="input-icon">
                            <FontAwesomeIcon icon={faImage} className="icon" />
                            <input
                                className="form-input"
                                aria-label="URL de la imagen"
                                placeholder="URL de la imagen"
                                id="img"
                                type="text"
                                value={img}
                                onChange={handleImageChange}
                            />
                        </div>
                    </div>

                    {previewImage && (
                        <div className="image-preview">
                            <img src={previewImage} alt="Vista previa" />
                        </div>
                    )}

                    <button type="submit" className="btn-submit">
                        Registrar Producto
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProductosNuevo;