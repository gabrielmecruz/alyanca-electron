/* eslint-disable no-empty-pattern */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createReciboRows } from "@/helpers/datagrid.helper";

import DataGrid, { ColumnOrColumnGroup, RenderHeaderCellProps } from "react-data-grid";
import "react-data-grid/lib/styles.css";
import { Filter } from "@/interfaces/filter.interface";
import { useNavigate, useParams } from "react-router-dom";
import RecibosService from "@/services/recibo.service";
import toast, { Toaster } from "react-hot-toast";

interface RecibosDataGridProps {}

const FilterContext = createContext<Filter | undefined>(undefined);

function selectStopPropagation(event: React.KeyboardEvent<HTMLSelectElement>) {
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
    event.stopPropagation();
  }
}

function EmptyRowsRenderer() {
  return (
    <div className="bg-gray-200 text-black p-4" style={{ textAlign: "center", gridColumn: "1/-1" }}>
      Sem dados
    </div>
  );
}

function ReciboDataGrid({}: RecibosDataGridProps) {
  const navigate = useNavigate();
  const page = Number(useParams().id);
  const [rows, setRows] = useState<any>([]);
  const [filters, setFilters] = useState(
    (): Filter => ({
      codRecibo: "Todos",
      emissao: "",
      dataBaixa: "",
      baixa: false,
      fechado: false,
      complete: undefined,
      enabled: false
    })
  );

  useEffect(() => {
    RecibosService.getRecibos().then((res: any) => {
      setRows(res);
    });
  }, []);

  const recibos = useMemo(() => {
    switch (page) {
      case 1:
        return rows.filter((c: any) => c.Baixa == "False");
      case 2:
        return rows.filter((c: any) => c.Baixa == "True");
      case 3:
        return rows.filter((c: any) => c.Fechado == "False");
      case 4:
        return rows.filter((c: any) => c.Fechado == "True");
      case 0:
      default:
        return rows;
    }
  }, [rows, page]);

  function FilterRenderer<R>({
    tabIndex,
    column,
    children
  }: RenderHeaderCellProps<R> & {
    children: (args: { tabIndex: number; filters: Filter }) => React.ReactElement;
  }) {
    const filters = useContext(FilterContext)!;
    return (
      <div className="w-full flex flex-col items-center">
        <div>{column.name}</div>
        {filters.enabled && <div className="w-full px-3">{children({ tabIndex, filters })}</div>}
      </div>
    );
  }

  const columns = useMemo((): readonly ColumnOrColumnGroup<any>[] => {
    return [
      {
        key: "codRecibo",
        name: "Código",
        headerCellClass:
          "filter-cell flex flex-col size-full justify-evenly items-center text-align-center border border-gray-600 bg-gray-400 text-black",
        cellClass: "size-full flex border justify-start items-center border-gray-600 bg-gray-200 text-black",
        renderHeaderCell: (p) => (
          <FilterRenderer<any> {...p}>
            {({ filters, ...rest }) => (
              <select
                {...rest}
                className={"w-full bg-gray-200"}
                value={filters.codRecibo}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    codRecibo: e.target.value
                  })
                }
                onKeyDown={selectStopPropagation}
              >
                <option key="Todos" value="Todos">
                  Todos
                </option>

                {recibos.map((row: any, index: number) => {
                  return (
                    <option key={index} value={row.Código_Recibo}>
                      {row.Código_Recibo}
                    </option>
                  );
                })}
              </select>
            )}
          </FilterRenderer>
        )
      },
      {
        key: "emissao",
        name: "Emissão",
        headerCellClass:
          "filter-cell flex flex-col size-full justify-evenly items-center text-align-center border border-gray-600 bg-gray-400 text-black",
        cellClass: "size-full flex border justify-start items-center border-gray-600 bg-gray-200 text-black",
        renderHeaderCell: (p) => (
          <FilterRenderer<any> {...p}>
            {({ filters, ...rest }) => (
              <input
                type="date"
                {...rest}
                className={"bg-gray-200 w-full"}
                value={filters.emissao}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    emissao: e.target.value == "" ? e.target.value : new Date(e.target.value).toISOString().split("T")[0]
                  })
                }
              />
            )}
          </FilterRenderer>
        )
      },
      {
        key: "baixa",
        name: "Baixa",
        headerCellClass:
          "filter-cell flex flex-col size-full justify-evenly items-center text-align-center border border-gray-600 bg-gray-400 text-black",
        cellClass: "size-full flex border justify-start items-center border-gray-600 bg-gray-200 text-black"
      },
      {
        key: "dataBaixa",
        name: "Data Baixa",
        headerCellClass:
          "filter-cell flex flex-col size-full justify-evenly items-center text-align-center border border-gray-600 bg-gray-400 text-black",
        cellClass: "size-full flex border justify-start items-center border-gray-600 bg-gray-200 text-black",
        renderHeaderCell: (p) => (
          <FilterRenderer<any> {...p}>
            {({ filters, ...rest }) => (
              <input
                type="date"
                {...rest}
                className={"w-full bg-gray-200 px-1"}
                value={filters.dataBaixa}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    dataBaixa: e.target.value == "" ? e.target.value : new Date(e.target.value).toISOString().split("T")[0]
                  })
                }
              />
            )}
          </FilterRenderer>
        )
      },
      {
        key: "fechado",
        name: "Fechado",
        headerCellClass:
          "filter-cell flex flex-col size-full justify-evenly items-center text-align-center border border-gray-600 bg-gray-400 text-black",
        cellClass: "size-full flex border justify-start items-center border-gray-600 bg-gray-200 text-black"
      },
      {
        key: "acoes",
        name: "Ações",
        headerCellClass: "filter-cell flex size-full justify-center items-center border border-gray-600 bg-gray-400 text-black sm:flex-row",
        cellClass: "size-full flex border justify-center items-center border-gray-600 bg-gray-200 text-black",
        renderCell: (props) => (
          <div className="actions size-full flex justify-evenly">
            <button
              onClick={() =>
                navigate(`/EditarRecibo/${props.row.codRecibo}`, {
                  state: {
                    name: "edit"
                  }
                })
              }
              className="w-auto h-full px-0 py-[6px] select-none bg-transparent shadow-none border-none"
              type="button"
            >
              <svg className="size-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z" />
              </svg>
            </button>
          </div>
        )
      }
    ];
  }, [recibos]);

  const filteredRows = useMemo(() => {
    return recibos.filter((r: any) => {
      filters.baixa = filters.baixa.toString().toLowerCase();
      filters.fechado = filters.fechado.toString().toLowerCase();
      return (
        (filters.codRecibo !== "Todos" ? r.Código_Recibo == filters.codRecibo : true) &&
        (filters.emissao ? new Date(r.Emissão).toISOString().split("T")[0] == filters.emissao : true) &&
        (filters.dataBaixa ? new Date(r.Data_Baixa).toISOString().split("T")[0] == filters.dataBaixa : true)
      );
    });
  }, [recibos, filters]);

  function clearFilters() {
    if (!filters.enabled) {
      return toast.error("Não há filtros selecionados", {
        position: "bottom-center",
        style: {
          width: "264px"
        }
      });
    }
    setFilters({
      codRecibo: "Todos",
      emissao: "",
      dataBaixa: "",
      baixa: false,
      fechado: false,
      complete: undefined,
      enabled: true
    });
  }

  function toggleFilters() {
    setFilters((filters) => ({
      ...filters,
      enabled: !filters.enabled
    }));
  }

  return (
    <div className={"size-full max-h-[90%] flex flex-col text-white " + `${recibos.length == 0 ? "max-lg:mb-20" : ""}`}>
      <div className="w-full flex justify-end items-center mb-3">
        <Toaster containerClassName="text-sm" />
        <button
          type="button"
          className={"w-16 h-8 text-center text-sm self-end p-0 mx-1 " + `${filters.enabled ? "border border-gray-200" : ""}`}
          onClick={toggleFilters}
        >
          Filtrar
        </button>
        <button type="button" className="w-28 h-8 text-center text-sm self-end p-0 mx-1" onClick={clearFilters}>
          Limpar filtros
        </button>
      </div>
      <div className="w-full max-h-[80%] border rounded-lg bg-gray-700 border-gray-600 font-medium py-2 px-1">
        <FilterContext.Provider value={filters}>
          <DataGrid
            className={
              "size-full overflow-auto rounded-lg grid grid-cols-[minmax(15%,100%)_minmax(35%,100%)_minmax(15%,100%)_minmax(35%,100%)_minmax(15%,100%)_minmax(15%,100%)] sm:grid-cols-[minmax(15%,100%)_minmax(32%,100%)_minmax(10%,100%)_minmax(32%,100%)_minmax(15%,100%)_minmax(15%,100%)] md:grid-cols-[minmax(12%,100%)_minmax(27%,100%)_minmax(10%,100%)_minmax(27%,100%)_minmax(12%,100%)_minmax(12%,100%)] lg:grid-cols-[minmax(12%,100%)_minmax(27%,100%)_minmax(10%,100%)_minmax(27%,100%)_minmax(12%,100%)_minmax(12%,100%)]"
            }
            columns={columns}
            rows={createReciboRows(filteredRows)}
            headerRowHeight={filters.enabled ? 70 : undefined}
            rowHeight={30}
            renderers={{ noRowsFallback: <EmptyRowsRenderer /> }}
          />
        </FilterContext.Provider>
      </div>
    </div>
  );
}

export default ReciboDataGrid;
