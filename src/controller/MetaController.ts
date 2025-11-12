import { Request, Response } from "express";
import { Meta } from "../model/Meta";

interface MetaDTO {
    nomeMeta: string;
    dataInicial: Date;
    dataFinal: Date;
    categorizacao: string;
    valor: number;
}

export class MetaController extends Meta {
    
    static async lista(req: Request, res: Response): Promise<any> {
        try {
            const listaDeMetas = await Meta.listarMetas(); // Você precisará implementar este método em Meta.
            return res.status(200).json(listaDeMetas);
        } catch (error) {
            console.log('Erro ao acessar a listagem das metas');
            return res.status(400).json({ mensagem: "Não foi possível acessar a listagem das metas" });
        }
    }

    static async nova(req: Request, res: Response): Promise<any> {
        try {
            const metaRecebida: MetaDTO = req.body;
            const novaMeta = new Meta(
                metaRecebida.nomeMeta,
                metaRecebida.dataInicial,
                metaRecebida.dataFinal,
                metaRecebida.categorizacao,
                metaRecebida.valor,
            );
            const repostaClasse = await Meta.cadastroMeta(novaMeta);
            console.log(novaMeta);
            if (repostaClasse) {
                return res.status(200).json({ mensagem: "Meta cadastrada com sucesso!" });
            } else {
                return res.status(400).json({ mensagem: "Erro ao cadastra a meta. Entre em contato com o administrador do sistema." })
            }
        } catch (error) {
            console.log(`Erro ao cadastrar uma meta. ${error}`);
            return res.status(400).json({ mensagem: "Não foi possível cadastrar a meta. Entre em contato com o administrador do sistema." });
        }
    }

    static async atualizar(req: Request, res: Response): Promise<any> {
        try {
            const dadosRecebidos: MetaDTO = req.body;
        
            const meta = new Meta(
                dadosRecebidos.nomeMeta,
                dadosRecebidos.dataInicial, 
                dadosRecebidos.dataFinal,
                dadosRecebidos.categorizacao,
                dadosRecebidos.valor,
            );

            // Define o ID da meta, que deve ser passado na query string
            meta.setIdMeta(parseInt(req.query.idMeta as string));    
            
            // Chama o método para atualizar o cadastro da meta no banco de dados
            if (await Meta.atualizarMeta(meta)) {
                return res.status(200).json({ mensagem: "Cadastro atualizado com sucesso!" });
            } else {
                return res.status(400).json('Não foi possível atualizar a meta no banco de dados');
            }
        } catch (error) {
            // Caso ocorra algum erro, este é registrado nos logs do servidor
            console.error(`Erro no modelo: ${error}`);
            // Retorna uma resposta com uma mensagem de erro
            return res.json({ mensagem: "Erro ao atualizar aluno." });
        }
    }

  static async remover(req: Request, res: Response): Promise<any> {
    try {
      const idMeta = parseInt(req.query.idMeta as string);
      const respostaModelo = await Meta.removerMeta(idMeta);
      if (respostaModelo) {
        return res.status(200).json({ mensagem: "Meta removida com sucesso!" });
      } else {
        return res.status(400).json({ mensagem: "Erro ao remover o meta. Entre em contato com o administrador do sistema." });
      }
    } catch (error) {
      console.log(`Erro ao remover um banco. ${error}`);
      return res.status(400).json({ mensagem: "Não foi possível remover a meta. Entre em contato com o administrador do sistema." });
    }
  }

}
