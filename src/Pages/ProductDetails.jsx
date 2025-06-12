import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../styles/ProductDetails.module.css";
import img from '../assets/img.png';
import { AuthContext } from "../components/AuthContext.jsx";

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { isLoggedIn, userRole } = useContext(AuthContext);
    const isAdmin = userRole === "admin";

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await fetch(`http://192.168.0.220:3000/api/product/${id}`);

                if (!response.ok) {
                    throw new Error(`Producto no encontrado. Código de estado: ${response.status}`);
                }

                const data = await response.json();
                setProduct(data.product);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm(`¿Estás seguro de que quieres eliminar "${product.name}"?`)) return;

        try {
            setIsDeleting(true);
            const token = localStorage.getItem("userToken"); // Ajustado para coincidir con AuthProvider

            const response = await fetch(`http://192.168.0.220:3000/api/product/${Number(id)}`, {
                method: "DELETE",
                headers: {
                    "Authorization": token ? `Bearer ${token}` : "",
                    "Content-Type": "application/json"
                },
            });

            if (!response.ok) {
                throw new Error(`Error al eliminar. Código de estado: ${response.status}`);
            }

            navigate("/");
        } catch (err) {
            alert("Error al eliminar el producto: " + err.message);
        } finally {
            setIsDeleting(false);
        }
    };

    function addToCart(productToAdd) {
        const userId = localStorage.getItem('userId');

        if (!userId || userId === "null" || userId === "undefined" || userId.trim() === "") {
            alert("Debes iniciar sesión para añadir productos al carrito.");
            return;
        }

        const storedCart = localStorage.getItem(`cart-${userId}`);
        const cart = storedCart ? JSON.parse(storedCart) : [];

        const existingItem = cart.find((item) => item.id === productToAdd.id);

        let updatedCart;
        if (existingItem) {
            updatedCart = cart.map((item) =>
                item.id === productToAdd.id ? { ...item, quantity: item.quantity + 1 } : item
            );
        } else {
            updatedCart = [...cart, { ...productToAdd, quantity: 1 }];
        }

        localStorage.setItem(`cart-${userId}`, JSON.stringify(updatedCart));
        alert("Producto añadido al carrito");
    }

    if (loading) {
        return <p>Cargando detalles del producto...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!product) {
        return <p>No se encontró el producto.</p>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.imageWrapper}>
                <img
                    src={product.imageUrl || img}
                    alt={product.name}
                    className={styles.productImage}
                />
            </div>

            <div className={styles.details}>
                <h1 className={styles.productTitle}>{product.name}</h1>
                <p className={styles.productPrice}>{product.price}€</p>
                <p className={styles.productDescription}>{product.description}</p>
                <p className={styles.detailLine}>
                    <strong>Categoría:</strong> {product.category}
                </p>
                <p className={product.stock ? styles.stockAvailable : styles.stockUnavailable}>
                    {product.stock ? "Disponible" : "Agotado"}
                </p>

                <div className={styles.buttonGroup}>
                    {product.stock && (
                        <>
                            <button className={styles.buyButton}>Comprar ahora</button>
                            <button
                                className={styles.cartButton}
                                onClick={() => addToCart(product)}
                            >
                                Añadir al carrito
                            </button>
                        </>
                    )}

                    {/* Mostrar botón eliminar solo si es admin y está logueado */}
                    {isAdmin && isLoggedIn && (
                        <button
                            className={"delete-button"}
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Eliminando..." : "Eliminar"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
