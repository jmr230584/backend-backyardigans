import { Request, Response } from "express";
import { Banco } from "../model/Banco";
import { Cliente } from "../model/cliente"; 
import { Meta } from "../model/Meta";

interface BancoDTO {
    id_cliente: number;
    id_meta: number;
    nome_banco: string;
    saldo: number;
    transacao: number;
    dividas: number;
}

/**
 * A classe `BancoController` extende a classe `Banco` e é responsável por controlar as requisições relacionadas às contas bancárias.
 * 
 * - Esta classe atua como um controlador dentro de uma API REST, gerenciando as operações relacionadas ao recurso "banco".
 * - Herdando de `Banco`, ela pode acessar métodos e propriedades da classe base.
 */
export class BancoController extends Banco {

    /**
    * Lista todas as contas bancárias.
    * @param req Objeto de requisição HTTP.
    * @param res Objeto de resposta HTTP.
    * @returns Lista de contas bancárias em formato JSON com status 200 em caso de sucesso.
    * @throws Retorna um status 400 com uma mensagem de erro caso ocorra uma falha ao acessar a listagem das contas bancárias.
    */
    static async lista(req: Request, res: Response): Promise<any> {
        try {
            // Acessa a função de listar as contas bancárias e armazena o resultado
            const listaDeContas = await Banco.listarBancos(); // Você precisará implementar esse método em Banco.

            // Retorna a lista de contas bancárias para quem fez a requisição
            return res.status(200).json(listaDeContas);
        } catch (error) {
            // Lança uma mensagem de erro no console
            console.log('Erro ao acessar a listagem de contas bancárias');

            // Retorna uma mensagem de erro para quem fez a requisição
            return res.status(400).json({ mensagem: "Não foi possível acessar a listagem de contas bancárias" });
        }
    }
}
