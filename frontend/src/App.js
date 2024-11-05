// src/App.js

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Logout from './components/Logout';
import PrivateRoute from './components/PrivateRoute';
import Profile from "./components/Profile";
import Objectives from './components/Objectives';
import Comisiones from './components/Comisiones'; // Importación del componente Comisiones

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />

                <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/objectives" element={<Objectives />} />
                    <Route path="/comisiones" element={<Comisiones />} /> {/* Nueva ruta para Comisiones */}
                </Route>

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
