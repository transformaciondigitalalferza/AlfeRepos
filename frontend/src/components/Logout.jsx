import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await axios.post("http://localhost:8000/api/logout");
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        alert("Sesión cerrada");
        navigate("/login");
      } catch (error) {
        console.error("Error al cerrar sesión", error);
      }
    };

    logout();
  }, [navigate]);

  return null;
}

export default Logout;
