import { Response, Request } from 'express'
import Recibo from "../models/Recibo.js"

async function obterRecibos(req: Request, res: Response) {
  try {
    const recibos = await Recibo.all()
    res.json(recibos)
  } catch (err) {
    res.json({
      error: err
    })
  }
}

async function obterRecibo(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const [recibo] = await Recibo.find(id)
    res.json({
      message: "Recibo encontrado com sucesso!",
      success: true,
      recibo: recibo
    })
  } catch (err) {
    res.json({
      message: "Ocorreu um erro ao encontrar recibo.",
      success: false,
      error: err
    })
  }
}

async function adicionarRecibo(req: Request, res: Response) {
  try {
    const { Emissão, Código_Cliente, Baixa, Data_Baixa, Fechado } = req.body

    const recibo = await Recibo.create(Emissão, Código_Cliente, Baixa, Data_Baixa, Fechado)

    if (!recibo.affectedRows) {
      res.json({
        message: "Falha no registro, não adicionado.",
        success: false,
      })
      return
    }
    res.json({
      message: "Recibo adicionado com sucesso!",
      success: true,
      recibo: recibo
    })
  } catch (err) {
    res.json({
      message: "Ocorreu um erro ao adicionar recibo.",
      success: false,
      error: err
    })
  }
}

async function atualizarRecibo(req: Request, res: Response) {
  console.log(req.body)

  try {
    const id = Number(req.params.id)
    const { Código_Recibo, Emissão, Código_Cliente, Baixa, Data_Baixa, Fechado } = req.body
    const recibo = await Recibo.updateAllById({
      values: [Código_Recibo, Emissão, Código_Cliente, Baixa, Data_Baixa, Fechado],
      id: id
    })

    if (!recibo.changedRows) {
      res.json({
        message: "Nenhum registro atualizado.",
        success: false,
      })
      return
    }
    res.json({
      message: "Recibo atualizado com sucesso!",
      success: true,
      recibo: recibo
    })

  } catch (err) {
    res.json({
      message: "Ocorreu um erro ao atualizar recibo.",
      success: false,
      error: err
    })
  }
}

async function removerRecibo(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const recibo = await Recibo.deleteOneById(id)

    if (!recibo.affectedRows) {
      res.json({
        message: "Nenhum registro foi encontrado.",
        success: false,
      })
      return
    }
    res.json({
      message: "Recibo removido com sucesso!",
      success: true,
      recibo: recibo
    })

  } catch (err) {
    res.json({
      message: "Não foi possível remover o recibo.",
      success: false,
      error: err
    })
  }
}

export {
  obterRecibos,
  obterRecibo,
  adicionarRecibo,
  atualizarRecibo,
  removerRecibo,
}