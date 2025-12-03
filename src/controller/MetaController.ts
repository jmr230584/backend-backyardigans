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

            const dados = req.body;

            const meta = new Meta(
                dados.nomeMeta ?? null,
                dados.dataInicial ?? null,
                dados.dataFinal ?? null,
                dados.categorizacao ?? null,
                dados.valor ?? null
            );
            meta.setIdMeta(Number(req.query.idMeta));

            console.log('META SANITIZADA:', meta);

            if (await Meta.atualizarMeta(meta)) {
                return res.status(200).json({ mensagem: "Cadastro atualizado com sucesso!" });
            }

            return res.status(400).json({ mensagem: "Não foi possível atualizar a meta no banco de dados" });

        } catch (error) {
            console.error("Erro ao atualizar meta:", error);
            return res.status(500).json({ mensagem: "Erro ao atualizar meta" });
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
