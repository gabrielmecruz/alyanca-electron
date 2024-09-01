import { Response, Request } from 'express'
import CorpoRecibo from "../models/CorpoRecibo.js"

async function obterCorposRecibos(req: Request, res: Response) {
  try {
    const corpoRecibo = await CorpoRecibo.all()
    res.json(corpoRecibo)
  } catch (err) {
    res.json({
      error: err
    })
  }
}

async function obterCorpoRecibo(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const [corpoRecibo] = await CorpoRecibo.find(id)
    res.json({
      message: "Corpo do Recibo encontrado com sucesso!",
      success: true,
      corpoRecibo: corpoRecibo
    })
  } catch (err) {
    res.json({
      message: "Ocorreu um erro ao encontrar CorpoRecibo.",
      success: false,
      error: err
    })
  }
}

async function adicionarCorpoRecibo(req: Request, res: Response) {
  try {
    const { Código_Recibo, CodDaDescrição, Competência, ValorAPagar } = req.body

    const corpoRecibo = await CorpoRecibo.create(Código_Recibo, CodDaDescrição, Competência, ValorAPagar)

    if (!corpoRecibo.affectedRows) {
      res.json({
        message: "Falha no registro, não adicionado.",
        success: false,
      })
      return
    }
    res.json({
      message: "CorpoRecibo adicionado com sucesso!",
      success: true,
      corpoRecibo: corpoRecibo
    })
  } catch (err) {
    res.json({
      message: "Ocorreu um erro ao adicionar corpoRecibo.",
      success: false,
      error: err
    })
  }
}

async function atualizarCorpoRecibo(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const { Código_Recibo, CodDaDescrição, Competência, ValorAPagar } = req.body
    const corpoRecibo = await CorpoRecibo.updateAllById({
      values: [Código_Recibo, CodDaDescrição, Competência, ValorAPagar],
      id: id
    })

    if (!corpoRecibo.changedRows) {
      res.json({
        message: "Falha no registro, não atualizado.",
        success: false,
      })
      return
    }
    res.json({
      message: "CorpoRecibo atualizado com sucesso!",
      success: true,
      corpoRecibo: corpoRecibo
    })

  } catch (err) {
    res.json({
      message: "Ocorreu um erro ao atualizar corpoRecibo.",
      success: false,
      error: err
    })
  }
}

async function removerCorpoRecibo(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const corpoRecibo = await CorpoRecibo.deleteOneById(id)

    if (!corpoRecibo.affectedRows) {
      res.json({
        message: "Nenhum registro foi encontrado.",
        success: false,
      })
      return
    }
    res.json({
      message: "CorpoRecibo removido com sucesso!",
      success: true,
      corpoRecibo: corpoRecibo
    })

  } catch (err) {
    res.json({
      message: "Não foi possível remover o corpoRecibo.",
      success: false,
      error: err
    })
  }
}

export {
  obterCorposRecibos,
  obterCorpoRecibo,
  adicionarCorpoRecibo,
  atualizarCorpoRecibo,
  removerCorpoRecibo,
}