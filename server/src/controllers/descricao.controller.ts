import { Response, Request } from 'express'
import Descricao from "../models/Descricao.js"

async function obterDescricoes(req: Request, res: Response) {
  try {
    const descricoes = await Descricao.all()
    res.json(descricoes)
  } catch (err) {
    res.json({
      error: err
    })
  }
}

async function adicionarDescricao(req: Request, res: Response) {
  try {
    const { CodDescrição, Descrição } = req.body
    const descricao = await Descricao.create(CodDescrição, Descrição)

    if (!descricao.affectedRows) {
      res.json({
        message: "Falha no registro, não adicionado.",
        success: false,
      })
      return
    }
    res.json({
      message: "Descricao adicionada com sucesso!",
      success: true,
      descricao: descricao
    })
  } catch (err) {
    res.json({
      message: "Ocorreu um erro ao adicionar descricao.",
      success: false,
      error: err
    })
  }
}

async function atualizarDescricao(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const { CodDescrição, Descrição } = req.body
    const descricao = await Descricao.updateAllById({
      values: [CodDescrição, Descrição],
      id: id
    })

    if (!descricao.changedRows) {
      res.json({
        message: "Falha no registro, não atualizado.",
        success: false,
      })
      return
    }
    res.json({
      message: "Descricao atualizada com sucesso!",
      success: true,
      descricao: descricao
    })

  } catch (err) {
    res.json({
      message: "Ocorreu um erro ao atualizar descricao.",
      success: false,
      error: err
    })
  }
}

async function removerDescricao(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const descricao = await Descricao.deleteOneById(id)

    if (!descricao.affectedRows) {
      res.json({
        message: "Nenhum registro foi encontrado.",
        success: false,
      })
      return
    }
    res.json({
      message: "Descricao removida com sucesso!",
      success: true,
      descricao: descricao
    })

  } catch (err) {
    res.json({
      message: "Não foi possível remover a descricao.",
      success: false,
      error: err
    })
  }
}

export {
  obterDescricoes,
  adicionarDescricao,
  atualizarDescricao,
  removerDescricao,
}