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
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Campos editables
    const [editedName, setEditedName] = useState("");
    const [editedPrice, setEditedPrice] = useState("");
    const [editedDescription, setEditedDescription] = useState("");
    const [editedCategory, setEditedCategory] = useState("");
    const [editedStock, setEditedStock] = useState(false);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await fetch(`http://192.168.0.220:3000/api/product/${id}`);

                if (!response.ok) {
                    throw new Error(`Producto no encontrado. Código de estado: ${response.status}`);
                }

                const data = await response.json();
                setProduct(data.product);

                setEditedName(data.product.name);
                setEditedPrice(data.product.price);
                setEditedDescription(data.product.description);
                setEditedCategory(data.product.category);
                setEditedStock(data.product.stock);
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
            const token = localStorage.getItem("userToken");

            const response = await fetch(`http://192.168.0.220:3000/api/product/${product.name}`, {
                method: "DELETE",
                headers: {
                    "Authorization": token ? `Bearer ${token}` : "",
                    "Content-Type": "application/json"
                },
            });

            if (!response.ok) {
                throw new Error(`Error al eliminar. Código de estado: ${response.status}`);
            }

            navigate("/")
            window.location.reload()

        } catch (err) {
            alert("Error al eliminar el producto: " + err.message);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSaveChanges = async () => {
        try {
            setIsSaving(true);
            const token = localStorage.getItem("userToken");

            const response = await fetch(`http://192.168.0.220:3000/api/product/${id}`, {
                method: "PUT",
                headers: {
                    "Authorization": token ? `Bearer ${token}` : "",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: editedName,
                    price: Number(editedPrice),
                    description: editedDescription,
                    category: editedCategory,
                    stock: editedStock,
                })
            });

            if (!response.ok) {
                throw new Error(`Error al guardar los cambios. Código: ${response.status}`);
            }

            window.location.reload()

            const updatedProduct = await response.json();
            setProduct(updatedProduct.product);
            setIsEditing(false);
        } catch (err) {
            alert("Error al guardar: " + err.message);
        } finally {
            setIsSaving(false);
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

    if (loading) return <p>Cargando detalles del producto...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!product) return <p>No se encontró el producto.</p>;

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
                {isEditing ? (
                    <>
                        <input value={editedName} onChange={(e) => setEditedName(e.target.value)} />
                        <input value={editedPrice} onChange={(e) => setEditedPrice(e.target.value)} />
                        <textarea value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} />
                        <input value={editedCategory} onChange={(e) => setEditedCategory(e.target.value)} />
                        <label>
                            <input type="checkbox" checked={editedStock} onChange={(e) => setEditedStock(e.target.checked)} />
                            Disponible
                        </label>
                    </>
                ) : (
                    <>
                        <h1 className={styles.productTitle}>{product.name}</h1>
                        <p className={styles.productPrice}>{product.price}€</p>
                        <p className={styles.productDescription}>{product.description}</p>
                        <p className={styles.detailLine}>
                            <strong>Categoría:</strong> {product.category}
                        </p>
                        <p className={product.stock ? styles.stockAvailable : styles.stockUnavailable}>
                            {product.stock ? "Disponible" : "Agotado"}
                        </p>
                    </>
                )}

                <div className={styles.buttonGroup}>
                    {product.stock && !isEditing && (
                        <>
                            <button className={styles.buyButton}>Comprar ahora</button>
                            <button className={styles.cartButton} onClick={() => addToCart(product)}>
                                Añadir al carrito
                            </button>
                        </>
                    )}

                    {/* Botones solo visibles para admins */}
                    {isAdmin && isLoggedIn && (
                        <>
                            {!isEditing ? (
                                <>
                                    <button onClick={() => setIsEditing(true)} className={"edit-button"}>Editar</button>
                                    <button onClick={handleDelete} disabled={isDeleting} className={"delete-button"}>
                                        {isDeleting ? "Eliminando..." : "Eliminar"}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={handleSaveChanges} disabled={isSaving}>
                                        {isSaving ? "Guardando..." : "Guardar cambios"}
                                    </button>
                                    <button onClick={() => setIsEditing(false)}>Cancelar</button>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
