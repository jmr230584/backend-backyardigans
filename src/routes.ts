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
router.post("/novo/cliente", ClienteController.novo)


/* 
* ROTAS PARA META
*/ 
router.get("/lista/metas", MetaController.lista);


/* 
* ROTAS PARA BANCO
*/ 
router.get("/lista/bancos", BancoController.lista);


export { router };