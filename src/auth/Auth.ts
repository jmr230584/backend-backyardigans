// src/auth/Auth.ts

import jwt, { JwtPayload as BaseJwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { DataBaseModel } from '../model/DataBaseModel';
import bcrypt from 'bcrypt';

const SECRET = process.env.JWT_SECRET || 'bananinha';
const database = new DataBaseModel().pool;

/**
 * Interface para estender o Payload do JWT com dados do usuário
 */
interface JwtPayload extends BaseJwtPayload {
    id: string;
    nome: string;
    username: string;
    imagemPerfil?: string; 
    exp: number;
}

/**
 * Interface customizada para resolver o erro TS2339 (userId, nome, etc.).
 */
interface CustomRequest extends Request {
    userId?: string;
    nome?: string;
    username?: string;
    imagemPerfil?: string;
}

/**
 * Gera e trata um token de autenticação para o sistema
 */
export class Auth {

    /**
     * Valida as credenciais do usuário no banco de dados
     */
    static async validacaoUsuario(req: Request, res: Response): Promise<any> {
        const { email, senha } = req.body;

        const querySelectUser = `
            SELECT uuid, nome, email, senha, username, imagem_perfil
            FROM usuario 
            WHERE LOWER(email) = LOWER($1) AND status_usuario = TRUE;
        `;

        try {
            const queryResult = await database.query(querySelectUser, [email]);

            if (queryResult.rowCount === 0) {
                return res.status(401).json({ auth: false, message: "Usuário e/ou senha incorretos" });
            }

            const usuarioBanco = queryResult.rows[0];
            const senhaValida = await bcrypt.compare(senha, usuarioBanco.senha);

            if (!senhaValida) {
                return res.status(401).json({ auth: false, message: "Usuário e/ou senha incorretos" });
            }

            const usuario = {
                uuid: usuarioBanco.uuid,
                nome: usuarioBanco.nome,
                email: usuarioBanco.email,
                username: usuarioBanco.username,
                imagemPerfil: usuarioBanco.imagem_perfil
            };

            const tokenUsuario = Auth.generateToken(
                usuarioBanco.uuid, 
                usuario.nome, 
                usuario.username,
                usuario.imagemPerfil
            );


            // 🚨 CORREÇÃO CRÍTICA: REMOÇÃO de httpOnly para permitir exclusão pelo Frontend
            res.cookie("token", tokenUsuario, {
                // REMOVIDO: httpOnly: true (Permite acesso/limpeza via JS no Front-end)
                maxAge: 1000 * 60 * 60, // 1h
                path: "/" 
            });

            return res.status(200).json({ auth: true, usuario });

        } catch (error) {
            console.error(`Erro no modelo: ${error}`);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    /**
     * Gera token JWT
     */
    static generateToken(id: string, nome: string, username: string, imagemPerfil?: string) {
        return jwt.sign({ id, nome, username, imagemPerfil }, SECRET, { expiresIn: "1h" });
    }


    /**
     * Verifica token do cookie
     */
    static verifyToken(req: CustomRequest, res: Response, next: NextFunction): void { 
        const token = req.cookies?.token;

        if (!token) {
            res.status(401).json({ message: "Token não informado", auth: false });
            return;
        }

        try {
            const decoded = jwt.verify(token, SECRET) as JwtPayload;
            const { exp, id, nome, username, imagemPerfil } = decoded; 

            if (!exp || !id) {
                res.status(401).json({ message: "Token inválido, faça login", auth: false });
                return;
            }

            const currentTime = Math.floor(Date.now() / 1000);
            if (currentTime > exp) {
                res.status(401).json({ message: "Token expirado, faça login novamente", auth: false });
                return;
            }

            // Injeta dados do usuário na requisição
            req.userId = id;
            req.nome = nome;
            req.username = username;
            req.imagemPerfil = imagemPerfil; 

            next();
        } catch (err) {
            res.status(401).json({ message: "Token inválido, faça login", auth: false });
            return;
        }
    }


    /**
     * Logout - limpa cookie
     */
    static logout(req: Request, res: Response) {
        // 🔑 CORREÇÃO FINAL: Forçar a expiração e remover httpOnly para compatibilidade
        res.cookie("token", "", { 
            expires: new Date(0), // Define a data de expiração para o passado (imediata)
            // REMOVIDO: httpOnly: true
            path: "/" 
        });
        
        return res.status(200).json({ message: "Logout realizado com sucesso" });
    }

    /**
     * Atualiza todas as senhas dos usuários para bcrypt
     */
    static async atualizarSenhasComBcrypt(req: Request, res: Response): Promise<any> {
        const querySelect = `SELECT id_usuario, senha FROM usuario WHERE status_usuario = TRUE;`;
        const queryUpdate = `UPDATE usuario SET senha = $1 WHERE id_usuario = $2;`;

        try {
            const { rows } = await database.query(querySelect);

            for (const usuario of rows) {
                const senhaCriptografada = await bcrypt.hash(usuario.senha, 10);
                await database.query(queryUpdate, [senhaCriptografada, usuario.id_usuario]);
            }

            return res.status(200).json({ message: "Todas as senhas foram atualizadas com bcrypt com sucesso!" });

        } catch (error) {
            console.error("Erro ao atualizar senhas:", error);
            return res.status(500).json({ message: "Erro ao atualizar senhas no banco de dados." });
        }
    }
}