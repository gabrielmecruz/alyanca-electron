import { useNavigate } from "react-router-dom";

export default function TipoRecibos() {
  const navigate = useNavigate();

  return (
    <div className="size-full flex flex-col items-center justify-center p-[10%]">
      <h1 className="text-5xl m-5 mb-10 lg:mb-16 max-sm:text-4xl">Recibos</h1>

      <div className="size-full flex flex-col items-center justify-center gap-5" role="group">
        <button
          onClick={() => navigate("/Recibos/1")}
          type="button"
          className="inline-flex w-1/2 max-w-40 justify-center items-center px-4 py-2 text-sm font-medium border rounded-s-lg focus:z-10 focus:ring-2 bg-gray-800 border-gray-700 text-white hover:text-white hover:bg-gray-700 focus:ring-blue-500 focus:text-white"
        >
          Ativos
        </button>
        <button
          onClick={() => navigate("/Recibos/2")}
          type="button"
          className="inline-flex w-1/2 max-w-40 justify-center items-center px-4 py-2 text-sm font-medium border-t border-b focus:z-10 focus:ring-2 bg-gray-800 border-gray-700 text-white hover:text-white hover:bg-gray-700 focus:ring-blue-500 focus:text-white"
        >
          Baixados
        </button>
        <button
          onClick={() => navigate("/Recibos/3")}
          type="button"
          className="inline-flex w-1/2 max-w-40 justify-center items-center px-4 py-2 text-sm font-medium border-t border-b focus:z-10 focus:ring-2 bg-gray-800 border-gray-700 text-white hover:text-white hover:bg-gray-700 focus:ring-blue-500 focus:text-white"
        >
          Abertos
        </button>
        <button
          onClick={() => navigate("/Recibos/4")}
          type="button"
          className="inline-flex w-1/2 max-w-40 justify-center items-center px-4 py-2 text-sm font-medium border rounded-e-lg focus:z-10 focus:ring-2 bg-gray-800 border-gray-700 text-white hover:text-white hover:bg-gray-700 focus:ring-blue-500 focus:text-white"
        >
          Fechados
        </button>
        <button
          onClick={() => navigate("/Recibos/0")}
          type="button"
          className="inline-flex w-1/2 max-w-40 justify-center items-center px-4 py-2 text-sm font-medium border rounded-e-lg focus:z-10 focus:ring-2 bg-gray-800 border-gray-700 text-white hover:text-white hover:bg-gray-700 focus:ring-blue-500 focus:text-white"
        >
          Todos
        </button>
      </div>
      <button
        type="button"
        onClick={() => {
          navigate("/", {
            state: {
              name: "menu"
            }
          });
        }}
        className="text-white w-1/2 max-w-56 mt-16 justify-self-end bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        Voltar
      </button>
    </div>
  );
}
