import ClientesService from "@/services/clientes.service";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";

interface IClienteProps {}

function CadastroCliente({}: IClienteProps) {
  const param = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const clientes = location.state.clientes || [];
  const isAddMode = location.state.name == "add";
  const [data, setData] = useState<Cliente>();
  const newId = isAddMode && clientes.length != 0 ? clientes[clientes.length - 1].Código_Cliente + 1 : param.id;

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors }
  } = useForm<Cliente>();

  const onSubmit: SubmitHandler<Cliente> = async (dataForm) => {
    const novoCliente = {
      Código_Cliente: dataForm.codCliente != undefined ? dataForm.codCliente : data?.codCliente,
      Razão_Social: dataForm.razaoSocial != "" ? dataForm.razaoSocial : data?.razaoSocial,
      Fantasia: dataForm.nomeFantasia != "" ? dataForm.nomeFantasia : data?.nomeFantasia,
      CNPJ: dataForm.cnpj != "" ? dataForm.cnpj : data?.cnpj,
      IE: dataForm.ie != "" ? dataForm.ie : data?.ie,
      IM: dataForm.im != "" ? dataForm.im : data?.im,
      Contato_1: dataForm.contatos[0] != "" ? dataForm.contatos[0] : data?.contatos[0],
      Contato_2: dataForm.contatos[1] != "" ? dataForm.contatos[1] : data?.contatos[1],
      Fone_1: dataForm.telefones[0] != "" ? dataForm.telefones[0] : data?.telefones[0],
      Fone_2: dataForm.telefones[1] != "" ? dataForm.telefones[1] : data?.telefones[1],
      Fax: dataForm.fax != "" ? dataForm.fax : data?.fax,
      "E-Mail1": dataForm.emails[0] != "" ? dataForm.emails[0] : data?.emails[0],
      "E-Mail2": dataForm.emails[1] != "" ? dataForm.emails[1] : data?.emails[1],
      Site: dataForm.site != "" ? dataForm.site : data?.site,
      Logradouro: dataForm.logradouro != "" ? dataForm.logradouro : data?.logradouro,
      Número: dataForm.numero != "" ? dataForm.numero : data?.numero,
      Complemento: dataForm.complemento != "" ? dataForm.complemento : data?.complemento,
      Bairro: dataForm.bairro != "" ? dataForm.bairro : data?.bairro,
      CEP: dataForm.cep != "" ? dataForm.cep : data?.cep,
      UF: dataForm.uf != "" ? dataForm.uf : data?.uf
    };

    try {
      if (isAddMode) {
        await ClientesService.addCliente(novoCliente).then((res: any) => {
          if (res.success) {
            navigate("/Clientes");
          }
        });
      } else {
        await ClientesService.updateCliente(Number(data?.codCliente), novoCliente).then((res: any) => {
          if (res.success) {
            navigate("/Clientes");
          } else {
            return toast.error(`Nenhum campo atualizado.`, {
              position: "bottom-center",
              style: {
                width: "264px"
              }
            });
          }
        });
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  useEffect(() => {
    setData({
      codCliente: newId,
      razaoSocial: "",
      nomeFantasia: "",
      cnpj: "",
      ie: "",
      im: "",
      contatos: ["", ""],
      telefones: ["", ""],
      fax: "",
      emails: ["", ""],
      site: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cep: "",
      uf: ""
    });
  }, []);

  useEffect(() => {
    if (!isAddMode) {
      ClientesService.getCliente(param.id).then((res: any) => {
        if (res)
          setData({
            codCliente: res.cliente["Código_Cliente"],
            razaoSocial: res.cliente["Razão_Social"],
            nomeFantasia: res.cliente["Fantasia"],
            cnpj: res.cliente["CNPJ"],
            ie: res.cliente["IE"],
            im: res.cliente["IM"],
            contatos: [res.cliente["Contato_1"], res.cliente["Contato_2"]],
            telefones: [res.cliente["Fone_1"], res.cliente["Fone_2"]],
            fax: res.cliente["Fax"],
            emails: [res.cliente["E-Mail1"], res.cliente["E-Mail2"]],
            site: res.cliente["Site"],
            logradouro: res.cliente["Logradouro"],
            numero: res.cliente["Número"],
            complemento: res.cliente["Complemento"],
            bairro: res.cliente["Bairro"],
            cep: res.cliente["CEP"],
            uf: res.cliente["UF"]
          });
      });
    }
  }, []);

  return (
    <div className="w-full h-full overflow-auto p-10">
      {/* "handleSubmit" will validate your inputs before invoking "onSubmit" */}
      <div className="size-full">
        <button
          type="button"
          onClick={() => navigate("/Clientes")}
          className="text-white ml-4 bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-800 font-semibold rounded-lg text-sm text-center me-2 mb-2"
        >
          Voltar
        </button>

        <div className="w-full flex justify-center">
          <h1 className="text-5xl max-sm:text-4xl">{data ? <>Editar Cliente</> : <>Adicionar Cliente</>}</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2 gap-y-4 my-8 grid-cols-6 w-full lg:gap-6 lg:gap-y-8">
            <div className="col-span-2 mx-4 lg:col-span-1">
              <label className="block mb-1 text-sm font-semibold text-gray-900">Cod. Cliente</label>
              <input
                type="number"
                id="codCliente"
                defaultValue={data?.codCliente}
                {...register("codCliente", { value: data?.codCliente })}
                className="border text-white text-sm rounded-lg block w-full p-1.5 bg-gray-700 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                disabled
                required
              />
            </div>
            <div className="col-span-4 mx-4 lg:col-span-3">
              <label className="block mb-1 text-sm font-semibold text-gray-900">Razão Social</label>
              <input
                type="text"
                id="razaoSocial"
                defaultValue={data?.razaoSocial}
                className="border text-white text-sm rounded-lg  block w-full p-1.5 bg-gray-700 border-gray-600 placeholder-gray-400 "
                placeholder="A F G CONSTR DE EDIF E LOC EQUIP LTDA"
                {...register("razaoSocial")}
                onChange={(e) => {
                  let value = "";
                  if (e.target.value == "") value = e.target.defaultValue;
                  else value = e.target.value;
                  return setValue("razaoSocial", value, { shouldValidate: true });
                }}
                required
              />
            </div>
            <div className="col-start-3 col-span-4 mx-4 lg:col-span-2">
              <label className="block mb-1 text-sm font-semibold text-gray-900">Nome Fantasia</label>
              <input
                type="text"
                id="nomeFantasia"
                defaultValue={data?.nomeFantasia}
                className="border text-white text-sm rounded-lg  block w-full p-1.5 bg-gray-700 border-gray-600 placeholder-gray-400 "
                placeholder="AFG Construções de Edificios e Loc LTDA"
                {...register("nomeFantasia")}
                onChange={(e) => setValue("nomeFantasia", e.target.value, { shouldValidate: true })}
                required
              />
            </div>
            <div className="col-span-2 mx-4">
              <label className="block mb-1 text-sm font-semibold text-gray-900">CNPJ</label>
              <input
                type="text"
                id="CNPJ"
                className="border text-white text-sm rounded-lg  block w-full p-1.5 bg-gray-700 border-gray-600 placeholder-gray-400 "
                placeholder="12.345.678/0001-99"
                maxLength={14}
                defaultValue={data?.cnpj}
                pattern="[0-9]+"
                {...register("cnpj")}
                onChange={(e) => setValue("cnpj", e.target.value, { shouldValidate: true })}
                required
              />
            </div>
            <div className="col-span-2 mx-4 lg:col-span-2">
              <label className="block mb-1 text-sm font-semibold text-gray-900">IE</label>
              <input
                type="text"
                id="ie"
                defaultValue={data?.ie}
                className="border text-white text-sm rounded-lg  block w-full p-1.5 bg-gray-700 border-gray-600 placeholder-gray-400 "
                placeholder="123456789.00-00"
                maxLength={13}
                {...register("ie")}
                onChange={(e) => setValue("ie", e.target.value, { shouldValidate: true })}
              />
            </div>
            <div className="col-span-2 mx-4 lg:col-span-2">
              <label className="block mb-1 text-sm font-semibold text-gray-900">IM</label>
              <input
                type="text"
                id="im"
                defaultValue={data?.im}
                className="border text-white text-sm rounded-lg  block w-full p-1.5 bg-gray-700 border-gray-600 placeholder-gray-400 "
                placeholder="009876543.21-00"
                maxLength={13}
                {...register("im")}
                onChange={(e) => setValue("im", e.target.value, { shouldValidate: true })}
              />
            </div>
            <div className="col-span-3 ml-4 lg:col-span-1">
              <label className="block mb-1 text-sm font-semibold text-gray-900">Contatos</label>
              <input
                type="tel"
                id="contato1"
                defaultValue={data?.contatos[0]}
                className="border text-white text-sm rounded-lg  block w-full p-1.5 bg-gray-700 border-gray-600 placeholder-gray-400 "
                placeholder="(62) 99876-5432"
                maxLength={11}
                {...register("contatos.0")}
                onChange={(e) => setValue("contatos.0", e.target.value, { shouldValidate: true })}
                required
              />
            </div>
            <div className="col-span-3 mr-4 mt-4 lg:col-span-1">
              <label className="mt-2 block mb-1 text-sm font-semibold text-gray-900"></label>
              <input
                type="tel"
                id="contato2"
                defaultValue={data?.contatos[1]}
                className="border text-white text-sm rounded-lg  block w-full p-1.5 bg-gray-700 border-gray-600 placeholder-gray-400 "
                placeholder="(62) 91234-5678"
                maxLength={11}
                {...register("contatos.1")}
                onChange={(e) => setValue("contatos.1", e.target.value, { shouldValidate: true })}
              />
            </div>
            <div className="col-start-1 col-span-2 ml-4 lg:col-span-1">
              <label className="block mb-1 text-sm font-semibold text-gray-900">Telefones</label>
              <input
                type="tel"
                id="telefone1"
                defaultValue={data?.telefones[0]}
                className="border text-white text-sm rounded-lg  block w-full p-1.5 bg-gray-700 border-gray-600 placeholder-gray-400 "
                placeholder="(62) 91234-5678"
                maxLength={11}
                {...register("telefones.0")}
                onChange={(e) => setValue("telefones.0", e.target.value, { shouldValidate: true })}
              />
            </div>
            <div className="col-span-2 mr-4 mt-4 lg:col-span-1">
              <label className="mt-2 block mb-1 text-sm font-semibold text-gray-900"></label>
              <input
                type="tel"
                id="telefone2"
                defaultValue={data?.telefones[1]}
                placeholder="(62) 91234-5678"
                maxLength={11}
                {...register("telefones.1")}
                onChange={(e) => setValue("telefones.1", e.target.value, { shouldValidate: true })}
                className="border text-white text-sm rounded-lg  block w-full p-1.5 bg-gray-700 border-gray-600 placeholder-gray-400 "
              />
            </div>
            <div className="col-start-5 col-span-2 mx-4 lg:col-start-6 lg:col-span-1 lg:ml-0">
              <label className="block mb-1 text-sm font-semibold text-gray-900">Fax</label>
              <input
                type="tel"
                id="fax"
                defaultValue={data?.fax}
                className="border text-white text-sm rounded-lg  block w-full p-1.5 bg-gray-700 border-gray-600 placeholder-gray-400 "
                placeholder="(62) 3124-5678"
                maxLength={11}
                {...register("fax")}
                onChange={(e) => setValue("fax", e.target.value, { shouldValidate: true })}
              />
            </div>
            <div className="col-span-2 ml-4 lg:col-span-2">
              <label className="block mb-1 text-sm font-semibold text-gray-900">E-mail</label>
              <input
                type="email"
                id="email1"
                defaultValue={data?.emails[0]}
                className="border text-white text-sm rounded-lg  block w-full p-1.5 bg-gray-700 border-gray-600 placeholder-gray-400 "
                placeholder="flowbite@mail.com"
                {...register("emails.0")}
                onChange={(e) => setValue("emails.0", e.target.value, { shouldValidate: true })}
                required
              />
            </div>
            <div className="col-span-2 mr-4 mt-4 lg:col-span-2">
              <label className="mt-2 block mb-1 text-sm font-semibold text-gray-900"></label>
              <input
                type="text"
                id="email2"
                defaultValue={data?.emails[1]}
                className="border text-white text-sm rounded-lg  block w-full p-1.5 bg-gray-700 border-gray-600 placeholder-gray-400 "
                {...register("emails.1")}
                onChange={(e) => setValue("emails.1", e.target.value, { shouldValidate: true })}
                required
              />
            </div>
            <div className="col-span-5 mx-4 lg:col-start-5 lg:col-span-2">
              <label className="block mb-1 text-sm font-semibold text-gray-900">Site</label>
              <input
                type="text"
                id="site"
                defaultValue={data?.site}
                className="border text-white text-sm rounded-lg  block w-full p-1.5 bg-gray-700 border-gray-600 placeholder-gray-400 "
                placeholder="flowbite.com.br"
                {...register("site")}
                onChange={(e) => setValue("site", e.target.value, { shouldValidate: true })}
              />
            </div>
            <div className="col-span-5 mx-4">
              <label className="block mb-1 text-sm font-semibold text-gray-900">Logradouro</label>
              <input
                type="text"
                id="logradouro"
                defaultValue={data?.logradouro}
                className="border text-white text-sm rounded-lg  block w-full p-1.5 bg-gray-700 border-gray-600 placeholder-gray-400 "
                {...register("logradouro")}
                onChange={(e) => setValue("logradouro", e.target.value, { shouldValidate: true })}
              />
            </div>
            <div className="col-span-1 mx-4">
              <label className="block mb-1 text-sm font-semibold text-gray-900">Número</label>
              <input
                type="number"
                id="numero"
                defaultValue={data?.numero}
                className="border text-white text-sm rounded-lg  block w-full p-1.5 bg-gray-700 border-gray-600 placeholder-gray-400 "
                {...register("numero")}
                onChange={(e) => setValue("numero", e.target.value, { shouldValidate: true })}
              />
            </div>
            <div className="col-span-4 mx-4">
              <label className="block mb-1 text-sm font-semibold text-gray-900">Complemento</label>
              <input
                type="text"
                id="complemento"
                defaultValue={data?.complemento}
                className="border text-white text-sm rounded-lg  block w-full p-1.5 bg-gray-700 border-gray-600 placeholder-gray-400 "
                {...register("complemento")}
                onChange={(e) => setValue("complemento", e.target.value, { shouldValidate: true })}
              />
            </div>
            <div className="col-span-2 mx-4">
              <label className="block mb-1 text-sm font-semibold text-gray-900">Bairro</label>
              <input
                type="text"
                id="bairro"
                defaultValue={data?.bairro}
                className="border text-white text-sm rounded-lg  block w-full p-1.5 bg-gray-700 border-gray-600 placeholder-gray-400 "
                {...register("bairro")}
                onChange={(e) => setValue("bairro", e.target.value, { shouldValidate: true })}
              />
            </div>
            <div className="col-start-1 col-span-2 mx-4">
              <label className="block mb-1 text-sm font-semibold text-gray-900">CEP</label>
              <input
                type="text"
                id="cep"
                defaultValue={data?.cep}
                className="border text-white text-sm rounded-lg  block w-full p-1.5 bg-gray-700 border-gray-600 placeholder-gray-400 "
                placeholder="00.000-000"
                {...register("cep")}
                onChange={(e) => setValue("cep", e.target.value, { shouldValidate: true })}
              />
            </div>
            <div className="col-start-5 col-span-2 mx-4">
              <label className="block mb-1 text-sm font-semibold text-gray-900">UF</label>
              <input
                type="text"
                id="uf"
                defaultValue={data?.uf}
                className="border text-white text-sm rounded-lg  block w-full p-1.5 bg-gray-700 border-gray-600 placeholder-gray-400 "
                maxLength={2}
                {...register("uf")}
                onChange={(event) => {
                  event.target.value = event.target.value.toUpperCase();
                  setValue("uf", event.target.value, { shouldValidate: true });
                }}
              />
            </div>
          </div>
          <div className="w-full flex justify-center ">
            <button
              type="submit"
              className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none font-semibold rounded-lg text-sm px-5 py-2.5 mb-5 text-center"
            >
              {data ? <>Salvar Cliente</> : <>Adicionar Cliente</>}
            </button>
            <Toaster containerClassName="text-sm" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default CadastroCliente;
