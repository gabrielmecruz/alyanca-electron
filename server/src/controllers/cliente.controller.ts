import { Response, Request } from 'express'
import Cliente from '../models/Cliente.js'

async function obterClientes(req: Request, res: Response) {
  try {
    const clientes = await Cliente.all()
    res.json(clientes)
  } catch (err) {
    res.json({
      error: err
    })
  }
}

async function obterCliente(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const [cliente] = await Cliente.find(id)
    res.json({
      message: "Cliente encontrado com sucesso!",
      success: true,
      cliente: cliente
    })
  } catch (err) {
    res.json({
      message: "Ocorreu um erro ao encontrar cliente.",
      success: false,
      error: err
    })
  }
}

async function adicionarCliente(req: Request, res: Response) {
  try {
    const { Código_Cliente, Razão_Social, Fantasia, CNPJ, IE, IM, Contato_1, Contato_2, Fone_1, Fone_2, Fax, 'E-Mail1': EMail1, 'E-Mail2': EMail2, Site, Logradouro, Número, Complemento, Bairro, CEP, UF } = req.body
    const cliente = await Cliente.create(Código_Cliente, Razão_Social, Fantasia, CNPJ, IE, IM, Contato_1, Contato_2, Fone_1, Fone_2, Fax, EMail1, EMail2, Site, Logradouro, Número, Complemento, Bairro, CEP, UF)

    if (!cliente.affectedRows) {
      res.json({
        message: "Falha no registro, não adicionado.",
        success: false,
      })
      return
    }
    res.json({
      message: "Cliente adicionado com sucesso!",
      success: true,
      cliente: cliente
    })
  } catch (err) {
    res.json({
      message: "Ocorreu um erro ao adicionar cliente.",
      success: false,
      error: err
    })
  }
}

async function atualizarCliente(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const { Código_Cliente, Razão_Social, Fantasia, CNPJ, IE, IM, Contato_1, Contato_2, Fone_1, Fone_2, Fax, 'E-Mail1': EMail1, 'E-Mail2': EMail2, Site, Logradouro, Número, Complemento, Bairro, CEP, UF } = req.body
    const cliente = await Cliente.updateAllById({
      values: [Código_Cliente, Razão_Social, Fantasia, CNPJ, IE, IM, Contato_1, Contato_2, Fone_1, Fone_2, Fax, EMail1, EMail2, Site, Logradouro, Número, Complemento, Bairro, CEP, UF],
      id: id
    })

    if (!cliente.changedRows) {
      res.json({
        message: "Falha no registro, não atualizado.",
        success: false,
      })
      return
    }
    res.json({
      message: "Cliente atualizado com sucesso!",
      success: true,
      cliente: cliente
    })

  } catch (err) {
    res.json({
      message: "Ocorreu um erro ao atualizar cliente.",
      success: false,
      error: err
    })
  }
}

async function removerCliente(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const cliente = await Cliente.deleteOneById(id)

    if (!cliente.affectedRows) {
      res.json({
        message: "Nenhum registro foi encontrado.",
        success: false,
      })
      return
    }
    res.json({
      message: "Cliente removido com sucesso!",
      success: true,
      cliente: cliente
    })

  } catch (err) {
    res.json({
      message: "Não foi possível remover o cliente.",
      success: false,
      error: err
    })
  }
}

export {
  obterCliente,
  obterClientes,
  adicionarCliente,
  atualizarCliente,
  removerCliente,
}