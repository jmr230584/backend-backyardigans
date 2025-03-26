import { Request, Response } from "express";
import { Banco } from "../model/Banco";

interface BancoDTO {
    idCliente: number;
    idMeta: number;
    nomeBanco: string;
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

    /**
     * Controller para cadastrar um novo banco.
     * 
     * Este método recebe os dados do banco via requisição HTTP, instancia um objeto `Banco`
     * e tenta cadastrá-lo no banco de dados. Retorna um status 200 em caso de sucesso ou 400 em caso de erro.
     * 
     * @param {Request} req - Requisição HTTP contendo os dados do banco no formato `BancoDTO`.
     * @param {Response} res - Resposta HTTP usada para retornar o status e a mensagem ao cliente.
     * @returns {Promise<Response>} - Resposta HTTP com status 200 em caso de sucesso ou 400 em caso de erro.
     * 
     * @throws {Error} - Se ocorrer um erro no cadastro, o erro é registrado no console e uma resposta 400 é enviada.
     */
      static async novo(req: Request, res: Response): Promise<any> {
        try {
            // recuperando informações do corpo da requisição e colocando em um objeto da interface BancoDTO
            const bancoRecebido: BancoDTO = req.body;

            // instanciando um objeto do tipo banco com as informações recebidas
            const novoBanco = new Banco(
                bancoRecebido.idCliente,
                bancoRecebido.idMeta,
                bancoRecebido.nomeBanco,
                bancoRecebido.saldo,
                bancoRecebido.transacao,
                bancoRecebido.dividas
            );

            // Chama a função de cadastro passando o objeto como parâmetro
            const respostaClasse = await Banco.cadastroBanco(novoBanco);

            // verifica a resposta da função
            if (respostaClasse) {
                // retornar uma mensagem de sucesso
                return res.status(200).json({ mensagem: "Banco cadastrado com sucesso!" });
            } else {
                // retorno uma mensagem de erro
                return res.status(400).json({ mensagem: "Erro ao cadastrar o banco. Entre em contato com o administrador do sistema." });
            }
        } catch (error) {
            // lança uma mensagem de erro no console
            console.log(`Erro ao cadastrar um banco. ${error}`);

            // retorna uma mensagem de erro a quem chamou a mensagem
            return res.status(400).json({ mensagem: "Não foi possível cadastrar o banco. Entre em contato com o administrador do sistema." });
        }
    }


    /**
     * Atualiza um banco existente.
     * Recebe os dados do banco a partir da requisição e passa para o serviço.
     */
    static async atualizar(req: Request, res: Response): Promise<any> {
        try {
            const dadosRecebidos: BancoDTO = req.body;
            const idBanco = parseInt(req.query.idBanco as string);
            
            // Verifica se todos os campos obrigatórios foram fornecidos
            if (!idBanco || !dadosRecebidos.idCliente || !dadosRecebidos.idMeta || !dadosRecebidos.nomeBanco || !dadosRecebidos.saldo || !dadosRecebidos.transacao || !dadosRecebidos.dividas) {
                return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
            }

            // Chama o MODEL para atualizar o banco/ Number(idBanco) converte o idBanco de string para number
                const bancoAtualizado = await Banco.atualizarBanco(
                idBanco, dadosRecebidos.idCliente, dadosRecebidos.idMeta, dadosRecebidos.nomeBanco, dadosRecebidos.saldo, dadosRecebidos.transacao, dadosRecebidos.dividas
            );

            // Retorna a resposta de sucesso com o ID do banco atualizado
            return res.status(200).json({ message: 'Banco atualizado com sucesso', idBanco: bancoAtualizado });

        } catch (error) {
            console.error('Erro ao atualizar o banco:', error);
            return res.status(500).json({ message: 'Erro ao atualizar o banco.' });
        }
    }

    static async remover(req: Request, res: Response): Promise<any> {
        try {
            // recuperando o id do banco que será removido
            const idBanco = parseInt(req.query.idBanco as string);

            // chamando a função de remoção do banco
            const respostaModelo = await Banco.removerBanco(idBanco);
            
            // verificando a resposta da função
            if (respostaModelo) {
                // retornar uma mensagem de sucesso
                return res.status(200).json({ mensagem: "Banco removido com sucesso!" });
            } else {
                // retorno uma mensagem de erro
                return res.status(400).json({ mensagem: "Erro ao remover o banco. Entre em contato com o administrador do sistema." })
            }
        } catch (error) {
            // lança uma mensagem de erro no console
            console.log(`Erro ao remover um banco. ${error}`);

            // retorna uma mensagem de erro há quem chamou a mensagem
            return res.status(400).json({ mensagem: "Não foi possível remover o banco. Entre em contato com o administrador do sistema." });
        }
    }

}



