import { Usuario } from '../model/Usuario';
import { Request, Response } from "express";
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import { DataBaseModel } from '../model/DataBaseModel';

const database = new DataBaseModel().pool;

/**
 * Interface UsuarioDTO
 * Define os atributos esperados na requisição de cadastro de usuário
 */
interface UsuarioDTO {
    nome: string; 
    username: string;
    email: string;
    senha: string;
}

/**
 * Controlador responsável pelas operações relacionadas aos usuários.
 */
export class UsuarioController extends Usuario {

    static async cadastrar(req: Request, res: Response) {
        const { nome, username, email, senha } = req.body;
        const imagemPerfil = req.file?.filename;
        const uploadPath = path.resolve(__dirname, '..', '..', 'uploads'); 
        
        // Garante que a imagem opcional seja NULL e não undefined
        const imagemPerfilParaDB = imagemPerfil || null; 

        const deleteUploadedFile = (fileName: string | undefined) => {
            if (fileName) {
                const filePath = path.join(uploadPath, fileName);
                fs.unlink(filePath, (err) => {
                    if (err) console.error("Erro ao deletar imagem temporária:", err);
                });
            }
        };

        try {
            // 1. VALIDAÇÃO DE DUPLICIDADE
            const checkQuery = `
                SELECT 1 FROM usuario
                WHERE username = $1 OR email = $2;
            `;
            const checkResult = await database.query(checkQuery, [username, email]);

            if (checkResult.rowCount! > 0) {
                deleteUploadedFile(imagemPerfil);
                return res.status(400).json({ message: 'Nome de usuário ou e-mail já estão em uso.' });
            }

            // 2. INSERÇÃO DO USUÁRIO
            const insertQuery = `
                INSERT INTO usuario (nome, username, email, senha, imagem_perfil)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING uuid; /* 🚨 CORREÇÃO: Usa a coluna 'uuid' que existe na tabela */
            `;

            const senhaCriptografada = await bcrypt.hash(senha, 10);

            const result = await database.query(insertQuery, [
                nome,
                username,
                email,
                senhaCriptografada, // Deve ter espaço suficiente (VARCHAR(100))
                imagemPerfilParaDB
            ]);
            
            // Retorna o UUID gerado
            res.status(201).json({ 
                message: 'Usuário cadastrado com sucesso.', 
                id: result.rows[0].uuid // Retorna o 'uuid'
            });

        } catch (error) {
            console.error("--- ERRO FATAL AO CADASTRAR USUÁRIO NO DB ---");
            console.error(error); 
            console.error("-------------------------------------------------");

            deleteUploadedFile(imagemPerfil);

            res.status(500).json({ message: 'Erro interno ao cadastrar usuário' });
        }
    }

    /**
     * Rota de acesso para obter o nome do arquivo da imagem de perfil.
     * @param req Objeto de requisição HTTP (deve conter o UUID após o token ser verificado).
     * @param res Objeto de resposta HTTP.
     * @returns Resposta HTTP contendo o nome do arquivo ou erro.
     */
    static async getNomeImagemPerfil(req: Request, res: Response): Promise<Response> {
        // Assume que o middleware de autenticação adiciona 'userId' ao corpo da requisição
        const uuidUsuario = req.body.userId;

        if (!uuidUsuario) {
            return res.status(400).json({ message: "UUID do usuário não encontrado na requisição." });
        }

        try {
            // Usa 'uuid' na busca, assumindo que Auth.verifyToken usa o UUID
            const result = await database.query(
                `SELECT imagem_perfil FROM usuario WHERE uuid = $1`,
                [uuidUsuario]
            );
            const nomeArquivo = result.rows[0]?.imagem_perfil;

            if (nomeArquivo) {
                return res.status(200).json({ fileName: nomeArquivo });
            } else {
                return res.status(404).json({ message: "Imagem de perfil não registrada para este usuário." });
            }
        } catch (error) {
            console.error("Erro ao buscar avatar no BD:", error);
            return res.status(500).json({ message: "Erro interno ao buscar imagem." });
        }
    }
}