import { DataBaseModel } from "./DataBaseModel";

// armazenei o pool de conexões
const database = new DataBaseModel().pool;

/**
 * Classe que representa um banco.
 */
export class Banco {

    /* Atributos */
    /* Identificador do banco */
    private idBanco: number = 0;
    /* Identificador do cliente */
    private idCliente: number;
    /* Identificador da meta */
    private idMeta: number;
    /* Nome do banco */
    private nomeBanco: string;
    /* Saldo do banco */
    private saldo: number;
    /* Transação do banco */
    private transacao: number;
    /* Dívidas do banco */
    private dividas: number;
     /*status de registro do banco*/
    private statusBanco: boolean = true;

    /**
     * Construtor da classe Banco
     * 
     * @param idCliente Identificador do cliente associado ao banco
     * @param idMeta Identificador da meta associada ao banco
     * @param nomeBanco Nome do banco
     * @param saldo Saldo do banco
     * @param transacao Transação do banco
     * @param dividas Dívidas do banco
     */
    constructor(
        idCliente: number,
        idMeta: number,
        nomeBanco: string,
        saldo: number,
        transacao: number,
        dividas: number
    ) {
        this.idCliente = idCliente;
        this.idMeta = idMeta;
        this.nomeBanco = nomeBanco;
        this.saldo = saldo;
        this.transacao = transacao;
        this.dividas = dividas;
    }

    /* Métodos get e set */
    /**
     * Recupera o identificador do banco
     * @returns o identificador do banco
     */
    public getIdBanco(): number {
        return this.idBanco;
    }

    /**
     * Atribui um valor ao identificador do banco
     * @param idBanco novo identificador do banco
     */
    public setIdBanco(idBanco: number): void {
        this.idBanco = idBanco;
    }

    /**
     * Recupera o identificador do cliente.
     *
     * @returns O identificador do cliente.
     */
    public getIdCliente(): number {
        return this.idCliente;
    }

    /**
     * Define o identificador do cliente.
     * 
     * @param idCliente - O identificador do cliente a ser definido.
     */
    public setIdCliente(idCliente: number): void {
        this.idCliente = idCliente;
    }

    /**
     * Recupera o identificador da meta.
     *
     * @returns O identificador da meta.
     */
    public getIdMeta(): number {
        return this.idMeta;
    }

    /**
     * Define o identificador da meta.
     * 
     * @param idMeta - O identificador da meta a ser definido.
     */
    public setIdMeta(idMeta: number): void {
        this.idMeta = idMeta;
    }

    /**
     * Recupera o nome do banco.
     *
     * @returns O nome do banco.
     */
    public getNomeBanco(): string {
        return this.nomeBanco;
    }

    /**
     * Define o nome do banco.
     * 
     * @param nomeBanco - O nome do banco a ser definido.
     */
    public setNomeBanco(nomeBanco: string): void {
        this.nomeBanco = nomeBanco;
    }

    /**
     * Recupera o saldo do banco.
     *
     * @returns O saldo do banco.
     */
    public getSaldo(): number {
        return this.saldo;
    }

    /**
     * Define o saldo do banco.
     *
     * @param saldo - O saldo do banco.
     */
    public setSaldo(saldo: number): void {
        this.saldo = saldo;
    }

    /**
     * Recupera a transação do banco.
     *
     * @returns O valor da transação do banco.
     */
    public getTransacao(): number {
        return this.transacao;
    }

    /**
     * Define o valor da transação do banco.
     *
     * @param transacao - O valor da transação.
     */
    public setTransacao(transacao: number): void {
        this.transacao = transacao;
    }

    /**
     * Recupera as dívidas do banco.
     *
     * @returns O valor das dívidas do banco.
     */
    public getDividas(): number {
        return this.dividas;
    }

    /**
     * Define as dívidas do banco.
     *
     * @param dividas - O valor das dívidas do banco.
     */
    public setDividas(dividas: number): void {
        this.dividas = dividas;
    }


