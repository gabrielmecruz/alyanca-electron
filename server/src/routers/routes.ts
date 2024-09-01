import express, { Router } from 'express'
import { obterCliente, obterClientes, adicionarCliente, atualizarCliente, removerCliente } from '../controllers/cliente.controller.js'
import { obterRecibos, obterRecibo, adicionarRecibo, atualizarRecibo, removerRecibo } from '../controllers/recibo.controller.js'
import { obterDescricoes, adicionarDescricao, atualizarDescricao, removerDescricao } from '../controllers/descricao.controller.js'
import { obterCorposRecibos, obterCorpoRecibo, adicionarCorpoRecibo, atualizarCorpoRecibo, removerCorpoRecibo } from '../controllers/corpo-recibo.controller.js'

const router: Router = express.Router()

router.route('/clientes').get(obterClientes)
router.route('/clientes/:id').get(obterCliente)
router.route('/clientes').post(adicionarCliente)
router.route('/clientes/:id').put(atualizarCliente)
router.route('/clientes/:id').delete(removerCliente)

router.route('/recibo').get(obterRecibos)
router.route('/recibo/:id').get(obterRecibo)
router.route('/recibo').post(adicionarRecibo)
router.route('/recibo/:id').put(atualizarRecibo)
router.route('/recibo/:id').delete(removerRecibo)

router.route('/descricoes').get(obterDescricoes)
router.route('/descricoes').post(adicionarDescricao)
router.route('/descricoes/:id').put(atualizarDescricao)
router.route('/descricoes/:id').delete(removerDescricao)

router.route('/corpoRecibo').get(obterCorposRecibos)
router.route('/corpoRecibo/:id').get(obterCorpoRecibo)
router.route('/corpoRecibo').post(adicionarCorpoRecibo)
router.route('/corpoRecibo/:id').put(atualizarCorpoRecibo)
router.route('/corpoRecibo/:id').delete(removerCorpoRecibo)

export default router

