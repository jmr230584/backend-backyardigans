import { Request, Response } from "express";
import { Meta } from "../model/Meta";

interface MetaDTO {
    nome_meta: string;
    data_inicial: Date;
    data_final: Date;
    categorizacao: string;
    valor: number;
}

/**
 * A classe `MetaController` extende a classe `Meta` e é responsável por controlar as requisições relacionadas às metas.
 * 
 * - Esta classe atua como um controlador dentro de uma API REST, gerenciando as operações relacionadas ao recurso "meta".
 * - Herdando de `Meta`, ela pode acessar métodos e propriedades da classe base.
 */
export class MetaController extends Meta {

    /**
    * Lista todas as metas.
    * @param req Objeto de requisição HTTP.
    * @param res Objeto de resposta HTTP.
    * @returns Lista de metas em formato JSON com status 200 em caso de sucesso.
    * @throws Retorna um status 400 com uma mensagem de erro caso ocorra uma falha ao acessar a listagem de metas.
    */
    static async lista(req: Request, res: Response): Promise<any> {
        try {
            // Acessa a função de listar as metas e armazena o resultado
            const listaDeMetas = await Meta.listarMetas(); // Você precisará implementar este método em Meta.

            // Retorna a lista de metas para quem fez a requisição
            return res.status(200).json(listaDeMetas);
        } catch (error) {
            // Lança uma mensagem de erro no console
            console.log('Erro ao acessar a listagem de metas');

            // Retorna uma mensagem de erro para quem fez a requisição
            return res.status(400).json({ mensagem: "Não foi possível acessar a listagem de metas" });
        }
    }
}
