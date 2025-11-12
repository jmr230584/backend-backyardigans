import { Usuario } from '../model/Usuario'; // modelo do usuário
import { Request, Response } from "express"; // Request e Response do express
import fs from 'fs'; // Importa o módulo fs para manipulação de arquivos (file system)
import path from 'path';  // Importa o módulo path para lidar com caminhos de arquivos e diretórios
import bcrypt from 'bcrypt';
import { DataBaseModel } from '../model/DataBaseModel';

const database = new DataBaseModel().pool;

/**
 * Interface UsuarioDTO
 * Define os atributos esperados na requisição de cadastro de usuário
 */
interface UsuarioDTO {
    nome: string;       // Nome completo do usuário
    username: string;   // Nome de usuário para login
    email: string;      // Endereço de e-mail
    senha: string;      // Senha de acesso
}

/**
 * Controlador responsável pelas operações relacionadas aos usuários.
 */
class UsuarioController extends Usuario {

    /**
     * Cadastra um novo usuário.
     * Também processa o upload da imagem de perfil, se fornecida.
     * 
     * @param req Objeto de requisição HTTP contendo os dados do usuário e, opcionalmente, o arquivo de imagem.
     * @param res Objeto de resposta HTTP.
     * @returns Mensagem de sucesso ou erro em formato JSON.
     */
    static async cadastrar(req: Request, res: Response) {
    const { nome, username, email, senha } = req.body;
    const imagemPerfil = req.file?.filename;

    try {
        const query = `
            INSERT INTO usuario (nome, username, email, senha, imagem_perfil)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;

        const senhaCriptografada = await bcrypt.hash(senha, 10); 

        const result = await database.query(query, [
            nome,
            username,
            email,
            senhaCriptografada, // usar o hash
            imagemPerfil
        ]);

        res.status(201).json({ message: 'Usuário cadastrado com sucesso', usuario: result.rows[0] });

    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        res.status(500).json({ message: 'Erro interno ao cadastrar usuário' });
    }
}

}

export default UsuarioController;