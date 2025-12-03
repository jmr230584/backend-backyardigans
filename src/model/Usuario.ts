import { DataBaseModel } from "./DatabaseModel";
import bcrypt from 'bcrypt';

// Recupera conexão com o banco de dados
const database = new DataBaseModel().pool;

/**
 * Classe que representa um usuário no sistema
 */
export class Usuario {
    private idUsuario: number = 0;
    private uuidUsuario: string = '';

    private nome: string = '';
    private username: string = '';
    private email: string = '';

    private senha: string = '';
    private imagemPerfil: string = '';

    constructor(
        _nome: string,
        _username: string,
        _email: string
    ) {
        this.nome = _nome;
        this.username = _username;
        this.email = _email;
    }

    public getIdUsuario(): number {
        return this.idUsuario;
    }

    public setIdUsuario(idUsuario: number): void {
        this.idUsuario = idUsuario;
    }

    public getUuidUsuario(): string {
        return this.uuidUsuario;
    }

    public setUuidUsuario(uuidUsuario: string): void {
        this.uuidUsuario = uuidUsuario;
    }

    public getNome(): string {
        return this.nome;
    }

    public setNome(nome: string): void {
        this.nome = nome;
    }

    public getUsername(): string {
        return this.username;
    }

    public setUsername(username: string): void {
        this.username = username;
    }

    public getEmail(): string {
        return this.email;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    public getSenha(): string {
        return this.senha;
    }

    public async setSenha(senha: string): Promise<void> {
        const saltRounds = 10;
        this.senha = await bcrypt.hash(senha, saltRounds);
    }

    public getImagemPerfil(): string {
        return this.imagemPerfil;
    }

    public setImagemPerfil(imagem: string): void {
        this.imagemPerfil = imagem;
    }

    static async listarUsuarios(): Promise<Array<Usuario> | null> {
        let listaDeUsuarios: Array<Usuario> = [];

        try {
            const respostaBD = await database.query(`SELECT * FROM usuario`);

            respostaBD.rows.forEach((usuario) => {
                let novoUsuario = new Usuario(
                    usuario.nome,
                    usuario.username,
                    usuario.email
                );

                novoUsuario.setIdUsuario(usuario.id_usuario);
                novoUsuario.setUuidUsuario(usuario.uuid);

                listaDeUsuarios.push(novoUsuario);
            });

            return listaDeUsuarios;

        } catch (error) {
            console.log(`Erro ao recuperar usuários. ${error}`);
            return null;
        }
    }

    static async cadastroUsuario(usuario: Usuario): Promise<string | null> {
        try {
            const query = `
              INSERT INTO usuario (nome, username, email, senha)
              VALUES ($1, $2, $3, $4)
              RETURNING uuid
            `;
    
            const valores = [
                usuario.getNome(),
                usuario.getUsername(),
                usuario.getEmail(),
                usuario.getSenha()
            ];
    
            const resultado = await database.query(query, valores);
    
            usuario.setUuidUsuario(resultado.rows[0].uuid);
            return usuario.getUuidUsuario();

        } catch (error) {
            console.error('Erro ao salvar usuário:', error);
            return null;
        }
    }

    static async atualizarImagemPerfil(uuid: string, nomeArquivo: string): Promise<void> {
        const query = `UPDATE usuario SET imagem_perfil = $1 WHERE uuid = $2`;
        await database.query(query, [nomeArquivo, uuid]);
    }
}
