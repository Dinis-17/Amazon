import '../styles/footer.css'

function Footer() {
    return (
        <footer>
            <div className="footer-container">
                <div className="footer-section">
                    <h4>Sobre Nosotros</h4>
                    <ul>
                        <li><a href="#">Acerca de</a></li>
                        <li><a href="#">Carreras</a></li>
                        <li><a href="#">Prensa</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Atención al Cliente</h4>
                    <ul>
                        <li><a href="#">Preguntas frecuentes</a></li>
                        <li><a href="#">Devoluciones</a></li>
                        <li><a href="#">Contacto</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Compra Segura</h4>
                    <ul>
                        <li><a href="#">Métodos de Pago</a></li>
                        <li><a href="#">Política de Privacidad</a></li>
                        <li><a href="#">Términos y Condiciones</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Síguenos</h4>
                    <ul>
                        <li><a href="#">Facebook</a></li>
                        <li><a href="#">Twitter</a></li>
                        <li><a href="#">Instagram</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© 2025 Tienda. Todos los derechos reservados.</p>
            </div>
        </footer>
    )
}

export default Footer;