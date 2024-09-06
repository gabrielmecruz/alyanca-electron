/* eslint-disable no-empty-pattern */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CNPJInput from "../Forms/CNPJ";
import { Row } from "@/interfaces/dataGrid.interface";
import { createCorpoReciboRows } from "@/helpers/datagrid.helper";
import { Filter } from "@/interfaces/filter.interface";

import DataGrid, { Column, RenderHeaderCellProps } from "react-data-grid";
import "react-data-grid/lib/styles.css";
import ClientesService from "@/services/clientes.service";
import RecibosService from "@/services/recibo.service";
import { editorDate, editorText } from "@/helpers/editor.helper";
import CorpoRecibosService from "@/services/corpoRecibo.service";
import DescricoesService from "@/services/descricao.service";
import toast, { Toaster } from "react-hot-toast";
import { generatePDF } from "@/helpers/jsPdf";

interface IRecibosProps {}

const FilterContext = createContext<Filter | undefined>(undefined);

function FilterRenderer<R>({
  tabIndex,
  column,
  children
}: RenderHeaderCellProps<R> & {
  children: (args: { tabIndex: number; filters: Filter }) => React.ReactElement;
}) {
  const filters = useContext(FilterContext)!;
  return (
    <>
      <div>{column.name}</div>
      {filters.enabled && <div>{children({ tabIndex, filters })}</div>}
    </>
  );
}

function EmptyRowsRenderer() {
  return (
    <div className="bg-gray-200 text-black p-4" style={{ textAlign: "center", gridColumn: "1/-1" }}>
      Sem dados
    </div>
  );
}