    public getStatusBanco(): boolean {
        return this.statusBanco;
    }

    public setStatusBanco(_statusBanco: boolean) {
        this.statusBanco = _statusBanco
    }


    /**
     * Busca e retorna uma lista de bancos do banco de dados.
     * @returns Um array de objetos do tipo `Banco` em caso de sucesso ou `null` se ocorrer um erro durante a consulta.
     * 
     * - A função realiza uma consulta SQL para obter todas as informações da tabela "banco".
     * - Os dados retornados do banco de dados são usados para instanciar objetos da classe `Banco`.
     * - Cada banco é adicionado a uma lista que será retornada ao final da execução.
     * - Se houver falha na consulta ao banco, a função captura o erro, exibe uma mensagem no console e retorna `null`.
     */
    static async listarBancos(): Promise<Array<Banco> | null> {
        // objeto para armazenar a lista de bancos
        const listaDeBancos: Array<Banco> = [];

        try {
            // query de consulta ao banco de dados
            const querySelectBanco = `SELECT * FROM banco WHERE status_banco = TRUE;`;

            // fazendo a consulta e guardando a resposta
            const respostaBD = await database.query(querySelectBanco);

            // usando a resposta para instanciar um objeto do tipo Banco
            respostaBD.rows.forEach((linha: { id_cliente: number; id_meta: number; nome_banco: string; saldo: number; transacao: number; dividas: number; id_banco: number; }) => {
                // instancia (cria) objeto Banco
                const novoBanco = new Banco(
                    linha.id_cliente,
                    linha.id_meta,
                    linha.nome_banco,
                    linha.saldo,
                    linha.transacao,
                    linha.dividas
                );

                // atribui o ID objeto
                novoBanco.setIdBanco(linha.id_banco);

                // adiciona o objeto na lista
                listaDeBancos.push(novoBanco);
            });

            // retorna a lista de bancos
            return listaDeBancos;
        } catch (error) {
            console.log('Erro ao buscar lista de bancos. Verifique os logs para mais detalhes.');
            console.log(error);
            return null;
        }
    }

    static async cadastroBanco(banco: Banco): Promise<boolean> {
        try {
            // query para inserir um banco no banco de dados
            const queryInsertBanco = `INSERT INTO banco (id_cliente, id_meta, nome_banco, saldo, transacao, dividas)
                                    VALUES
                                    ('${banco.getIdCliente()}', 
                                    '${banco.getIdMeta()}', 
                                    '${banco.getNomeBanco()}', 
                                    ${banco.getSaldo()},
                                    ${banco.getTransacao()},
                                    ${banco.getDividas()})
                                    RETURNING id_banco;`;

            // executa a query no banco e armazena a resposta
            const respostaBD = await database.query(queryInsertBanco);

            // verifica se a quantidade de linhas modificadas é diferente de 0
            if (respostaBD.rowCount !== 0) {
                // imprime o ID do banco cadastrado
                console.log(`Banco cadastrado com sucesso! ID do banco: ${respostaBD.rows[0].id_banco}`);
                // true significa que o cadastro foi feito
                return true;
            }

            // false significa que o cadastro NÃO foi feito
            return false;
        } catch (error) {
            // imprime mensagem de erro junto com o log
            console.log('Erro ao cadastrar o banco. Verifique os logs para mais detalhes.');
            console.log(error);
            // retorna valor falso em caso de falha
            return false;
        }
    }

