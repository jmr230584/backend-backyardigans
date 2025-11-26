import { DataBaseModel } from "./DatabaseModel";

// armazenei o pool de conexões
const database = new DataBaseModel().pool;

/**
 * Classe que representa um banco.
 */
export class Banco {

    /* Atributos */
    /* Identificador do banco */
    private idBanco: number = 0;
    /* Nome do banco */
    private nomeBanco: string;
    /* tipo do banco */
    private tipoBanco: string;
    /* meta vinculada */
    private metaVinculada: number;
    /* entrada */
    private entrada: number;
     /*status de registro do banco*/
    private statusBanco: boolean = true;

    /**
     * Construtor da classe Banco
     * 
     * @param nomeBanco 
     * @param tipoBanco 
     * @param metaVinculada 
     * @param entrada 
     */
    constructor(
        nomeBanco: string,
        tipoBanco: string,
        metaVinculada: number,
        entrada: number
    ) {
        this.nomeBanco = nomeBanco;
        this.tipoBanco = tipoBanco;
        this.metaVinculada = metaVinculada;
        this.entrada = entrada;
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
     * Recupera o tipo do banco.
     *
     * @returns O tipo do banco.
     */
    public getTipoBanco(): string {
        return this.tipoBanco;
    }

    /**
     * Define o tipo do banco.
     *
     * @param tipoBanco - O tipo do banco.
     */
    public setTipoBanco(tipoBanco: string): void {
        this.tipoBanco = tipoBanco;
    }

    /**
     * Recupera a meta vinculada do banco.
     *
     * @returns O valor da meta vinculada do banco.
     */
    public getMetaVinculada(): number{
        return this.metaVinculada;
    }

    /**
     * Define o valor da MetaVinculada do banco.
     *
     * @param MetaVinculada - O valor da MetaVinculada.
     */
    public setMetaVinculada(metaVinculada: number): void {
        this.metaVinculada = metaVinculada;
    }

    /**
     * Recupera as entrada do banco.
     *
     * @returns O valor das entrada do banco.
     */
    public getEntrada(): number {
        return this.entrada;
    }

    /**
     * Define as entrada do banco.
     *
     * @param entrada - O valor das entrada do banco.
     */
    public setEntrada(entrada: number): void {
        this.entrada = entrada;
    }

        /**
     * Retorna o status do banco no sistema
     * 
     * @return Status do banco no sistema
     */
    public getStatusBanco(): boolean {
        return this.statusBanco;
    }

    /**
     * Atribui um valor ao status do banco
     * 
     * @param _statusBanco : Valor a ser atribuido ao status do banco
     */
    public setStatusBanco(_statusBanco: boolean) {
        this.statusBanco = _statusBanco;
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
            respostaBD.rows.forEach((banco: any) => {
                // instancia (cria) objeto Banco
                const novoBanco = new Banco(
                    banco.nome_banco,
                    banco.tipo_banco,
                    banco.meta_vinculada,
                    banco.entrada
                );

                // atribui o ID objeto
                novoBanco.setIdBanco(banco.id_banco);
                novoBanco.setStatusBanco(banco.status_banco);

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
            const queryInsertBanco = `INSERT INTO banco (nome_banco, tipo_banco, meta_vinculada, entrada)
                                    VALUES
                                    ('${banco.getNomeBanco()}', 
                                    '${banco.getTipoBanco()}', 
                                    '${banco.getMetaVinculada()}', 
                                    '${banco.getEntrada()}')
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
    * @param nomeBanco : string
    * @param tipoBanco : string
    * @param metaVinculada : number
    * @param entrada : number
    * @returns Promise com o resultado da atualização ou erro
    */
    static async atualizarBanco(
        idBanco: number,
        nomeBanco: string,
        tipoBanco: string,
        metaVinculada: number,
        entrada: number
    ): Promise<any> {
        try {
            // Cria a consulta (query) para atualizar um banco
            const queryUpdateBanco = `UPDATE Banco
            SET nome_banco = $1, tipo_banco = $2, meta_vinculada = $3, entrada = $4
            WHERE id_banco = $7
            RETURNING id_banco;`;

            // estrutura os valores recebidos pela função em uma lista (array)
            const valores = [nomeBanco, tipoBanco, metaVinculada, entrada, idBanco];
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
