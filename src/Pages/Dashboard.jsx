import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [showForm, setShowForm] = useState(false);
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

                window.location.reload();
            } else {
                alert("Error al agregar producto: " + (data.message || response.statusText || "Error desconocido."));
            }
        } catch (error) {
            console.error("Error de red:", error);
            alert("Error de red o del servidor.");
        }
    };

    return (
        <div>
            <h1>Dashboard:</h1>
            {userName && <p>¡Bienvenido/a {userName}!</p>}

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

        </div>
    );
}

export default Dashboard;
