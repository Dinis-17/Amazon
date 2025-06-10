import './styles/app.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import CategoriaContainer from './components/CategoriaContainer.jsx';
import Footer from './components/Footer.jsx';
import Login from './pages/Login.jsx';
import Register from './Pages/Register.jsx';
import Dashboard from "./Pages/Dashboard.jsx";

function App() {
    return (
        <div className="app-layout">
            <Router>
                <Header />

                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<CategoriaContainer />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Routes>
                </main>

                <Footer />
            </Router>
        </div>
    );
}

export default App;
