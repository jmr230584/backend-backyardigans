import { Request, Response, Router } from "express";
import { ClienteController } from "./controller/ClienteController";
import { MetaController } from "./controller/MetaController";
import { BancoController } from "./controller/BancoController";

//Cria um roteador
const router = Router();

//Criando uma rota principal para a aplicação
router.get("/", (req: Request, res: Response)=> {
    res.json({ mensagem: "Olá, Mundo!"});
});

/* 
* ROTAS PARA CLIENTE
*/ 
router.get("/lista/clientes", ClienteController.lista);
router.post("/novo/cliente", ClienteController.novo);
router.put("/remover/cliente", ClienteController.remover);
router.put("/atualizar/cliente", ClienteController.atualizar);


/* 
* ROTAS PARA META
*/ 
//Rota para listar as metas
router.get("/lista/metas", MetaController.lista);
router.post("/nova/meta", MetaController.nova);
router.put("/atualizar/meta", MetaController.atualizar);
router.put("/remover/meta", MetaController.remover);

/* 
* ROTAS PARA BANCO
*/ 
router.get("/lista/bancos", BancoController.lista);
router.post("/novo/bancos", BancoController.novo);
router.put("/atualizar/banco", BancoController.atualizar);
router.put("/remover/banco", BancoController.remover);


export { router };