import { DatabaseModel } from "./DatabaseModel";

// armazenei o pool de conexões
const database = new DatabaseModel().pool;

/**
 * Classe que representa um cliente.
 */
export class Cliente {

    /* Atributos */
    /* Identificador do cliente */
    private idCliente: number = 0;
    /* Nome do cliente */
    private nomeCliente: string;
    /* Data de nascimento do cliente */
    private dataNascimento: Date;
    /* Celular do cliente */
    private celular: string;
    /* Email do cliente */
    private email: string;
    /* Senha do cliente */
    private senha: string;

    /**
     * Construtor da classe Cliente
     * 
     * @param nomeCliente Nome do cliente 
     * @param dataNascimento Data de nascimento do cliente
     * @param celular Celular do cliente
     * @param email Email do cliente
     * @param senha Senha do cliente
     */
    constructor(
        nomeCliente: string,
        dataNascimento: Date,
        celular: string,
        email: string,
        senha: string
    ) {
        this.nomeCliente = nomeCliente;
        this.dataNascimento = dataNascimento;
        this.celular = celular;
        this.email = email;
        this.senha = senha;
    }

    /* Métodos get e set */
    /**
     * Recupera o identificador do cliente
     * @returns o identificador do cliente
     */
    public getIdCliente(): number {
        return this.idCliente;
    }

    /**
     * Atribui um valor ao identificador do cliente
     * @param idCliente novo identificador do cliente
     */
    public setIdCliente(idCliente: number): void {
        this.idCliente = idCliente;
    }

    /**
     * Recupera o nome do cliente.
     *
     * @returns O nome do cliente.
     */
    public getNomeCliente(): string {
        return this.nomeCliente;
    }

    /**
     * Define o nome do cliente.
     * 
     * @param nomeCliente - O nome do cliente a ser definido.
     */
    public setNomeCliente(nomeCliente: string): void {
        this.nomeCliente = nomeCliente;
    }

    /**
     * Retorna a data de nascimento do cliente.
     *
     * @returns A data de nascimento do cliente.
     */
    public getDataNascimento(): Date {
        return this.dataNascimento;
    }

    /**
     * Define a data de nascimento do cliente.
     *
     * @param dataNascimento - A data de nascimento do cliente.
     */
    public setDataNascimento(dataNascimento: Date): void {
        this.dataNascimento = dataNascimento;
    }

    /**
     * Retorna o celular do cliente.
     *
     * @returns O número de celular do cliente.
     */
    public getCelular(): string {
        return this.celular;
    }

    /**
     * Define o número de celular do cliente.
     *
     * @param celular - O número de celular.
     */
    public setCelular(celular: string): void {
        this.celular = celular;
    }

    /**
     * Retorna o email do cliente.
     *
     * @returns O email do cliente.
     */
    public getEmail(): string {
        return this.email;
    }

    /**
     * Define o email do cliente.
     *
     * @param email - O email.
     */
    public setEmail(email: string): void {
        this.email = email;
    }

    /**
     * Retorna a senha do cliente.
     *
     * @returns A senha do cliente.
     */
    public getSenha(): string {
        return this.senha;
    }

    /**
     * Define a senha do cliente.
     *
     * @param senha - A senha.
     */
    public setSenha(senha: string): void {
        this.senha = senha;
    }

    /**
     * Busca e retorna uma lista de clientes do banco de dados.
     * @returns Um array de objetos do tipo `Cliente` em caso de sucesso ou `null` se ocorrer um erro durante a consulta.
     * 
     * - A função realiza uma consulta SQL para obter todas as informações da tabela "cliente".
     * - Os dados retornados do banco de dados são usados para instanciar objetos da classe `Cliente`.
     * - Cada cliente é adicionado a uma lista que será retornada ao final da execução.
     * - Se houver falha na consulta ao banco, a função captura o erro, exibe uma mensagem no console e retorna `null`.
     */
    static async listarClientes(): Promise<Array<Cliente> | null> {
        // objeto para armazenar a lista de clientes
        const listaDeClientes: Array<Cliente> = [];

        try {
            // query de consulta ao banco de dados
            const querySelectCliente = `SELECT * FROM cliente;`;

            // fazendo a consulta e guardando a resposta
            const respostaBD = await database.query(querySelectCliente);

            // usando a resposta para instanciar um objeto do tipo Cliente
            respostaBD.rows.forEach((linha) => {
                // instancia (cria) objeto Cliente
                const novoCliente = new Cliente(
                    linha.nome_cliente,
                    linha.data_nascimento,
                    linha.celular,
                    linha.email,
                    linha.senha
                );

                // atribui o ID objeto
                novoCliente.setIdCliente(linha.id_cliente);

                // adiciona o objeto na lista
                listaDeClientes.push(novoCliente);
            });

            // retorna a lista de clientes
            return listaDeClientes;
        } catch (error) {
            console.log('Erro ao buscar lista de clientes. Verifique os logs para mais detalhes.');
            console.log(error);
            return null;
        }
    }
}
