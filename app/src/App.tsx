import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home/home";
import Clientes from "./pages/Clientes/clientes";
import CadastroCliente from "./pages/Clientes/CadastroCliente/cadastroCliente";
import Descricao from "./pages/Descricao/descricao";
import TipoRecibos from "./pages/Recibos/tipoRecibos";
import Recibos from "./pages/Recibos/recibos";
import CadastroRecibo from "./pages/Recibos/CadastroRecibo/cadastroRecibo";
import ImprimirRecibos from "./pages/ImprimirRecibos/imprimirRecibos";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Clientes" element={<Clientes />} />
        <Route path="/AdicionarCliente" element={<CadastroCliente />} />
        <Route path="/EditarCliente/:id" element={<CadastroCliente />} />
        <Route path="/Descricao" element={<Descricao />} />
        <Route path="/TiposRecibos" element={<TipoRecibos />} />
        <Route path="/Recibos/:id" element={<Recibos />} />
        <Route path="/NovoRecibo" element={<CadastroRecibo />} />
        <Route path="/EditarRecibo/:id" element={<CadastroRecibo />} />
        <Route path="/ImprimirRecibos" element={<ImprimirRecibos />} />
      </Routes>
    </Router>
  );
}
