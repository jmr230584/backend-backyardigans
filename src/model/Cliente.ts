import { DataBaseModel } from "./DatabaseModel";

// armazenei o pool de conexões
const database = new DataBaseModel().pool;

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
    /*Controla o status do cliente */
    private statusCliente: boolean = true;

    /**
     * Construtor da classe Cliente
     * 
     * @param nomeCliente Nome do cliente 
     * @param dataNascimento Data de nascimento do cliente
     * @param celular Celular do cliente
     * @param email Email do cliente
     * @param senha Senha do cliente
     * @param statusCliente status cliente
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
     * Retorna o status do cliente no sistema
     * 
     * @return Status do cliente no sistema
     */
    public getStatusCliente(): boolean {
        return this.statusCliente;
    }

    /**
     * Atribui um valor ao status do cliente
     * 
     * @param _statusCliente : Valor a ser atribuido ao status do cliente
     */
    public setStatusCliente(_statusCliente: boolean) {
        this.statusCliente = _statusCliente;
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
            const querySelectCliente = `SELECT * FROM cliente WHERE status_cliente = TRUE;`;

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
                    linha.senha,
                );

                // atribui o ID objeto
                novoCliente.setIdCliente(linha.id_cliente);
                novoCliente.setStatusCliente(linha.status_cliente);
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


    /**
     * Realiza o cadastro de um cliente no banco de dados.
     * 
     * Esta função recebe um objeto do tipo `Cliente` e insere seus dados (nome_cliente, data_nascimento, celular, email e senha)
     * na tabela `cliente` do banco de dados. O método retorna um valor booleano indicando se o cadastro 
     * foi realizado com sucesso.
     * 
     * @param {Cliente} cliente - Objeto contendo os dados do aluno que será cadastrado. O objeto `Cliente`
     *                        deve conter os métodos `getNomeCliente()`, `getDataNascimento()`, `getCelular()`, `getEmail` e `getSenha`
     *                        que retornam os respectivos valores do cliente.
     * @returns {Promise<boolean>} - Retorna `true` se o cliente foi cadastrado com sucesso e `false` caso contrário.
     *                               Em caso de erro durante o processo, a função trata o erro e retorna `false`.
     * 
     * @throws {Error} - Se ocorrer algum erro durante a execução do cadastro, uma mensagem de erro é exibida
     *                   no console junto com os detalhes do erro.
     */
    static async cadastroCliente(cliente: Cliente): Promise<boolean> {
        try {
            // query para fazer insert de um cliente no banco de dados
            const queryInsertCliente = `INSERT INTO cliente (nome_cliente, data_nascimento, celular, email, senha)
                                    VALUES
                                        ('${cliente.getNomeCliente()}', 
                                        '${cliente.getDataNascimento()}', 
                                        '${cliente.getCelular()}', 
                                        '${cliente.getEmail()}',
                                        '${cliente.getSenha()}')
                                        RETURNING id_cliente;`;

            // executa a query no banco e armazena a resposta
            const respostaBD = await database.query(queryInsertCliente);


            // verifica se a quantidade de linhas modificadas é diferente de 0
            if (respostaBD.rowCount != 0) {
                console.log(`Cliente cadastrado com sucesso! ID do cliente: ${respostaBD.rows[0].id_cliente}`);
                // true significa que o cadastro foi feito
                return true;
            }
            // false significa que o cadastro NÃO foi feito.
            return false;

            // tratando o erro
        } catch (error) {
            // imprime outra mensagem junto com o erro
            console.log('Erro ao cadastrar o cliente. Verifique os logs para mais detalhes.');
            // imprime o erro no console
            console.log(error);
            // retorno um valor falso
            return false;
        }
    }

    /**
     * Remove um cliente do banco de dados
     * @param idCliente ID do cliente a ser removido
     * @returns Boolean indicando se a remoção foi bem-sucedida
    */
    static async removerCliente(id_cliente: number): Promise<Boolean> {
        // variável para controle de resultado da consulta (query)
        let queryResult = false;
    
        try {
            // Cria a consulta (query) para remover o cliente
            const queryDeleteBancoCliente = `UPDATE banco 
                                                    SET status_banco = FALSE
                                                    WHERE id_cliente=${id_cliente};`;

            // remove o banco associado ao cliente
            await database.query(queryDeleteBancoCliente);

            // Construção da query SQL para deletar o cliente.
            const queryDeleteCliente = `UPDATE cliente 
                                        SET status_cliente = FALSE
                                        WHERE id_cliente=${id_cliente};`;
    
            // Executa a query de exclusão e verifica se a operação foi bem-sucedida.
            await database.query(queryDeleteCliente)
            .then((result) => {
                if (result.rowCount != 0) {
                    queryResult = true; // Se a operação foi bem-sucedida, define queryResult como true.
                }
            });
    
            // retorna o resultado da query
            return queryResult;

        // captura qualquer erro que aconteça
        } catch (error) {
            // Em caso de erro na consulta, exibe o erro no console e retorna false.
            console.log(`Erro na consulta: ${error}`);
            // retorna false
            return queryResult;
        }
    }


     /**
     * Atualiza os dados de um cliente no banco de dados.
     * @param cliente Objeto do tipo cliente com os novos dados
     * @returns true caso sucesso, false caso erro
     */
    static async atualizarCadastroCliente(cliente: Cliente): Promise<Boolean> {
        let queryResult = false; // Variável para armazenar o resultado da operação.
        try {
            // Construção da query SQL para atualizar os dados do cliente no banco de dados.
            const queryAtualizarCliente = `UPDATE Cliente SET 
                                            nome_cliente = '${cliente.getNomeCliente().toUpperCase()}', 
                                            data_nascimento = '${cliente.getDataNascimento()}',
                                            celular = '${cliente.getCelular()}', 
                                            email = '${cliente.getEmail().toLowerCase()}'                                            
                                        WHERE id_cliente = ${cliente.idCliente}`;

            // Executa a query de atualização e verifica se a operação foi bem-sucedida.
            await database.query(queryAtualizarCliente)
            .then((result) => {
                if (result.rowCount != 0) {
                    queryResult = true; // Se a operação foi bem-sucedida, define queryResult como true.
                }
            });

            // Retorna o resultado da operação para quem chamou a função.
            return queryResult;
        } catch (error) {
            // Em caso de erro na consulta, exibe o erro no console e retorna false.
            console.log(`Erro na consulta: ${error}`);
            return queryResult;
        }
    }
}
