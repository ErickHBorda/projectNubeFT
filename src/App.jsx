import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";

// Páginas
import Usuarios from "./pages/Usuarios";
import Programas from "./pages/Programas";
import Denuncias from "./pages/Denuncias";
import Reportes from "./pages/Reportes";
import Seguimientos from "./pages/Seguimientos";
import PlanReinsercion from "./pages/PlanReinsercion";
import SeguimientoPost from "./pages/SeguimientoPost";
import MisProgramas from "./pages/MisProgramas";
import Inscripciones from "./pages/Inscripciones";
import Internos from "./components/usuarios/Internos";
import ExInternos from "./components/usuarios/ExInternos";

// Página de inicio
import HomeDashboard from "./pages/HomeDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          {/* Página de inicio al entrar al dashboard */}
          <Route index element={<HomeDashboard />} />

          {/* Subrutas */}
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="internos" element={<Internos />} />
          <Route path="ex-internos" element={<ExInternos />} />
          <Route path="programas" element={<Programas />} />
          <Route path="inscripciones" element={<Inscripciones />} />
          <Route path="denuncias" element={<Denuncias />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="seguimientos" element={<Seguimientos />} />
          <Route path="mis-programas" element={<MisProgramas />} />
          <Route path="plan-reinsercion" element={<PlanReinsercion />} />
          <Route path="seguimiento-post" element={<SeguimientoPost />} />
        </Route>

        {/* Redirección raíz a dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Cualquier otra ruta */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;