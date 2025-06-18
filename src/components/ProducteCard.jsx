import { Link } from 'react-router-dom';
import '../styles/product.css';
import img from '../assets/img.png';

function ProducteCard({ product }) {
    return (
        <div className="product-card">
            <div className="product-card-image">
                <Link to={`/product/${product.id}`}>
                    <img
                        className="product-image"
                        src={!product.imageUrl ? img : product.imageUrl}
                        alt={product.name}
                        loading="lazy"
                    />
                </Link>
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
        </div>
    );
}

export default ProducteCard;
