import { Request, Response } from "express";
import { Cliente } from "../model/cliente";

interface ClienteDTO {
    nome_cliente: string,
    data_nascimento: Date,
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
}