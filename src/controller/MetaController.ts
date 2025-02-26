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
                metaRecebida.nome_meta,
                metaRecebida.data_inicial,
                metaRecebida.data_final,
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

    /**
   * Remove uma meta do sistema com base no ID fornecido na requisição.
   * 
   * Esta função recupera o ID da meta a ser removido a partir dos parâmetros da requisição, chama o método 
   * de remoção no modelo (Meta.removerMeta) e retorna uma resposta apropriada para o cliente indicando 
   * o sucesso ou a falha da operação.
   * 
   * @param {Request} req - Objeto da requisição HTTP, contendo os parâmetros e informações enviadas pelo cliente.
   *                        O parâmetro idMeta deve ser passado na URL da requisição.
   * @param {Response} res - Objeto da resposta HTTP, usado para enviar a resposta ao cliente.
   * @returns {Promise<Response>}   - Retorna uma resposta HTTP com status apropriado e uma mensagem em JSON:
   *                                - Status 200 e mensagem de sucesso se a meta for removido.
   *                                - Status 400 e mensagem de erro em caso de falha na remoção ou exceção.
   * 
   * @throws {Error} - Exibe uma mensagem de erro no console caso ocorra uma exceção durante o processo.
   */
    static async remover(req: Request, res: Response): Promise<any> {
        try {
            // Recupera o ID da meta a partir dos parâmetros da requisição e converte para número.
            const idMeta = parseInt(req.params.idMeta as string);

            // Chama o método do modelo para remover a meta e armazena a resposta (true ou false).
            const respostaModelo = await Meta.removerMeta(idMeta);

            // Verifica se a resposta do modelo indica que a meta foi removida com sucesso.
            if (respostaModelo) {
                // Retorna uma resposta HTTP com status 200 e mensagem de sucesso.
                return res.status(200).json({ mensagem: "A meta foi removido com sucesso!" });
            } else {
                // Retorna uma resposta HTTP com status 400 e mensagem de erro.
                return res.status(400).json({ mensagem: "Erro ao remover a meta. Entre em contato com o administrador do sistema." });
            }
        } catch (error) {
            // Loga o erro no console para depuração.
            console.log(`Erro ao remover a meta: ${error}`);

            // Retorna uma resposta HTTP com status 400 e mensagem de erro genérica para o cliente.
            return res.status(400).json({ mensagem: "Não foi possível remover oa meta. Entre em contato com o administrador do sistema." });
        }
    }

    /**
    * Atualiza as informações de uma meta no sistema.
    * 
    * Esta função recupera os dados da meta a serem atualizados a partir do corpo da requisição (req.body) 
    * e o ID da meta a partir dos parâmetros da URL. Em seguida, cria um objeto meta com os dados 
    * fornecidos, chama o método de atualização no modelo (Meta.atualizarMeta) e retorna uma resposta 
    * apropriada ao cliente com o status da operação.
    * 
    * @param {Request} req - Objeto da requisição HTTP, contendo os dados da meta no corpo da requisição e 
    *                        o ID da meta nos parâmetros da URL.
    * @param {Response} res - Objeto da resposta HTTP, usado para enviar a resposta ao cliente.
    * @returns {Promise<Response>} - Retorna uma resposta HTTP com status e mensagem:
    *                                - Status 200 e mensagem de sucesso se a meta for atualizado.
    *                                - Status 400 e mensagem de erro em caso de falha na atualização ou exceção.
    * 
    * @throws {Error} - Exibe uma mensagem de erro no console em caso de falha no processo.
    */
    static async atualizar(req: Request, res: Response): Promise<any> {
        try {
            // Recupera os dados da meta a serem atualizados do corpo da requisição.
            const metaRecebida: MetaDTO = req.body;

            // Recupera o ID da meta a ser atualizado a partir dos parâmetros da URL.
            const idMetaRecebido = parseInt(req.params.idMeta as string);

            // Cria um novo objeto meta com os dados recebidos.
            const metaAtualizado = new Meta(
                metaRecebida.nome_meta,
                metaRecebida.data_inicial,
                metaRecebida.data_final,
                metaRecebida.categorizacao,
                metaRecebida.valor,
            );

            // Define o ID da meta no objeto metaAtualizada.
            metaAtualizado.setIdMeta(idMetaRecebido);

            // Chama o método do modelo para atualizar a meta e armazena a resposta (true ou false).
            const respostaModelo = await Meta.atualizarMeta(metaAtualizado);

            // Verifica se a resposta do modelo indica que a meta foi atualizado com sucesso.
            if (respostaModelo) {
                // Retorna uma resposta HTTP com status 200 e mensagem de sucesso.
                return res.status(200).json({ mensagem: "Meta atualizado com sucesso!" });
            } else {
                // Retorna uma resposta HTTP com status 400 e mensagem de erro.
                return res.status(400).json({ mensagem: "Não foi possível atualizar a meta. Entre em contato com o administrador." });
            }
        } catch (error) {
            // Loga o erro no console para depuração.
            console.log(`Erro ao atualizar a meta: ${error}`);

            // Retorna uma resposta HTTP com status 400 e mensagem de erro genérica.
            return res.status(400).json({ mensagem: "Não foi possível atualizar a meta. Entre em contato com o administrador." });
        }
    }
}
