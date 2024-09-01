import { useNavigate } from "react-router-dom";
import ClienteDataGrid from "./ClienteDataGrid/clienteDataGrid";

function Clientes() {
  const navigate = useNavigate();

  return (
    <div className="size-full flex flex-col items-center pt-[5%] pb-[15%] px-[10%] md:px-[10%] lg:py-[5%] lg:px-[16%]">
      <h1 className="text-4xl md:text-5xl mb-5 lg:mb-2">Clientes</h1>

      <ClienteDataGrid />

      <div className="size-full flex justify-around items-end">
        <button
          onClick={() =>
            navigate("/AdicionarCliente", {
              state: {
                name: "add"
              }
            })
          }
          className="max-h-11 align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none rounded border-r-0"
          type="button"
        >
          Adicionar Cliente
        </button>
        <button
          type="button"
          onClick={() =>
            navigate("/", {
              state: {
                name: "menu"
              }
            })
          }
          className="max-h-11 px-5 py-2.5 text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-800 font-medium rounded-lg text-sm text-center"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}

export default Clientes;
