import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./components/Header";
import Plan from "./components/Plan";
import Charts from "./components/Charts";
import Form from "./components/form";
import UserPermissions from './components/UserPermissions';
import Home from "./components/Home"; // Crear este componente con el contenido actual de la página principal
import ClientForm from './components/clientForm';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/planes" element={<Plan />} />
        <Route path="/estadisticas" element={<Charts />} />
        <Route path="/contacto" element={<Form />} />
        <Route path="/gestion-usuarios" element={<UserPermissions />} />
        <Route path="/registro/cliente" element={<ClientForm />} />
      </Routes>
    </Router>
  );
}

export default App;