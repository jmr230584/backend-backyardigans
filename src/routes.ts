// routes.ts (CÓDIGO COMPLETO FINAL)

import { Router, Request, Response, RequestHandler } from "express";
import { SERVER_ROUTES } from "./appConfig";
import { ClienteController } from "./controller/ClienteController";
import { MetaController } from "./controller/MetaController";
import { BancoController } from "./controller/BancoController";
import { UsuarioController } from "./controller/UsuarioController";

import { upload } from "./config/multerConfig"
import { Auth } from './auth/Auth'; 
// 🚨 NOVO: Importe o asyncHandler
import { asyncHandler } from './utils/asyncHandler'; 


const router = Router();

// 🚨 1. INTERFACE CUSTOMIZADA LOCALMENTE 🚨
// Adiciona propriedades de usuário injetadas pelo middleware Auth.verifyToken
interface CustomRequest extends Request {
    userId?: string;
    nome?: string;
    username?: string;
    imagemPerfil?: string;
}

// ----------------------------------------------------
// FUNÇÕES ISOLADAS 
// ----------------------------------------------------

// Função de manipulação para o Logout
const handleLogout = (req: Request, res: Response): void => {
    try {
        const nomeDoCookie = 'auth_token'; 

        res.clearCookie(nomeDoCookie, {
            httpOnly: true,         
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'lax',        
            path: '/'               
        });

        res.status(200).json({ message: 'Logout realizado com sucesso.' });
        return;
        
    } catch (error) {
        console.error('Erro no logout:', error);
        res.status(500).json({ message: 'Erro interno ao tentar fazer logout.' });
        return;
    }
};

// 2. Função de manipulação para o Profile (Síncrona)
const handleProfile = (req: CustomRequest, res: Response): void => {
    res.status(200).json({
        user: {
            id: req.userId,
            nome: req.nome,
            username: req.username, 
            imagemPerfil: req.imagemPerfil || null 
        }
    });
    return;
};

// ----------------------------------------------------
// REGISTRO DE ROTAS
// ----------------------------------------------------

router.get('/', (req: Request, res: Response) => {
    res.json({ mensagem: "Rota padrão" })
});

// CRUD CLIENTE
router.get(SERVER_ROUTES.LISTAR_CLIENTES, ClienteController.lista);
router.post(SERVER_ROUTES.NOVO_CLIENTE, ClienteController.novo);
router.put(SERVER_ROUTES.REMOVER_CLIENTE, ClienteController.remover);
router.put(SERVER_ROUTES.ATUALIZAR_CLIENTE, ClienteController.atualizar);

// CRUD METAS
router.get(SERVER_ROUTES.LISTAR_METAS, MetaController.lista);
router.post(SERVER_ROUTES.NOVA_META, MetaController.nova);
router.put(SERVER_ROUTES.REMOVER_META, MetaController.remover);
router.put(SERVER_ROUTES.ATUALIZAR_META, MetaController.atualizar);
router.get(SERVER_ROUTES.BUSCAR_META_ID, MetaController.buscarPorId);

// CRUD BANCO
router.get(SERVER_ROUTES.LISTAR_BANCOS, BancoController.lista);
router.get("/lista/bancos/:idCliente", BancoController.listarBancosPorCliente);
router.post(SERVER_ROUTES.NOVO_BANCO, BancoController.novo);
router.put(SERVER_ROUTES.ATUALIZAR_BANCO, BancoController.atualizar);
router.put(SERVER_ROUTES.REMOVER_BANCO, BancoController.remover);

// Transação: Usa asyncHandler
router.post("/transacao", Auth.verifyToken, asyncHandler(BancoController.criarTransacao)); 

// Cadastro e Login
// 🚨 CADASTRO: Usa asyncHandler e upload.single
router.post(
    SERVER_ROUTES.NOVO_USUARIO, 
    upload.single('imagemPerfil'), 
    asyncHandler(UsuarioController.cadastrar)
);

// 🚨 LOGIN: Usa asyncHandler
router.post(SERVER_ROUTES.LOGIN, asyncHandler(Auth.validacaoUsuario));


// ----------------------------------------------------
// ROTAS DE AUTENTICAÇÃO/PERFIL
// ----------------------------------------------------

// LOGOUT
router.post('/logout', handleLogout); 

// PERFIL/IMAGEM
// 🚨 Usa asyncHandler
router.get(
    SERVER_ROUTES.PERFIL_IMAGEM, 
    Auth.verifyToken, 
    asyncHandler(UsuarioController.getNomeImagemPerfil)
);

// PROFILE: Usa função síncrona
router.get(SERVER_ROUTES.PROFILE, Auth.verifyToken, handleProfile); 


export { router }