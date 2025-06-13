import { useRef, useState, useEffect } from "react";
import ProducteCard from "./ProducteCard.jsx";
import '../styles/product.css';

function CategoriaContainer({ products = [], isAdmin = false, handleDeleteProduct, error }) {
    if (error) return <p>{error}</p>;
    if (!products.length) return <p>No hay productos para mostrar.</p>;

    const groupedByCategory = products.reduce((acc, product) => {
        if (!acc[product.category]) acc[product.category] = [];
        acc[product.category].push(product);
        return acc;
    }, {});

    return (
        <div className="categories">
            {Object.entries(groupedByCategory).map(([categoryName, categoryProducts]) => (
                <CategoryRow
                    key={categoryName}
                    categoryName={categoryName}
                    products={categoryProducts}
                    isAdmin={isAdmin}
                    handleDeleteProduct={handleDeleteProduct}
                />
            ))}
        </div>
    );
}

function CategoryRow({ categoryName, products, isAdmin, handleDeleteProduct }) {
    const scrollRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    useEffect(() => {
        const checkForOverflow = () => {
            if (!scrollRef.current) return;
            const { scrollWidth, clientWidth, scrollLeft } = scrollRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft + clientWidth < scrollWidth);
        };

        checkForOverflow();
        scrollRef.current?.addEventListener('scroll', checkForOverflow);
        window.addEventListener('resize', checkForOverflow);

        return () => {
            scrollRef.current?.removeEventListener('scroll', checkForOverflow);
            window.removeEventListener('resize', checkForOverflow);
        };
    }, [products]);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.8;

            if (direction === 'left') {
                scrollRef.current.scrollTo({ left: scrollLeft - scrollAmount, behavior: 'smooth' });
            } else {
                scrollRef.current.scrollTo({ left: scrollLeft + scrollAmount, behavior: 'smooth' });
            }
        }
    };

    return (
        <div className="category-row" style={{ marginBottom: '2rem' }}>
            <h2 className="h2-category-name">{categoryName}</h2>
            <div className="products-wrapper" style={{ position: 'relative' }}>
                {showLeftArrow && (
                    <button className="scroll-button left" onClick={() => scroll('left')} aria-label="Scroll left" type="button">
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" >
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>
                )}

                <div
                    className="products"
                    ref={scrollRef}
                    style={{
                        display: 'flex',
                        overflowX: 'auto',
                        scrollBehavior: 'smooth',
                        gap: '1rem',
                        paddingBottom: '1rem',
                        scrollbarWidth: 'none',
                    }}
                >
                    {products.map((product) => (
                        <ProducteCard
                            key={product.id}
                            product={product}
                            isAdmin={isAdmin}
                            onDelete={handleDeleteProduct}
                        />
                    ))}
                </div>

                {showRightArrow && (
                    <button className="scroll-button right" onClick={() => scroll('right')} aria-label="Scroll right" type="button">
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}

export default CategoriaContainer;
