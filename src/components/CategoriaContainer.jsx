import { useState, useEffect } from "react";
import ProducteCard from "./ProducteCard.jsx";
import '../styles/product.css';

function CategoriaContainer() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch("http://192.168.0.220:3000/api/product")
            .then(res => {
                if (!res.ok) throw new Error("Error al cargar productos:");
                return res.json();
            })
            .then(data => {
                setProducts(data.products);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Cargando productos...</p>;
    if (error) return <p>Algo salió mal: {error}</p>;

    return (
        <div className="categories">
            {Object.entries(
                products.reduce((acc, product) => {
                    if (!acc[product.category]) acc[product.category] = [];
                    acc[product.category].push(product);
                    return acc;
                }, {})
            ).map(([categoryName, categoryProducts]) => (
                <div key={categoryName}>
                    <h2 className={"h2-category-name"}>{categoryName}</h2>
                    <div className="products">
                        {categoryProducts.map((product, index) => (
                            <ProducteCard key={index} product={product} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

}

export default CategoriaContainer;
