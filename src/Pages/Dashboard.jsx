import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: false,
        imageUrl: ''
    });

    useEffect(() => {
        const token = localStorage.getItem("userToken");
        if (!token) {
            navigate("/login");
            return;
        }

        const name = localStorage.getItem("userName");
        if (name) {
            setUserName(name);
        }

        fetchProducts(token);
    }, [navigate]);

    const fetchProducts = async (token) => {
        try {
            const response = await fetch("http://192.168.0.220:3000/api/product", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setProducts(data.productos || []);
            } else {
                console.error("Error al obtener productos:", data);
            }
        } catch (error) {
            console.error("Error al cargar productos:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("userToken");

        try {
            const response = await fetch("http://192.168.0.220:3000/api/product", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price)
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Producto agregado exitosamente");
                setShowForm(false);
                setFormData({
                    name: '',
                    description: '',
                    price: '',
                    category: '',
                    stock: false,
                    imageUrl: ''
                });
                fetchProducts(token);
            } else {
                alert("Error al agregar producto: " + (data.message || "Error desconocido."));
            }
        } catch (error) {
            console.error("Error de red:", error);
            alert("Error de red o del servidor.");
        }
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem("userToken");
        if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;

        try {
            const response = await fetch(`http://192.168.0.220:3000/api/product/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                alert("Producto eliminado.");
                setProducts(products.filter(p => p._id !== id));
            } else {
                alert("Error al eliminar: " + (data.message || "Error desconocido."));
            }
        } catch (error) {
            console.error("Error al eliminar:", error);
            alert("No se pudo eliminar el producto.");
        }
    };

    return (
        <div>
            <h1>Dashboard:</h1>
            {userName && <p>Bienvenido {userName}</p>}

            <button className="full-rounded" onClick={() => setShowForm(!showForm)}>
                {showForm ? "Cancelar" : "Añadir producto"}
            </button>

            {showForm && (
                <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
                    <input type="text" name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} required />
                    <input type="text" name="description" placeholder="Descripción" value={formData.description} onChange={handleChange} required />
                    <input type="number" name="price" placeholder="Precio" step="0.01" value={formData.price} onChange={handleChange} required />
                    <input type="text" name="category" placeholder="Categoría" value={formData.category} onChange={handleChange} required />
                    <label>
                        <input type="checkbox" name="stock" checked={formData.stock} onChange={handleChange} />
                        En stock
                    </label>
                    <input type="url" name="imageUrl" placeholder="URL de la imagen" value={formData.imageUrl} onChange={handleChange} />
                    <button type="submit">Guardar producto</button>
                </form>
            )}

            <h3>Tus productos publicados:</h3>
            <ul>
                {products.length === 0 ? (
                    <p>No tienes productos publicados.</p>
                ) : (
                    products.map(product => (
                        <li key={product._id} style={{ marginBottom: "15px" }}>
                            <strong>{product.name}</strong> - {product.price}€
                            <br />
                            <img src={product.imageUrl} alt={product.name} style={{ width: "100px", height: "auto" }} />
                            <br />
                            <button onClick={() => handleDelete(product._id)} style={{ marginTop: "5px", backgroundColor: "red", color: "white" }}>
                                Eliminar
                            </button>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}

export default Dashboard;
