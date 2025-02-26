import { DatabaseModel } from "./DatabaseModel";

// armazenei o pool de conexões
const database = new DatabaseModel().pool;

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
            const querySelectBanco = `SELECT * FROM banco;`;

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
                                    '${banco.getSaldo()}',
                                    '${banco.getTransacao()}',
                                    '${banco.getDividas()}')
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
}
