import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');

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
    }, [navigate]);

    return (
        <div>
            <h1>Dashboard:</h1>
            {userName && <p>Bienvenido {userName}</p>}
        </div>
    );
}

export default Dashboard;
