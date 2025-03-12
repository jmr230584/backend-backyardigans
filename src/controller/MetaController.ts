import { Request, Response } from "express";
import { Meta } from "../model/Meta";

interface MetaDTO {
    nomeMeta: string;
    dataInicial: Date;
    dataFinal: Date;
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
    static novo(arg0: string, novo: any) {
        throw new Error("Method not implemented.");
    }

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
            console.log('Erro ao acessar a listagem das metas');

            // Retorna uma mensagem de erro para quem fez a requisição
            return res.status(400).json({ mensagem: "Não foi possível acessar a listagem das metas" });
        }
    }
    /**
    * Método controller para cadastrar uma nova meta.
    * 
    * Esta função recebe uma requisição HTTP contendo os dados de um meta no corpo da requisição
    * e tenta cadastrar esta meta no banco de dados utilizando a função `cadastroMeta`. Caso o cadastro 
    * seja bem-sucedido, retorna uma resposta HTTP 200 com uma mensagem de sucesso. Caso contrário, retorna
    * uma resposta HTTP 400 com uma mensagem de erro.
    * 
    * @param {Request} req - Objeto de requisição HTTP, contendo o corpo com os dados da meta no formato `MetaDTO`.
    * @param {Response} res - Objeto de resposta HTTP usado para retornar o status e a mensagem ao cliente.
    * @returns {Promise<any>} - Retorna uma resposta HTTP com o status 200 em caso de sucesso, ou 400 em caso de erro.
    * 
    * @throws {Error} - Se ocorrer um erro durante o processo de cadastro, uma mensagem é exibida no console e uma 
    *                   resposta HTTP 400 com uma mensagem de erro é enviada ao cliente.
    */
    static async nova(req: Request, res: Response): Promise<any> {
        try {
            // recuperando informações do corpo da requisição e colocando em um objeto da interface MetaDTO
            const metaRecebida: MetaDTO = req.body;

            // instanciando um objeto do tipo meta com as informações recebidas
            const novaMeta = new Meta(
                metaRecebida.nomeMeta,
                metaRecebida.dataInicial,
                metaRecebida.dataFinal,
                metaRecebida.categorizacao,
                metaRecebida.valor,
            );

            // Chama a função de cadastro passando o objeto como parâmetro
            const repostaClasse = await Meta.cadastroMeta(novaMeta);

            console.log(novaMeta);

            // verifica a resposta da função
            if (repostaClasse) {
                // retornar uma mensagem de sucesso
                return res.status(200).json({ mensagem: "Meta cadastrada com sucesso!" });
            } else {
                // retorno uma mensagem de erro
                return res.status(400).json({ mensagem: "Erro ao cadastra a meta. Entre em contato com o administrador do sistema." })
            }

        } catch (error) {
            // lança uma mensagem de erro no console
            console.log(`Erro ao cadastrar uma meta. ${error}`);

            // retorna uma mensagem de erro há quem chamou a mensagem
            return res.status(400).json({ mensagem: "Não foi possível cadastrar a meta. Entre em contato com o administrador do sistema." });
        }
    }

    
    
}
