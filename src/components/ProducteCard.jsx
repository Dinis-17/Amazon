import '../styles/product.css';
import img from '../assets/img.png';
import { useState } from 'react';

function ProducteCard({ product, isAdmin, onDelete }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar "${product.name}"?`)) {
            setIsDeleting(true);
            onDelete(product.name)
                .finally(() => setIsDeleting(false));
        }
    };

    return (
        <div className="product-card">
            <div className="product-card-image">
                <img
                    className="product-image"
                    src={!product.imageUrl ? img : product.imageUrl}
                    alt={product.name}
                />
            </div>
            <div className="product-card-title">
                <h3>{product.name}</h3>
            </div>
            <div className="product-description">
                <p className="p-product-description">{product.description}</p>
            </div>
            <div className="product-price">
                <p>{product.price.toFixed(2)}€</p>
            </div>
            <div className="extra-info">
                <p style={{ color: product.stock ? 'green' : 'red' }}>
                    {product.stock ? "Disponible" : "Agotado"}
                </p>
            </div>

            {isAdmin && (
                <div className="admin-actions">
                    <button
                        className="delete-button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Eliminando...' : 'Eliminar'}
                    </button>
                </div>
            )}
        </div>
    );
}

export default ProducteCard;
