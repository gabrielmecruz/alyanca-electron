/* eslint-disable no-empty-pattern */
import { createContext, useContext, useMemo, useState } from "react";
import { createClienteRows } from "@/helpers/datagrid.helper";

import DataGrid, { ColumnOrColumnGroup, RenderHeaderCellProps } from "react-data-grid";
import "react-data-grid/lib/styles.css";
import ClientesService from "@/services/clientes.service";
import { Filter } from "@/interfaces/filter.interface";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

interface ClientesDataGridProps {
  rows: any[];
  setRows: React.Dispatch<React.SetStateAction<any>>;
}

const FilterContext = createContext<Filter | undefined>(undefined);

function EmptyRowsRenderer() {
  return (
    <div className="bg-gray-200 text-black p-4" style={{ textAlign: "center", gridColumn: "1/-1" }}>
      Sem dados
    </div>
  );
}

function ClientesDataGrid({ rows, setRows }: ClientesDataGridProps) {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(
    (): Filter => ({
      codCliente: "Todos",
      razaoSocial: "",
      cnpj: "",
      complete: undefined,
      enabled: false
    })
  );

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
        key: "codCliente",
        name: "Código",
        editable: true,
        headerCellClass:
          "filter-cell flex flex-col size-full justify-evenly items-center text-align-center border border-gray-600 bg-gray-400 text-black",
        cellClass: "size-full flex border justify-start items-center border-gray-600 bg-gray-200 text-black",
        renderHeaderCell: (p) => (
          <FilterRenderer<any> {...p}>
            {({ filters, ...rest }) => (
              <select
                {...rest}
                className={"w-full bg-gray-200"}
                value={filters.codCliente}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    codCliente: e.target.value
                  })
                }
              >
                <option key="T" value="Todos">
                  Todos
                </option>

                {rows.map((row: any, index: number) => (
                  <option key={index} value={row.Código_Cliente}>
                    {row.Código_Cliente}
                  </option>
                ))}
              </select>
            )}
          </FilterRenderer>
        )
      },
      {
        key: "razaoSocial",
        name: "Razão Social",
        editable: true,
        headerCellClass:
          "filter-cell flex flex-col size-full justify-evenly items-center text-align-center border border-gray-600 bg-gray-400 text-black",
        cellClass: "size-full flex border justify-start items-center border-gray-600 bg-gray-200 text-black",
        renderHeaderCell: (p) => (
          <FilterRenderer<any> {...p}>
            {({ filters, ...rest }) => (
              <input
                {...rest}
                className={"bg-gray-200 w-full"}
                value={filters.razaoSocial}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    razaoSocial: e.target.value
                  })
                }
              />
            )}
          </FilterRenderer>
        )
      },
      {
        key: "cnpj",
        name: "CNPJ",
        editable: true,
        headerCellClass:
          "filter-cell flex flex-col size-full justify-evenly items-center text-align-center border border-gray-600 bg-gray-400 text-black",
        cellClass: "size-full flex border justify-start items-center border-gray-600 bg-gray-200 text-black",
        renderHeaderCell: (p) => (
          <FilterRenderer<any> {...p}>
            {({ filters, ...rest }) => (
              <input
                {...rest}
                className={"w-full bg-gray-200 px-1"}
                value={filters.cnpj}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    cnpj: e.target.value
                  })
                }
              />
            )}
          </FilterRenderer>
        )
      },
      {
        key: "acoes",
        name: "Ações",
        editable: true,
        headerCellClass: "filter-cell flex size-full justify-center items-center border border-gray-600 bg-gray-400 text-black sm:flex-row",
        cellClass: "size-full flex border justify-center items-center border-gray-600 bg-gray-200 text-black",
        renderCell: (props) => (
          <div className="actions size-full flex justify-evenly">
            <button
              onClick={() =>
                navigate(`/EditarCliente/${props.row.codCliente}`, {
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
            <button
              onClick={() => {
                ClientesService.deleteCliente(props.row.codCliente).then((e) =>
                  toast.success("Cliente excluido com sucesso!", {
                    position: "bottom-center",
                    style: {
                      width: "264px"
                    }
                  })
                );
                let cliente = rows.find((item: any) => props.row.codCliente == item.Código_Cliente);
                let index = rows.indexOf(cliente);
                rows.splice(index, 1);
                setRows([...rows]);
              }}
              className="w-auto h-full px-0 py-[6px] select-none bg-transparent shadow-none border-none"
              type="button"
            >
              <svg className="size-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" />
              </svg>
            </button>
          </div>
        )
      }
    ];
  }, [rows]);

  const filteredRows = useMemo(() => {
    return rows.filter((r: any) => {
      return (
        (filters.codCliente !== "Todos" ? r.Código_Cliente == filters.codCliente : true) &&
        (filters.razaoSocial ? r.Razão_Social.toLowerCase().includes(filters.razaoSocial.toLowerCase()) : true) &&
        (filters.cnpj ? r.CNPJ.includes(filters.cnpj) : true)
      );
    });
  }, [rows, filters]);

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
      codCliente: "Todos",
      razaoSocial: "",
      cnpj: "",
      complete: undefined,
      enabled: false
    });
  }

  function toggleFilters() {
    setFilters((filters) => ({
      ...filters,
      enabled: !filters.enabled
    }));
  }

  return (
    <div className={"size-full max-h-[90%] flex flex-col text-white " + `${rows.length == 0 ? "max-lg:mb-20" : ""}`}>
      <div className="w-full flex justify-end items-center mb-3">
        <Toaster containerClassName="text-sm" />
        <button
          type="button"
          className={"w-16 h-8 text-center text-white text-sm self-end p-0 mx-1 bg-gray-900 " + `${filters.enabled ? "border border-gray-200" : ""}`}
          onClick={toggleFilters}
        >
          Filtrar
        </button>
        <button type="button" className="w-28 h-8 text-center text-white text-sm self-end p-0 mx-1 bg-gray-900" onClick={clearFilters}>
          Limpar filtros
        </button>
      </div>
      <div className="w-full max-h-[80%] border rounded-lg bg-gray-700 border-gray-600 font-medium py-2 px-1">
        <FilterContext.Provider value={filters}>
          <DataGrid
            className="h-full overflow-auto rounded-lg grid grid-cols-[minmax(5%,25%)_minmax(30%,100%)_minmax(0%,0%)_minmax(10%,100%)] md:grid-cols-[minmax(10%,20%)_minmax(30%,100%)_minmax(15%,100%)_minmax(15%,100%)] lg:md:grid-cols-[minmax(10%,20%)_minmax(30%,100%)_minmax(10%,100%)_minmax(15%,100%)]"
            columns={columns}
            rows={createClienteRows(filteredRows)}
            headerRowHeight={filters.enabled ? 70 : undefined}
            rowHeight={30}
            renderers={{ noRowsFallback: <EmptyRowsRenderer /> }}
          />
        </FilterContext.Provider>
      </div>
    </div>
  );
}

export default ClientesDataGrid;
