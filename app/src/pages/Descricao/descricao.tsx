import DescricoesService from "@/services/descricao.service";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

interface IDescricaoProps {}

function Descricao({}: IDescricaoProps) {
  const navigate = useNavigate();
  const [desc, setDesc] = useState<any>([]);
  const [newItem, setNewItem] = React.useState("");
  const [editItem, setEditItem] = React.useState("");

  useEffect(() => {
    DescricoesService.getDescricoes().then((res: any) => {
      setDesc(res);
    });
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewItem(event.target.value);
  };

  const handleAddItem = () => {
    if (newItem == "") {
      return toast.error("Digite um título para adicionar uma Descrição.", {
        position: "bottom-center",
        style: {
          width: "264px"
        }
      });
    }
    const newItemObj = {
      CodDescrição: desc.length != 0 ? desc[desc.length - 1].CodDescrição + 1 : 1,
      Descrição: newItem
    };
    setDesc([...desc, newItemObj]);
    DescricoesService.addDescricao(newItemObj);
    setNewItem("");
  };

  const handleEditInput = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    setEditItem(desc[index].Descrição);
    desc[index].Descrição = event.target.value;
    setDesc([...desc]);
  };

  const handleEditItem = (index: number) => {
    DescricoesService.updateDescricao(desc[index].CodDescrição, desc[index]);
  };

  const handleDelItem = (key: any) => {
    DescricoesService.deleteDescricao(desc[key].CodDescrição);
    desc.splice(key, 1);
    setDesc([...desc]);
  };

  return (
    <div className="flex justify-center flex-col items-center w-full min-w-[400px] h-full py-5">
      <h1 className="text-5xl m-5 max-sm:text-4xl mb-10">Descrição</h1>
      <div className="w-96 h-96 overflow-y-auto flex justify-evenly text-sm font-medium border rounded-lg bg-gray-700 border-gray-600 text-white">
        <ul className="w-max">
          {desc.map((item: any, index: number) => (
            <li className="w-full px-4 py-2 border-b border-gray-600" key={index}>
              {item.CodDescrição}
            </li>
          ))}
        </ul>
        <ul className="w-full">
          {desc.map((item: any, index: number) => (
            <li className="w-full flex justify-between items-center px-3 py-2 border-b border-l border-gray-600" key={index}>
              <div className="w-max flex overflow-ellipsis">
                <input
                  className="bg-transparent w-full focus:outline-none"
                  type="text"
                  value={item.Descrição}
                  onChange={(event) => handleEditInput(event, index)}
                  onBlur={() => handleEditItem(index)}
                />
              </div>
              <div
                className="h-5 w-7 border border-gray-200 bg-gray-200 rounded-sm"
                onChange={handleInputChange}
                onClick={() => handleDelItem(index)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-[90%] w-full text-gray-500 cursor-pointer fill-gray-700" viewBox="0 0 448 512">
                  <path d="M170.5 51.6L151.5 80l145 0-19-28.4c-1.5-2.2-4-3.6-6.7-3.6l-93.7 0c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80 368 80l48 0 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-8 0 0 304c0 44.2-35.8 80-80 80l-224 0c-44.2 0-80-35.8-80-80l0-304-8 0c-13.3 0-24-10.7-24-24S10.7 80 24 80l8 0 48 0 13.8 0 36.7-55.1C140.9 9.4 158.4 0 177.1 0l93.7 0c18.7 0 36.2 9.4 46.6 24.9zM80 128l0 304c0 17.7 14.3 32 32 32l224 0c17.7 0 32-14.3 32-32l0-304L80 128zm80 64l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16z" />
                </svg>
              </div>
            </li>
          ))}
          <li className="w-full px-4 py-2 border-b border-l border-gray-600">
            <div className="flex w-full justify-between">
              <input
                className="bg-transparent w-full focus:outline-none"
                type="text"
                value={newItem}
                onChange={handleInputChange}
                placeholder="Escreva a nova inscricao aqui..."
              />
              <div onClick={() => handleAddItem()}>
                <Toaster />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-500 cursor-pointer"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
          </li>
        </ul>
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
        className="text-white w-1/4 max-w-56 m-10 bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        Voltar
      </button>
    </div>
  );
}

export default Descricao;
