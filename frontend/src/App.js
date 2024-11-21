import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Logout from './components/Logout';
import PrivateRoute from './components/PrivateRoute';
import Profile from "./components/Profile";
import Comisiones from './components/Comisiones'; 
import Register from './components/Register'
import Format from './components/Formats';
import UpdateDocs from './components/UpdateDocs';
import ObjStrategico from './components/ObjStrategico';
import ObjOperacional from './components/ObjOperacional';
import Tareas from './components/Tareas';
import IndicadoresGestion from './components/IndicadoresGestion';

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
                    <Route path="/comisiones" element={<Comisiones />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/formats" element={<Format />} />
                    <Route path="/UpdateDocs" element={<UpdateDocs />} />
                    <Route path="/strategicobjectives" element={<ObjStrategico />} />
                    <Route path="/operationalobjectives" element={<ObjOperacional />} />
                    <Route path="/tareas" element={<Tareas />} />
                    <Route path="/IndicadoresGest" element={<IndicadoresGestion />} />
                </Route>

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
