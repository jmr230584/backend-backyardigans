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


/* 
* ROTAS PARA META
*/ 
//Rota para listar as metas
router.get("/lista/metas", MetaController.lista);
// Rota para adicionar meta
router.post("/nova/meta", MetaController.nova);
// Rota para deletar meta
router.delete("/delete/metas/:idMeta", MetaController.remover);
// Rota para atualizar meta
router.put("/atualizar/metas/:idMeta", MetaController.atualizar);


/* 
* ROTAS PARA BANCO
*/ 
router.get("/lista/bancos", BancoController.lista);


export { router };