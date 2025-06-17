import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Trash2 } from 'lucide-react';
import styles from "../styles/ProductDetails.module.css";
import img from '../assets/img.png';
import { AuthContext } from "../components/AuthContext.jsx";


function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { isLoggedIn, userRole } = useContext(AuthContext);
    const isAdmin = userRole === "admin";

    const [product, setProduct] = useState(null);
    const [review, setReview] = useState([]);
    const [ratingSeleccionado, setRatingSeleccionado] = useState(0);
    const [comentario, setComentario] = useState("");

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

    const handlePagarClick = () => {
        if (!isLoggedIn) {
            navigate('/login');
        } else {
            const added = addToCart(product, false);
            if (added) {
                localStorage.setItem('producto_seleccionado', JSON.stringify(product));
                navigate('/pagar');
            } else {
                alert("No se pudo añadir el producto al carrito.");
            }
        }
    };


    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await fetch(`http://192.168.0.220:3000/api/product/${id}`);
                if (!response.ok) new Error(`Producto no encontrado. Código: ${response.status}`);
                const data = await response.json();
                setProduct(data.product);

                // Preparar campos editables
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

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(`http://192.168.0.220:3000/api/review/${id}`);
                if (!res.ok) new Error(`Error al obtener las reviews: ${res.status}`);

                const data = await res.json();

                setReview(data.reviews || []);
            } catch (err) {
                console.error(err);
                setError(err.message);
            }
        };

        fetchReviews();
    }, [id]);

    function Estrellas({ rating }) {
        const maxStars = 5;

        return (
            <div className={styles.stars}>
                {[...Array(maxStars)].map((_, i) =>
                    i < rating ? '★' : '☆'
                ).join('')}
            </div>
        );
    }

    function EstrellasEditables({ rating, onChange }) {
        const estrellas = [1, 2, 3, 4, 5];
        return (
            <div className={styles.starsEditable}>
                {estrellas.map((num) => (
                    <span
                        key={num}
                        style={{ cursor: "pointer", color: num <= rating ? "#ffd700" : "#CCC", fontSize: "35px" }}
                        onClick={() => onChange(num)}
                    >★</span>
                ))}
            </div>
        );
    }

    const handleEnviarResena = async () => {
        const userId = localStorage.getItem("userId");

        if (!userId) {
            alert("Debes iniciar sesión para dejar una reseña.");
            return;
        }

        if (ratingSeleccionado < 1 || ratingSeleccionado > 5 || comentario.trim() === "") {
            alert("Por favor, selecciona una puntuación entre 1 y 5 y escribe un comentario.");
            return;
        }

        try {
            const token = localStorage.getItem("userToken");

            const response = await fetch(`http://192.168.0.220:3000/api/review`, {
                method: "POST",
                headers: {
                    "Authorization": token ? `Bearer ${token}` : "",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    productId: id,
                    rating: ratingSeleccionado,
                    comment: comentario,
                }),
            });

            if (!response.ok) new Error("Error al enviar la reseña");

            setComentario("");
            setRatingSeleccionado(0);
            window.location.reload();
        } catch (err) {
            alert("Error al enviar reseña: " + err.message);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        const token = localStorage.getItem("userToken");

        if (!window.confirm("Estás seguro de que quieres eliminar esta reseña?")) return;

        try {
            const response = await fetch(`http://192.168.0.220:3000/api/review/${reviewId}`, {
                method: "DELETE",
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            });

            if (!response.ok) throw new Error("No se pudo eliminar la reseña.");

            setReview((prevReviews) => prevReviews.filter((rev) => rev.id !== reviewId));
        } catch (err) {
            alert("Error al eliminar reseña: " + err.message);
        }
    };



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

            if (!response.ok) new Error(`Error al eliminar: ${response.status}`);
            navigate("/");
            window.location.reload();
        } catch (err) {
            alert("Error al eliminar: " + err.message);
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

            if (!response.ok) new Error(`Error al guardar cambios: ${response.status}`);
            const updatedProduct = await response.json();
            setProduct(updatedProduct.product);
            setIsEditing(false);
            window.location.reload();
        } catch (err) {
            alert("Error al guardar: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    function addToCart(productToAdd, showAlert = true) {
        const userId = localStorage.getItem('userId');

        if (!userId || userId.trim() === "") {
            if (showAlert) alert("Debes iniciar sesión para añadir productos al carrito.");
            return false;
        }

        const storedCart = localStorage.getItem(`cart-${userId}`);
        const cart = storedCart ? JSON.parse(storedCart) : [];

        const existingItem = cart.find((item) => item.id === productToAdd.id);
        const updatedCart = existingItem
            ? cart.map((item) => item.id === productToAdd.id ? { ...item, quantity: item.quantity + 1 } : item)
            : [...cart, { ...productToAdd, quantity: 1 }];

        localStorage.setItem(`cart-${userId}`, JSON.stringify(updatedCart));

        if (showAlert) alert("Producto añadido al carrito");
        return true;
    }

    if (loading) return <p>Cargando detalles del producto...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!product) return <p>No se encontró el producto.</p>;

    return (
        <>
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
                                <button className={styles.buyButton} onClick={handlePagarClick}>Comprar ahora</button>
                                <button className={styles.cartButton} onClick={() => addToCart(product)}>
                                    Añadir al carrito
                                </button>
                            </>
                        )}

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

            <div className={styles.clientsReviews}>
                <h1>Reseñas:</h1>

                {isLoggedIn &&(
                    <div className={styles.reviewForm}>
                        <h2>Escribe una reseña</h2>
                        <EstrellasEditables rating={ratingSeleccionado} onChange={setRatingSeleccionado} />
                        <textarea
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                            placeholder="Tu opinión sobre este producto... (400 caracteres max.)"
                            rows="6"
                            maxLength="400"
                        />
                        <button onClick={handleEnviarResena}>Enviar reseña</button>
                    </div>
                )}

                {review.length > 0 ? (
                    review.map((r, i) => (
                        <div key={i} className={styles.review}>
                            <div className={styles.reviewHeader}>
                                <strong>{r.user.name}</strong>
                                <Estrellas rating={r.rating} />
                            </div>
                            <p>{r.comment}</p>

                            {/* Admin */}
                            {isAdmin && (
                                <button onClick={() => handleDeleteReview(r.id)} className={"delete-button"}>
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No hay reseñas para este producto.</p>
                )}
            </div>
        </>
    );
}

export default ProductDetails;
