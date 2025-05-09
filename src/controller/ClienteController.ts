import { Request, Response } from "express";
import { Cliente } from "../model/Cliente";

interface ClienteDTO {
    nomeCliente: string,
    dataNascimento: Date,
    celular: string,
    email: string,
    senha: string
}

/**
 * A classe `ClienteController` extende a classe `Cliente` e é responsável por controlar as requisições relacionadas aos clientes.
 * 
 * - Esta classe atua como um controlador dentro de uma API REST, gerenciando as operações relacionadas ao recurso "cliente".
 * - Herdando de `Cliente`, ela pode acessar métodos e propriedades da classe base.
 */
export class ClienteController extends Cliente {

    /**
    * Lista todos os clientes.
    * @param req Objeto de requisição HTTP.
    * @param res Objeto de resposta HTTP.
    * @returns Lista de clientes em formato JSON com status 200 em caso de sucesso.
    * @throws Retorna um status 400 com uma mensagem de erro caso ocorra uma falha ao acessar a listagem de clientes.
    */
    static async lista(req: Request, res: Response): Promise<any> {
        try {
            // Acessa a função de listar os clientes e armazena o resultado
            const listaDeClientes = await Cliente.listarClientes();

            // Retorna a lista de clientes para quem fez a requisição
            return res.status(200).json(listaDeClientes);
        } catch (error) {
            // Lança uma mensagem de erro no console
            console.log('Erro ao acessar a listagem de clientes');

            // Retorna uma mensagem de erro para quem fez a requisição
            return res.status(400).json({ mensagem: "Não foi possível acessar a listagem de clientes" });
        }
    }




    /**
    * Método controller para cadastrar um novo cliente.
    * 
    * Esta função recebe uma requisição HTTP contendo os dados de um cliente no corpo da requisição
    * e tenta cadastrar este cliente no banco de dados utilizando a função `cadastroCliente`. Caso o cadastro 
    * seja bem-sucedido, retorna uma resposta HTTP 200 com uma mensagem de sucesso. Caso contrário, retorna
    * uma resposta HTTP 400 com uma mensagem de erro.
    * 
    * @param {Request} req - Objeto de requisição HTTP, contendo o corpo com os dados do cliente no formato `ClienteDTO`.
    * @param {Response} res - Objeto de resposta HTTP usado para retornar o status e a mensagem.
    * @returns {Promise<Response>} - Retorna uma resposta HTTP com o status 200 em caso de sucesso, ou 400 em caso de erro.
    * 
    * @throws {Error} - Se ocorrer um erro durante o processo de cadastro, uma mensagem é exibida no console e uma 
    *                   resposta HTTP 400 com uma mensagem de erro é enviada.
    */
    static async novo(req: Request, res: Response): Promise<any> {
        try {
            // recuperando informações do corpo da requisição e colocando em um objeto da interface CLienteDTO
            const clienteRecebido: ClienteDTO = req.body;

            // instanciando um objeto do tipo cliente com as informações recebidas
            const novoCliente = new Cliente(clienteRecebido.nomeCliente,
                clienteRecebido.dataNascimento,
                clienteRecebido.celular,
                clienteRecebido.email,
                clienteRecebido.senha);

                console.log(clienteRecebido.dataNascimento);

            // Chama a função de cadastro passando o objeto como parâmetro
            const repostaClasse = await Cliente.cadastroCliente(novoCliente);

            // verifica a resposta da função
            if (repostaClasse) {
                // retornar uma mensagem de sucesso
                return res.status(200).json({ mensagem: "Cliente cadastrado com sucesso!" });
            } else {
                // retorno uma mensagem de erro
                return res.status(400).json({ mensagem: "Erro ao cadastrar o cliente. Entre em contato com o administrador do sistema." })
            }

        } catch (error) {
            // lança uma mensagem de erro no console
            console.log(`Erro ao cadastrar um cliente. ${error}`);

            // retorna uma mensagem de erro há quem chamou a mensagem
            return res.status(400).json({ mensagem: "Não foi possível cadastrar o cliente. Entre em contato com o administrador do sistema." });
        }
    }

    /**
     * Remove um cliente.
     * @param req Objeto de requisição HTTP com o ID do cliente a ser removido.
     * @param res Objeto de resposta HTTP.
     * @returns Mensagem de sucesso ou erro em formato JSON.
     */
    static async remover(req: Request, res: Response): Promise<any> {
        try {
            const idCliente = parseInt(req.query.idCliente as string);
            const result = await Cliente.removerCliente(idCliente);
            
            if (result) {
                return res.status(200).json('Cliente removido com sucesso');
            } else {
                return res.status(401).json('Erro ao deletar o cliente');
            }
        } catch (error) {
            console.log("Erro ao remover o Cliente");
            console.log(error);
            return res.status(500).send("error");
        }
    }

    /**
     * Método para atualizar o cadastro de um cliente.
     * 
     * @param req Objeto de requisição do Express, contendo os dados atualizados do cliente
     * @param res Objeto de resposta do Express
     * @returns Retorna uma resposta HTTP indicando sucesso ou falha na atualização
     */
    static async atualizar(req: Request, res: Response): Promise<any> {
        try {
            // Desestruturando objeto recebido pelo front-end
            const dadosRecebidos: ClienteDTO = req.body;
            
            // Instanciando objeto Aluno
            const cliente = new Cliente(
                dadosRecebidos.nomeCliente,
                dadosRecebidos.dataNascimento ?? new Date("1900-01-01"),
                dadosRecebidos.celular,
                dadosRecebidos.email ?? '',
                dadosRecebidos.senha              
            );

            // Define o ID do cliente, que deve ser passado na query string
            cliente.setIdCliente(parseInt(req.query.idCliente as string));

            // Chama o método para atualizar o cadastro do cliente no banco de dados
            if (await Cliente.atualizarCadastroCliente(cliente)) {
                return res.status(200).json({ mensagem: "Cadastro atualizado com sucesso!" });
            } else {
                return res.status(400).json('Não foi possível atualizar o cliente no banco de dados');
            }
        } catch (error) {
            // Caso ocorra algum erro, este é registrado nos logs do servidor
            console.error(`Erro no modelo: ${error}`);
            // Retorna uma resposta com uma mensagem de erro
            return res.json({ mensagem: "Erro ao atualizar o cliente." });
        }
    }
}