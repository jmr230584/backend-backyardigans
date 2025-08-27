import { DataBaseModel } from "./DatabaseModel";

// armazenei o pool de conexões
const database = new DataBaseModel().pool;

/**
 * Classe que representa uma meta.
 */
export class Meta {

    /* Atributos */
    /* Identificador da meta */
    private idMeta: number = 0;
    /* Nome da meta */
    private nomeMeta: string;
    /* Data inicial da meta */
    private dataInicial: Date;
    /* Data final da meta */
    private dataFinal: Date;
    /* Categorizaçao da meta */
    private categorizacao: string;
    /* Valor da meta */
    private valor: number;
    private statusMeta: boolean = true;

    /**
     * Construtor da classe Meta
     * 
     * @param nomeMeta Nome da meta
     * @param dataInicial Data inicial da meta
     * @param dataFinal Data final da meta
     * @param categorizacao Categorizaçao da meta
     * @param valor Valor da meta
     */
    constructor(
        nomeMeta: string,
        dataInicial: Date,
        dataFinal: Date,
        categorizacao: string,
        valor: number
    ) {
        this.nomeMeta = nomeMeta;
        this.dataInicial = dataInicial;
        this.dataFinal = dataFinal;
        this.categorizacao = categorizacao;
        this.valor = valor;
    }

    /* Métodos get e set */
    /**
     * Recupera o identificador da meta
     * @returns o identificador da meta
     */
    public getIdMeta(): number {
        return this.idMeta;
    }

    /**
     * Atribui um valor ao identificador da meta
     * @param idMeta novo identificador da meta
     */
    public setIdMeta(idMeta: number): void {
        this.idMeta = idMeta;
    }

    /**
     * Recupera o nome da meta.
     *
     * @returns O nome da meta.
     */
    public getNomeMeta(): string {
        return this.nomeMeta;
    }

    /**
     * Define o nome da meta.
     * 
     * @param nomeMeta - O nome da meta a ser definido.
     */
    public setNomeMeta(nomeMeta: string): void {
        this.nomeMeta = nomeMeta;
    }

    /**
     * Retorna a data inicial da meta.
     *
     * @returns A data inicial da meta.
     */
    public getDataInicial(): Date {
        return this.dataInicial;
    }

    /**
     * Define a data inicial da meta.
     *
     * @param dataInicial - A data inicial da meta.
     */
    public setDataInicial(dataInicial: Date): void {
        this.dataInicial = dataInicial;
    }

    /**
     * Retorna a data final da meta.
     *
     * @returns A data final da meta.
     */
    public getDataFinal(): Date {
        return this.dataFinal;
    }

    /**
     * Define a data final da meta.
     *
     * @param dataFinal - A data final da meta.
     */
    public setDataFinal(dataFinal: Date): void {
        this.dataFinal = dataFinal;
    }

    /**
     * Retorna a categorização da meta.
     *
     * @returns A categorização da meta.
     */
    public getCategorizacao(): string {
        return this.categorizacao;
    }

    /**
     * Define a categorização da meta.
     *
     * @param categorizacao - A categorização.
     */
    public setCategorizacao(categorizacao: string): void {
        this.categorizacao = categorizacao;
    }

    /**
     * Retorna o valor da meta.
     *
     * @returns O valor da meta.
     */
    public getValor(): number {
        return this.valor;
    }

    /**
     * Define o valor da meta.
     *
     * @param valor - O valor da meta.
     */
    public setValor(valor: number): void {
        this.valor = valor;
    }

    /**
     * Retorna o status dam meta no sistema
     * 
     * @returns Status da meta no sistema
     */
    public getStatusMeta(): boolean {
        return this.statusMeta;
    }

    /**
     * Atribui o parâmetro ao atributo status livro
     * 
     * @param _statusMeta : Status do livro no sistema
     */
    public setStatusMeta(_statusMeta: boolean) {
        this.statusMeta = _statusMeta;
    }


    /**
     * Busca e retorna uma lista de metas do banco de dados.
     * @returns Um array de objetos do tipo `Meta` em caso de sucesso ou `null` se ocorrer um erro durante a consulta.
     * 
     * - A função realiza uma consulta SQL para obter todas as informações da tabela "meta".
     * - Os dados retornados do banco de dados são usados para instanciar objetos da classe `Meta`.
     * - Cada meta é adicionada a uma lista que será retornada ao final da execução.
     * - Se houver falha na consulta ao banco, a função captura o erro, exibe uma mensagem no console e retorna `null`.
     */
    static async listarMetas(): Promise<Array<Meta> | null> {
        // objeto para armazenar a lista de metas
        const listaDeMetas: Array<Meta> = [];

        try {
            // query de consulta ao banco de dados
            const querySelectMeta = `SELECT * FROM meta WHERE status_meta = TRUE;`;

            // fazendo a consulta e guardando a resposta
            const respostaBD = await database.query(querySelectMeta);

            // usando a resposta para instanciar um objeto do tipo Meta
            respostaBD.rows.forEach((meta: any) => {
                // instancia (cria) objeto Meta
                const novaMeta = new Meta(
                    meta.nome_meta,
                    meta.data_inicial,
                    meta.data_final,
                    meta.categorizacao,
                    meta.valor
                );

                // atribui o ID objeto
                novaMeta.setIdMeta(meta.id_meta);
                novaMeta.setStatusMeta(meta.status_meta);

                // adiciona o objeto na lista
                listaDeMetas.push(novaMeta);
            });

            // retorna a lista de metas
            return listaDeMetas;

        } catch (error) {
            console.log('Erro ao buscar lista de metas. Verifique os logs para mais detalhes.');
            console.log(error);
            return null;
        }
    }

