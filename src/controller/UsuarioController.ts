import { Usuario } from '../model/Usuario'; // modelo do usuário
import { Request, Response } from "express"; // Request e Response do express
import fs from 'fs'; // Importa o módulo fs para manipulação de arquivos (file system)
import path from 'path';  // Importa o módulo path para lidar com caminhos de arquivos e diretórios

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
        try {
            const dadosRecebidos: UsuarioDTO = req.body;
            const novoUsuario = new Usuario(
                dadosRecebidos.nome,
                dadosRecebidos.username,
                dadosRecebidos.email
            );
            novoUsuario.setSenha(dadosRecebidos.senha);
    
            const uuid = await Usuario.cadastroUsuario(novoUsuario);
            if (!uuid) {
                res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
                return;
            }
    
            if (req.file) {
                const ext = path.extname(req.file.originalname);
                const novoNome = `${uuid}${ext}`;
                const antigoPath = req.file.path;
                const novoPath = path.resolve(req.file.destination, novoNome);
    
                fs.renameSync(antigoPath, novoPath);
                await Usuario.atualizarImagemPerfil(uuid, novoNome);
            }
    
            res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso' });
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            res.status(500).json({ erro: 'Erro ao cadastrar usuário', detalhes: error });
        }
    }
}

export default UsuarioController;