function CadastroRecibo({}: IRecibosProps) {
  const navigate = useNavigate();
  const param = useParams();
  const location = useLocation();
  const recibosPrev = location.state.recibos || [];
  const isAddMode = location.state.name == "add";
  const newId = recibosPrev.length != 0 ? recibosPrev[recibosPrev.length - 1].Código_Recibo + 1 : 1;
  const [loadingCorpo, setloadingCorpo] = useState<boolean>();

  const [cnpj, setCNPJ] = useState("");
  const [corpoRows, setCorpoRows] = useState<any>([]);
  const [descricoes, setDescricoes] = useState<any>([]);
  const [recibo, setRecibo] = useState<any>();
  const [corpoRecibo, setCorpoRecibo] = useState<any>();
  const [valorTotal, setValorTotal] = useState("");
  const [novoRecibo, setNovoRecibo] = useState<any>({
    codRecibo: isAddMode ? newId : param.id,
    emissao: "",
    baixa: "Não",
    dataBaixa: "",
    fechado: "Não"
  });
  const [clientes, setClientes] = useState<any>([]);
  const [clienteData, setClienteData] = useState<any>();
  const [filters, setFilters] = useState(
    (): Filter => ({
      descricao: "Todos",
      competencia: "",
      valor: "",
      complete: undefined,
      enabled: true
    })
  );
  const [pdfObject, setpdfObject] = useState<any>([]);

  let currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  function obterCorpoRecibo(corpoRowAux: any) {
    let cr: any = [];
    corpoRowAux.map((r: any) => (r.ValorAPagar = parseFloat(r.ValorAPagar)));
    cr = corpoRowAux.filter((cr: any) => cr.Código_Recibo == recibo.Código_Recibo);
    const somaTotal = cr.reduce((acumulador: number, objetoAtual: any) => {
      return acumulador + parseFloat(objetoAtual.ValorAPagar);
    }, 0);
    setCorpoRows(cr);
    setValorTotal(currency.format(somaTotal));
  }

  function adicionarCorpoRecibo(data: any) {
    setCorpoRecibo(data);
    let corpoRowAux = [...corpoRows, data];
    setItemObj({ descrição: "Todos", competência: "", valor: 0 });
    obterCorpoRecibo(corpoRowAux);
    return toast.success(`Item adicionado ao corpo do recibo`, {
      position: "bottom-center",
      style: {
        width: "264px"
      }
    });
  }

  async function salvarCorpoRecibo(corpoRecibo: any) {
    if (!corpoRecibo) {
      setloadingCorpo(false);
      return;
    }

    try {
      await CorpoRecibosService.addCorpoRecibo(corpoRecibo).then((res: any) => {
        if (res.success) {
          setloadingCorpo(false);
        }
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  useEffect(() => {
    let clientes: any = [];
    ClientesService.getClientes().then((res: any) => {
      setClientes(res);
      clientes = res;
    });

    if (!isAddMode) {
      RecibosService.getRecibo(Number(param.id)).then((res: any) => {
        setRecibo(res.recibo);
        setClienteData(clientes.find((item: any) => item.Código_Cliente == res.recibo.Código_Cliente));
      });
    } else {
      setRecibo({
        Código_Recibo: newId,
        Emissão: "",
        Baixa: "Não",
        Data_Baixa: "",
        Fechado: "Não"
      });
    }

    DescricoesService.getDescricoes().then((res: any) => {
      setDescricoes(
        res.map((r: any) => ({
          id: r.CodDescrição,
          text: r.Descrição
        }))
      );
    });

    CorpoRecibosService.getCorpoRecibos().then((res: any) => {
      res.map((r: any) => (r.ValorAPagar = parseFloat(r.ValorAPagar)));
      setCorpoRows(res);
    });
  }, []);

  useEffect(() => {
    if (recibo != undefined) {
      obterCorpoRecibo(corpoRows);
    }

    if (clienteData != undefined) {
      setCNPJ(clienteData.CNPJ);
    }
  }, [clienteData, recibo]);

  const columns = useMemo((): Column<any>[] => {
    return [
      {
        key: "descricao",
        name: "Descrição",
        editable: true,
        headerCellClass:
          "filter-cell flex flex-col-reverse size-full justify-evenly items-center border border-gray-600 bg-gray-400 text-black sm:flex-row sm:justify-between sm:gap-1",
        cellClass: "size-full flex border justify-start items-center border-gray-600 bg-gray-200 text-black",
        renderHeaderCell: (p: any) => (
          <FilterRenderer<Row> {...p}>
            {({ filters, ...rest }) => (
              <select
                {...rest}
                className="p-1 w-full bg-gray-200"
                value={filters.descricao}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    descricao: e.target.value
                  })
                }
              >
                <option key="T" value="Todos">
                  Todos
                </option>
                {descricoes.map(({ id, text }: any) => (
                  <option key={id} value={text}>
                    {text}
                  </option>
                ))}
              </select>
            )}
          </FilterRenderer>
        )
      },
      {
        key: "competencia",
        name: "Competência",
        editable: true,
        renderEditCell: editorDate,
        headerCellClass:
          "filter-cell flex flex-col-reverse size-full justify-evenly items-center border border-gray-600 bg-gray-400 text-black lg:flex-row lg:justify-between",
        cellClass: "size-full flex border justify-start items-center border-gray-600 bg-gray-200 text-black",
        renderHeaderCell: (p: any) => (
          <FilterRenderer<Row> {...p}>
            {({ filters, ...rest }) => (
              <input
                {...rest}
                type="date"
                className="date-picker p-1 bg-gray-200 text-black focus:ring-blue-500 focus:border-blue-500"
                placeholder="01/01/2001"
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    competencia: e.target.value == "" ? e.target.value : new Date(e.target.value).toISOString().split("T")[0]
                  })
                }
              />
            )}
          </FilterRenderer>
        )
      },
      {
        key: "valor",
        name: "Valor",
        editable: true,
        renderEditCell: editorText,
        headerCellClass:
          "filter-cell flex flex-col-reverse size-full justify-evenly items-center border border-gray-600 bg-gray-400 text-black sm:flex-row sm:justify-between",
        cellClass: "size-full flex border justify-center items-center border-gray-600 bg-gray-200 text-black",
        renderHeaderCell: (p: any) => {
          return (
            <FilterRenderer<Row> {...p}>
              {({ filters, ...rest }) => (
                <select
                  {...rest}
                  className="p-1 w-full bg-gray-200"
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      valor: e.target.value
                    })
                  }
                >
                  <option key="T" value="">
                    Todos
                  </option>
                  {corpoRows.map((corpo: any, index: number) => {
                    return (
                      <option key={index} value={corpo.ValorAPagar}>
                        {currency.format(corpo.ValorAPagar)}
                      </option>
                    );
                  })}
                </select>
              )}
            </FilterRenderer>
          );
        }
      }
    ];
  }, [corpoRows]);

  const filteredRows = useMemo(() => {
    let descricoesText: any = descricoes;
    return corpoRows.filter((r: any) => {
      let desc = descricoesText.find((item: any) => item.id == r.CodDaDescrição);
      return (
        (recibo != undefined ? recibo.Código_Recibo == r.Código_Recibo : false) &&
        (filters.descricao !== "Todos" ? desc.text == filters.descricao : true) &&
        (filters.competencia !== "" ? r.Competência == filters.competencia : true) &&
        (filters.valor !== "" ? r.ValorAPagar == filters.valor : true)
      );
    });
  }, [corpoRows, filters, recibo]);

  function clearFilters() {
    setFilters({
      descricao: "Todos",
      competencia: "",
      valor: "Todos",
      complete: undefined,
      enabled: true
    });
  }

  function changeCliente(e: any) {
    let clientData = clientes.find((item: any) => item.Razão_Social == e.target.value);
    setClienteData(clientData);
    novoRecibo.Código_Cliente = clientData.Código_Cliente;
  }

  async function handleSubmit() {
    let nR = {
      Código_Recibo: novoRecibo.codRecibo != undefined ? Number(novoRecibo.codRecibo) : recibo.Código_Recibo,
      Emissão: novoRecibo.emissao != "" ? novoRecibo.emissao : recibo.Emissão,
      Código_Cliente: novoRecibo.Código_Cliente != undefined ? novoRecibo.Código_Cliente : recibo.Código_Cliente,
      Baixa: novoRecibo.baixa != "" ? novoRecibo.baixa : recibo.Baixa,
      Data_Baixa: novoRecibo.dataBaixa != "" ? novoRecibo.dataBaixa : recibo.Data_Baixa,
      Fechado: novoRecibo.fechado != "" ? novoRecibo.fechado : recibo.Fechado
    };

    if (corpoRows.length == 0) {
      return toast.error(`Recibo sem corpo informado.`, {
        position: "bottom-center",
        style: {
          width: "264px"
        }
      });
    }

    if (isAddMode) {
      try {
        await RecibosService.addRecibo(nR).then((res: any) => {
          if (res.success) {
            salvarCorpoRecibo(corpoRecibo);
            if (!loadingCorpo) navigate("/TiposRecibos");
          }
        });
      } catch (err) {
        console.log(err);
        throw err;
      }
    } else {
      if (recibo.Código_Recibo == undefined) {
        return toast.error(`Recibo sem código informado.`, {
          position: "bottom-center",
          style: {
            width: "264px"
          }
        });
      }
      try {
        delete recibo.Razão_Social;
        delete recibo.ValorTotal;
        await RecibosService.updateRecibo(Number(nR.Código_Recibo), nR).then((res: any) => {
          if (res.success) {
            salvarCorpoRecibo(corpoRecibo);
            if (!loadingCorpo) navigate("/TiposRecibos");
          }
        });
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  }

  const [itemObj, setItemObj] = useState<any>({ descrição: "Todos", competência: "", valor: 0 });

  const changeItemCorpoRecibo = (event: any, campo: string) => {
    setItemObj({ ...itemObj, [campo]: event.target.value });
  };

  const addItemCorpoRecibo = () => {
    if (!isAddMode) {
      novoRecibo.codRecibo = recibo.Código_Recibo;
    }

    if (novoRecibo.codRecibo == undefined) {
      return toast.error(`Indique um código para este recibo.`, {
        position: "bottom-center",
        style: {
          width: "264px"
        }
      });
    }

    let isItemVazio = Object.values(itemObj).length != 0 ? itemObj.descrição == "" || itemObj.competência == "" || itemObj.valor == 0 : true;

    if (isItemVazio) {
      return toast.error(`O objeto possui algum campo vazio.`, {
        position: "bottom-center",
        style: {
          width: "264px"
        }
      });
    }

    let desc = descricoes.find((item: any) => item.text == itemObj["descrição"]);
    let corpo = {
      Código_Recibo: Number(novoRecibo.codRecibo),
      CodDaDescrição: desc.id,
      Competência: itemObj["competência"],
      ValorAPagar: itemObj["valor"]
    };

    adicionarCorpoRecibo(corpo);
  };

  useEffect(() => {
    const formatterDate = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" });

    if (recibo != undefined && corpoRows != undefined && clienteData != undefined) {
      let reciboFormatado = structuredClone(recibo);
      reciboFormatado.Razão_Social = clienteData.Razão_Social;
      reciboFormatado.ValorTotal = valorTotal;

      let corpoReciboFormatado = structuredClone(corpoRows);
      corpoReciboFormatado.map((crf: any) => {
        crf.Descrição = descricoes.find((item: any) => crf.CodDaDescrição == item.id).text;
        crf.ValorAPagar = currency.format(crf.ValorAPagar);
        return crf;
      });

      let documentPdf = {
        ...reciboFormatado,
        CorpoRecibo: corpoReciboFormatado
      };

      setpdfObject([documentPdf]);
    }
  }, [corpoRows, recibo, clienteData, valorTotal]);

  function exportPdf() {
    if (corpoRows.length == 0) {
      return toast.error(`Recibo sem corpo informado.`, {
        position: "bottom-center",
        style: {
          width: "264px"
        }
      });
    }
    generatePDF(pdfObject);
  }

  return (
    <div className="w-full h-full overflow-auto p-5">
      <button
        type="button"
        onClick={() =>
          navigate("/TiposRecibos", {
            state: {
              name: "recibos"
            }
          })
        }
        className="text-white mx-4 bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none ocus:ring-red-800 rounded-lg text-sm px-5 py-2 text-center"
      >
        Voltar
      </button>
      <div className="grid grid-cols-2 gap-4">
        <div className="m-4 max-lg:mb-0 max-lg:text-sm">
          <label className="block mb-2 text-md text-gray-900">Cliente</label>
          <select
            value={clienteData?.Razão_Social}
            id="clientes"
            className="border text-white text-sm rounded-lg block w-full p-1.5 bg-gray-700 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
            onChange={changeCliente}
          >
            <option key="D" value="DEFAULT">
              Selecione um cliente
            </option>
            {clientes.map((item: any, index: number) => {
              return (
                <option key={index} value={item.Razão_Social}>
                  {item.Razão_Social}
                </option>
              );
            })}
          </select>
        </div>
        <div className="m-4 max-lg:mb-0 max-lg:text-sm">
          <label className="block mb-2 text-md text-gray-900">CNPJ</label>
          <CNPJInput cnpj={cnpj} disabled={true} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="m-4 max-lg:mb-0 max-lg:text-sm">
          <label className="block mb-2 text-md text-gray-900">Contato</label>
          <input
            type="text"
            id="contato"
            disabled={true}
            defaultValue={clienteData?.Contato_1}
            className="border text-white text-sm rounded-lg block w-full p-1.5 bg-gray-700 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="m-4 max-lg:mb-0 max-lg:text-sm">
          <label className="block mb-2 text-md text-gray-900">Telefone</label>
          <input
            type="text"
            id="telefone"
            disabled={true}
            defaultValue={clienteData?.Fone_1}
            className="border text-white text-sm rounded-lg  block w-full p-1.5 bg-gray-700 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>
      <div className="m-4 max-lg:text-sm">
        <label className="block mb-2 text-md text-gray-900">E-mail</label>
        <input
          type="text"
          id="email"
          disabled={true}
          defaultValue={clienteData?.["E-Mail1"]}
          className="border text-white text-sm rounded-lg block w-full p-1.5 bg-gray-700 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <hr className="mt-8 mb-4 mx-4 h-0.5 border-t-0 bg-black/30" />

      <div className="grid grid-cols-10 gap-0">
        <div className="col-span-2 m-4 justify-center items-center max-lg:mt-0 lg:flex lg:justify-evenly">
          <label className="block mb-2 text-sm text-gray-900 lg:m-0">Recibo</label>
          <input
            type="text"
            id="recibo"
            defaultValue={novoRecibo.codRecibo}
            // onChange={(e) => (novoRecibo.codRecibo = e.target.value)}
            className="border text-sm rounded-lg block w-full max-w-20 p-1.5 text-white bg-gray-700 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 lg:w-52 lg:min-w-10 lg:justify-between"
            placeholder="#001"
            disabled
            required
          />
        </div>
        <div className="col-span-2 my-4 justify-center items-center max-lg:mt-0 lg:flex lg:justify-between">
          <label className="block mb-2 text-sm text-gray-900 lg:m-0">Emissão</label>
          <input
            type="datetime-local"
            id="emissao"
            defaultValue={recibo?.Emissão}
            onChange={(e) => (novoRecibo.emissao = e.target.value)}
            className="border text-sm rounded-lg block w-full min-w-32 p-1.5 text-white bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500 lg:max-w-40 lg:justify-between"
            required
          />
        </div>
        <div className="col-span-2 m-4 mr-0 justify-self-center max-lg:mt-0 lg:flex lg:items-center lg:justify-evenly">
          <label className="block mb-5 text-sm text-gray-900 lg:m-0 lg:mr-2">Baixa</label>
          <input
            type="checkbox"
            id="baixa"
            defaultChecked={recibo?.Baixa == "Sim"}
            onChange={(e) => (novoRecibo.baixa = e.target.checked ? "Sim" : "Não")}
            className="border rounded-lg block w-full p-1.5 text-white bg-gray-700 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 lg:w-max"
            required
          />
        </div>
        <div className="col-span-2 my-4 justify-center items-center max-lg:mt-0 lg:flex lg:justify-evenly">
          <label className="block mb-2 w-full text-sm text-gray-900 lg:m-0">Data da Baixa</label>
          <input
            type="datetime-local"
            id="dataBaixa"
            defaultValue={recibo?.Data_Baixa}
            onChange={(e) => (novoRecibo.dataBaixa = e.target.value)}
            className="border text-sm rounded-lg block w-full min-w-32 p-1.5 text-white bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500 lg:max-w-40 lg:justify-between"
            required
          />
        </div>
        <div className="col-span-2 m-4 justify-self-end md:justify-self-center max-lg:mt-0 lg:flex lg:items-center lg:justify-evenly">
          <label className="block mb-5 text-sm text-gray-900 lg:m-0 lg:mr-2">Fechado</label>
          <input
            type="checkbox"
            id="fechado"
            defaultChecked={recibo?.Fechado == "Sim"}
            onChange={(e) => (novoRecibo.fechado = e.target.checked ? "Sim" : "Não")}
            className="border rounded-lg block w-max p-1.5 text-white bg-gray-700 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 max-md:float-end md:w-full lg:w-max"
            required
          />
        </div>
      </div>
      <div className="data-grid m-4 max-lg:mt-0" id="data-grid">
        <div className="w-full flex justify-between my-2">
          <label className="block mb-2 text-gray-900">Corpo do Recibo</label>
          <button type="button" className="w-28 h-8 text-center text-sm text-white self-end p-0 mx-1" onClick={clearFilters}>
            Limpar filtros
          </button>
        </div>
        <div className="p-2 bg-gray-600 rounded-lg">
          <FilterContext.Provider value={filters}>
            <DataGrid
              className="grid grid-cols-[minmax(30%,100%)_minmax(30%,100%)_minmax(30%,100%)] rounded-lg bg-gray-600"
              columns={columns}
              rows={createCorpoReciboRows(filteredRows, descricoes)}
              headerRowHeight={filters.enabled ? 70 : undefined}
              rowHeight={30}
              renderers={{ noRowsFallback: <EmptyRowsRenderer /> }}
            />
            <ul className="w-full flex px-4 pt-3 pb-1 gap-5">
              <Toaster containerClassName="text-sm" />
              <li className="flex w-full px-2 justify-between border border-gray-900 rounded-md ">
                <select
                  className="w-full focus:outline-none bg-gray-600 text-white"
                  value={itemObj?.descrição}
                  onChange={(e) => changeItemCorpoRecibo(e, "descrição")}
                >
                  <option key="T" value="Todos" disabled>
                    Todos
                  </option>
                  {descricoes.map(({ id, text }: any) => (
                    <option key={id} value={text}>
                      {text}
                    </option>
                  ))}
                </select>
              </li>
              <li className="flex w-full px-2 justify-between border border-gray-900 rounded-md">
                <input
                  className="w-full focus:outline-none bg-gray-600 text-white"
                  type="datetime-local"
                  value={itemObj?.competência}
                  onChange={(e) => changeItemCorpoRecibo(e, "competência")}
                  placeholder="Competência"
                />
              </li>
              <li className="flex w-full px-2 justify-between border border-gray-900 rounded-md">
                <input
                  className="w-full focus:outline-none bg-gray-600 text-white placeholder:text-white"
                  type="number"
                  value={itemObj?.valor}
                  onChange={(e) => changeItemCorpoRecibo(e, "valor")}
                  placeholder="Valor"
                />
              </li>
              <li className="flex w-max px-2 justify-between">
                <div onClick={addItemCorpoRecibo}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white cursor-pointer"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </li>
            </ul>
          </FilterContext.Provider>
        </div>
      </div>

      <div className="footer m-4 flex justify-between items-center">
        <div className="w-max flex">
          <button
            type="button"
            onClick={handleSubmit}
            className="text-white mr-2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none font-semibold rounded-lg text-sm px-5 py-2.5 text-center max-md:py-1.5 max-md:px-3"
          >
            {recibo ? <>Salvar Recibo</> : <>Criar Recibo</>}
          </button>
          <button
            onClick={exportPdf}
            type="button"
            className="w-max inline-flex items-center px-5 py-2.5 text-sm border rounded-e-lg focus:z-10 focus:ring-2 bg-gray-800 border-gray-700 text-white hover:text-white hover:bg-gray-700 focus:ring-blue-500 focus:text-white max-md:py-1.5 max-md:px-3"
          >
            <svg className="w-3 h-3 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
              <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
            </svg>
            Imprimir Recibo
          </button>
        </div>
        <div className="flex justify-center items-center">
          <label className="block content-center me-2 text-gray-900">Total</label>
          <input
            type="text"
            id="total"
            value={valorTotal}
            className="border text-white text-sm text-end rounded-lg block p-1.5 bg-gray-700 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
            placeholder="R$ 0,00"
            disabled
            required
          />
        </div>
      </div>
    </div>
  );
}

export default CadastroRecibo;
