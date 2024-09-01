// import React from "react";
import { generatePDF } from "@/helpers/jsPdf";
import ClientesService from "@/services/clientes.service";
import CorpoRecibosService from "@/services/corpoRecibo.service";
import DescricoesService from "@/services/descricao.service";
import RecibosService from "@/services/recibo.service";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function formatDate(date: any) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

interface IImprimirRecibosProps {}

// eslint-disable-next-line no-empty-pattern
function ImprimirRecibos({}: IImprimirRecibosProps) {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<any>();
  const [recibos, setRecibos] = useState<any>();
  const [corpoRecibo, setCorpoRecibo] = useState<any>([]);
  const [dataInicial, setDataInicial] = useState<any>();
  const [dataFinal, setDataFinal] = useState<any>();
  const [valorTotal, setValorTotal] = useState<any>();
  const [descricoes, setDescricoes] = useState<any>([]);
  const [pdfObject, setpdfObject] = useState<any>([]);

  let currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  useEffect(() => {
    RecibosService.getRecibos().then((res: any) => {
      setRecibos(res);
    });

    DescricoesService.getDescricoes().then((res: any) => {
      setDescricoes(
        res.map((r: any) => ({
          id: r.CodDescrição,
          text: r.Descrição
        }))
      );
    });

    ClientesService.getClientes().then((res: any) => {
      setClientes(res);
    });
  }, []);

  useEffect(() => {
    if (recibos != undefined && recibos.length != 0 && clientes != undefined) {
      recibos.map((r: any) => {
        r.Emissão = formatDate(r.Emissão);
        let rs = clientes.find((item: any) => item.Código_Cliente == r.Código_Cliente);
        if (rs != undefined) r.Razão_Social = rs.Razão_Social;
      });

      let corpoRec: any = [];
      let somaTotal = 0;
      CorpoRecibosService.getCorpoRecibos().then((res: any) => {
        recibos.map((recibo: any) => {
          corpoRec = res.filter((cr: any) => cr.Código_Recibo == recibo.Código_Recibo);
          const somaTotal = corpoRec.reduce((acumulador: number, objetoAtual: any) => {
            return acumulador + parseFloat(objetoAtual.ValorAPagar);
          }, 0);
          return recibo;
        });

        setCorpoRecibo(corpoRec);
        setValorTotal(currency.format(somaTotal));
      });
    }
  }, [recibos, clientes]);

  useEffect(() => {
    if (recibos != undefined && corpoRecibo != undefined) {
      recibos.map((r: any) => {
        let reciboFormatado = r;
        reciboFormatado.ValorTotal = valorTotal;

        let corpoReciboFormatado = corpoRecibo.map((cr: any) => {
          cr.Descrição = descricoes.find((item: any) => cr.CodDaDescrição == item.id).text;
          return cr;
        });

        let document = {
          ...reciboFormatado,
          CorpoRecibo: corpoReciboFormatado
        };

        setpdfObject([document]);
      });
    }
  }, [corpoRecibo, recibos, valorTotal]);

  function generateDatePdf() {
    if (dataInicial == undefined || dataInicial == undefined) {
      return toast.error(`Selecione o intervalo de datas`, {
        position: "bottom-center",
        style: {
          width: "264px"
        }
      });
    }
    const dataInicio = new Date(dataInicial);
    const dataFim = new Date(dataFinal);

    let recibosFiltrados = recibos.filter((rec: any) => {
      let datePicked = new Date(rec.Emissão);
      return datePicked.getTime() >= dataInicio!.getTime() && datePicked.getTime() <= dataFim!.getTime();
    });

    let corpoReciboFormatado = recibos.map((r: any) => {
      r.CorpoRecibo = corpoRecibo;
      r.CorpoRecibo.map((cr: any) => {
        cr.Descrição = descricoes.find((item: any) => cr.CodDaDescrição == item.id).text;
        return cr;
      });
    });

    recibosFiltrados.map((rf: any) => {
      return rf;
    });

    generatePDF(pdfObject);
  }

  return (
    <div className="flex justify-center flex-col items-center w-full min-w-[400px] h-full">
      <h1 className="text-5xl mb-10">Imprimir Recibos</h1>
      <div className="w-96 h-64 grid grid-cols-3 content-evenly overflow-y-auto font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white px-4">
        <div className="col-span-3 justify-center">
          <label htmlFor="first_name" className="block mb-2 font-medium text-gray-900 dark:text-white">
            Data Inicial
          </label>
          <input
            type="date"
            id="dataInicial"
            onChange={(e) => setDataInicial(e.target.value)}
            className="w-full p-1.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="John"
            required
          />
        </div>
        <div className="col-span-3 justify-center">
          <label htmlFor="first_name" className="block mb-2 font-medium text-gray-900 dark:text-white">
            Data Final
          </label>
          <input
            type="date"
            id="dataFinal"
            onChange={(e) => setDataFinal(e.target.value)}
            className="w-full p-1.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="John"
            required
          />
        </div>
        <button
          onClick={generateDatePdf}
          type="button"
          className="col-start-1 col-span-1 w-max inline-flex items-center py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white"
        >
          <svg className="w-3 h-3 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
            <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
          </svg>
          Imprimir Recibos
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
        className="text-white w-1/4 max-w-56 my-10 bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        Voltar
      </button>
      <Toaster containerClassName="text-sm" />
    </div>
  );
}

export default ImprimirRecibos;