    /**
     * Realiza o cadastro de uma meta no banco de dados.
     * 
     * Esta função recebe um objeto do tipo `Meta` e insere seus dados (nomeMeta, dataInicial, dataFinal, 
     * categorizacao, valor)
     * na tabela `meta` do banco de dados. O método retorna um valor booleano indicando se o cadastro 
     * foi realizado com sucesso.
     * 
     * @param {Livro} livro - Objeto contendo os dados da meta que será cadastrado. O objeto `Livro`
     *                        deve conter os métodos `getNomeMeta()`, `getDataInicial()`, `getDataFinal()`, `getCategorizacao()`,
     *                        `getValor()`
     *                        que retornam os respectivos valores da meta.
     * @returns {Promise<boolean>} - Retorna `true` se a meta foi cadastrado com sucesso e `false` caso contrário.
     *                               Em caso de erro durante o processo, a função trata o erro e retorna `false`.
     * 
     * @throws {Error} - Se ocorrer algum erro durante a execução do cadastro, uma mensagem de erro é exibida
     *                   no console junto com os detalhes do erro.
     */
    static async cadastroMeta(meta: Meta): Promise<boolean> {
        try {
            // query para fazer insert de uma meta no banco de dados
            const queryInsertMeta = `INSERT INTO meta (nome_meta, data_inicial, data_final, 
                                     categorizacao, valor)
                                    VALUES
                                    ('${meta.getNomeMeta()}', 
                                    '${meta.getDataInicial()}',
                                    '${meta.getDataFinal()}',
                                    '${meta.getCategorizacao()}',
                                    ${meta.getValor()}
                                   )
                                    RETURNING id_meta;`;

            // executa a query no banco e armazena a resposta
            const respostaBD = await database.query(queryInsertMeta);

            // verifica se a quantidade de linhas modificadas é diferente de 0
            if (respostaBD.rowCount != 0) {
                console.log(`Meta cadastrado com sucesso! ID da Meta: ${respostaBD.rows[0].id_meta}`);
                // true significa que o cadastro foi feito
                return true;
            }
            // false significa que o cadastro NÃO foi feito.
            return false;

            // tratando o erro
        } catch (error) {
            // imprime outra mensagem junto com o erro
            console.log('Erro ao cadastrar a meta. Verifique os logs para mais detalhes.');
            // imprime o erro no console
            console.log(error);
            // retorno um valor falso
            return false;
        }
    }


    /**
    * Atualiza os dados de um meta no banco de dados.
    * @param meta Objeto do tipo meta com os novos dados
    * @returns true caso sucesso, false caso erro
    */
    static async atualizarMeta(meta: Meta): Promise<Boolean> {
        let queryResult = false; // Variável para armazenar o resultado da operação.
        try {
            // Construção da query SQL para atualizar os dados da meta no banco de dados.
            const queryAtualizarMeta = `UPDATE meta SET 
                                            nome_meta = '${meta.getNomeMeta().toUpperCase()}', 
                                            data_inicial = '${meta.getDataInicial()}',
                                            data_final = '${meta.getDataFinal()}', 
                                            categorizacao = '${meta.getCategorizacao().toUpperCase()}',
                                            valor = ${meta.getValor()}
                                            WHERE id_meta = ${meta.idMeta}`;

            // Executa a query de atualização e verifica se a operação foi bem-sucedida.
            await database.query(queryAtualizarMeta)
                .then((result) => {
                    if (result.rowCount != 0) {
                        queryResult = true; // Se a operação foi bem-sucedida, define queryResult como true.
                    }
                });

            // Retorna o resultado da operação para quem chamou a função.
            return queryResult;
            // captura qualquer erro que possa acontecer
        } catch (error) {
            // exibe detalhes do erro no console
            console.log(`Erro na consulta: ${error}`);
            // retorna o valor da variável de controle
            return queryResult;
        }
    }

    /**
   * Remove um meta do banco de dados
   * @param idMeta ID da meta a ser removido
   * @returns Boolean indicando se a remoção foi bem-sucedida
  */
    static async removerMeta(id_meta: number): Promise<Boolean> {
        // variável de controle da execução da query
        let queryResult = false;

        try {
            // Cria a consulta para remover meta do banco de dados
            const queryDeleteMetaBanco = `UPDATE banco
                                         SET status_banco = FALSE 
                                         WHERE id_meta = ${id_meta}`;

            // executa a query para remover empréstimo
            await database.query(queryDeleteMetaBanco);

            // Construção da query SQL para deletar a meta.
            const queryDeleteMeta = `UPDATE meta
                                        SET status_meta = FALSE 
                                        WHERE id_meta = ${id_meta};`;

            // Executa a query de exclusão e verifica se a operação foi bem-sucedida.
            await database.query(queryDeleteMeta)
                .then((result) => {
                    if (result.rowCount != 0) {
                        queryResult = true; // Se a operação foi bem-sucedida, define queryResult como true.
                    }
                });

            // retorna o valor da variável de controle
            return queryResult;

            // captura qualquer erro que possa acontecer
        } catch (error) {
            // Exibe detalhes do erro no console
            console.log(`Erro na consulta: ${error}`);
            // retorna o valor fa variável de controle
            return queryResult;
        }
    }


}
