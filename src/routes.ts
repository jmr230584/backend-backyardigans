import express from "express";
import { SERVER_ROUTES } from "./appConfig";
import {ClienteController} from "./controller/ClienteController";
import {MetaController} from "./controller/MetaController";
import {BancoController} from "./controller/BancoController";
import UsuarioController from "./controller/UsuarioController";
import  {upload} from "./config/multerConfig" // caminho pode variar dependendo da estrutura
import { Auth } from './auth/Auth';

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ mensagem: "Rota padrão" })
});

router.post("/novo/usuario", UsuarioController.cadastrar);

// CRUD Cliente
router.get(SERVER_ROUTES.LISTAR_CLIENTES, ClienteController.lista);
router.post(SERVER_ROUTES.NOVO_CLIENTE, ClienteController.novo);
router.put(SERVER_ROUTES.REMOVER_CLIENTE, ClienteController.remover);
router.put(SERVER_ROUTES.ATUALIZAR_CLIENTE, ClienteController.atualizar);

//CRUD Meta
router.get(SERVER_ROUTES.LISTAR_METAS, MetaController.lista);
router.post(SERVER_ROUTES.NOVA_META, MetaController.nova);
router.put(SERVER_ROUTES.REMOVER_META, MetaController.remover);
router.put(SERVER_ROUTES.ATUALIZAR_META, MetaController.atualizar);

//CRUD Banco
router.get(SERVER_ROUTES.LISTAR_BANCOS, BancoController.lista);
router.post(SERVER_ROUTES.NOVO_BANCO, BancoController.novo);
router.put(SERVER_ROUTES.REMOVER_BANCO, BancoController.remover);
router.put(SERVER_ROUTES.ATUALIZAR_BANCO, BancoController.atualizar);

// Cadastro de Usuário com Upload de Imagem de Perfil
router.post(SERVER_ROUTES.NOVO_USUARIO, upload.single('imagemPerfil'), UsuarioController.cadastrar);
router.post('/login', Auth.validacaoUsuario);
//atualizar para bycript
router.post('/atualizar-senhas', Auth.atualizarSenhasComBcrypt);

export { router }