    /**
    * Atualiza os dados de um banco existente no banco de dados
    * 
    * @param idBanco : number
    * @param idCliente : number'
    * @param idMeta : number
    * @param nomeBanco : string
    * @param saldo : number
    * @param transacao: number
    * @param dividas : number
    * @param statusBanco : boolean
    * @returns Promise com o resultado da atualização ou erro
    */
    static async atualizarBanco(
        idBanco: number,
        idCliente: number,
        idMeta: number,
        nomeBanco: string,
        saldo: number,
        transacao: number,
        dividas: number
    ): Promise<any> {
        try {
            // Cria a consulta (query) para atualizar um banco
            const queryUpdateBanco = `UPDATE Banco
            SET id_cliente = $1, id_meta = $2, nome_banco = $3, saldo = $4, transacao = $5, dividas = $6
            WHERE id_banco = $7
            RETURNING id_banco;`;

            // estrutura os valores recebidos pela função em uma lista (array)
            const valores = [idCliente, idMeta, nomeBanco, saldo, transacao, dividas, idBanco];
            // executa a consulta e armazena o resultado
            const resultado = await database.query(queryUpdateBanco, valores);

            // verifica se o empréstimo não existe
            if (resultado.rowCount === 0) {
                // lança um novo erro
                throw new Error('Banco não encontrado.');
            }

            return resultado.rows[0].id_banco; // Retorna o ID do banco atualizado
            // captura qualquer erro que possa acontecer
        } catch (error) {
            // exibe detalhes do erro no console
            console.error(`Erro ao atualizar banco: ${error}`);
            // lança um novo erro
            throw new Error('Erro ao atualizar o banco.');
        }
    }

        /**
     * Lista todos os bancos associados a um cliente específico.
     * 
     * @param idCliente - O identificador do cliente
     * @returns Um array de objetos Banco ou null se ocorrer erro
     */
        static async listarBancosPorCliente(idCliente: number): Promise<Array<Banco> | null> {
            const listaDeBancos: Array<Banco> = [];
    
            try {
                // Query que filtra os bancos pelo id do cliente e status ativo
                const query = `SELECT * FROM banco WHERE id_cliente = $1 AND status_banco = TRUE;`;
    
                // Executa a query
                const respostaBD = await database.query(query, [idCliente]);
    
                // Itera sobre as linhas retornadas
                respostaBD.rows.forEach((linha: {
                    id_cliente: number;
                    id_meta: number;
                    nome_banco: string;
                    saldo: number;
                    transacao: number;
                    dividas: number;
                    id_banco: number;
                }) => {
                    const banco = new Banco(
                        linha.id_cliente,
                        linha.id_meta,
                        linha.nome_banco,
                        linha.saldo,
                        linha.transacao,
                        linha.dividas
                    );
                    banco.setIdBanco(linha.id_banco);
                    listaDeBancos.push(banco);
                });
    
                return listaDeBancos;
            } catch (error) {
                console.error("Erro ao listar bancos por cliente:", error);
                return null;
            }
        }
    
    

    static async removerBanco(idBanco: number): Promise<any> {
        try {

            console.log("ID recebido para remoção:", idBanco);
            if (!idBanco || isNaN(idBanco)) {
                console.error("Erro: ID do banco inválido!");
                return false;
            }
            //cria uma query para deletar um objeto do banco de dados, passando como parametro o id do banco recebido na função
            const queryUpdateBanco = ` UPDATE banco
                                            SET status_banco = FALSE
                                            WHERE id_banco = ${idBanco}`;

            //executar a query e armazenar a resposta do BD
            const respostaBD = await database.query(queryUpdateBanco);

            //verifica se a quantidade de linhas modificadas é diferente de 0
            if (respostaBD.rowCount != 0) {
                console.log(`Banco removido com sucesso! ID do banco: ${idBanco}`);
                //true significa que a remoção foi bem sucedida
                return true;
            }
            //false, o que indica que a remoção não foi bem sucedida
            return false;


            //trata qualquer erro que possa acontecer no caminho
        } catch (error) {
            //exibe uma mensagem de erro
            console.log(`Erro ao remover o banco. Verifique os logs para mais detalhes.`)
            //imprime o erro no console da API
            console.log(error);
            //retorna false, o que indica a remoção não foi feita
            return false;
        }
    }
}
