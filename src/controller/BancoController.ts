import { Request, Response } from "express";
import { Banco } from "../model/Banco";

interface BancoDTO {
  nomeBanco: string;
  tipoBanco: string;
  metaVinculada: number;
  entrada: number;
}

export class BancoController extends Banco {

  static async lista(req: Request, res: Response): Promise<any> {
    try {
      const listaDeBancos = await Banco.listarBancos();
      return res.status(200).json(listaDeBancos);
    } catch (error) {
      console.log('Erro ao acessar a listagem de contas bancárias');
      return res.status(400).json({ mensagem: "Não foi possível acessar a listagem de contas bancárias" });
    }
  }

  static async novo(req: Request, res: Response): Promise<any> {
    try {
      const bancoRecebido: BancoDTO = req.body;
      const novoBanco = new Banco(
        bancoRecebido.nomeBanco,
        bancoRecebido.tipoBanco,
        bancoRecebido.metaVinculada,
        bancoRecebido.entrada,
      );
      const respostaClasse = await Banco.cadastroBanco(novoBanco);
      console.log(novoBanco);
      if (respostaClasse) {
        return res.status(200).json({ mensagem: "Banco cadastrado com sucesso!" });
      } else {
        return res.status(400).json({ mensagem: "Erro ao cadastrar o banco. Entre em contato com o administrador do sistema." });
      }
    } catch (error) {
      console.log(`Erro ao cadastrar um banco. ${error}`);
      return res.status(400).json({ mensagem: "Não foi possível cadastrar o banco. Entre em contato com o administrador do sistema." });
    }
  }

  static async atualizar(req: Request, res: Response): Promise<any> {
    try {
      const dadosRecebidos: BancoDTO = req.body;
      const idBanco = parseInt(req.query.idBanco as string);
      if (
        !idBanco ||
        !dadosRecebidos.nomeBanco ||
        !dadosRecebidos.tipoBanco ||
        !dadosRecebidos.metaVinculada ||
        !dadosRecebidos.entrada
      ) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
      }
      const bancoAtualizado = await Banco.atualizarBanco(
        idBanco,
        dadosRecebidos.nomeBanco,
        dadosRecebidos.tipoBanco,
        dadosRecebidos.metaVinculada,
        dadosRecebidos.entrada
      );
      return res.status(200).json({ message: 'Banco atualizado com sucesso', idBanco: bancoAtualizado });
    } catch (error) {
      console.error('Erro ao atualizar o banco:', error);
      return res.status(500).json({ message: 'Erro ao atualizar o banco.' });
    }
  }

  static async remover(req: Request, res: Response): Promise<any> {
    try {
      const idBanco = parseInt(req.query.idBanco as string);
      const respostaModelo = await Banco.removerBanco(idBanco);
      if (respostaModelo) {
        return res.status(200).json({ mensagem: "Banco removido com sucesso!" });
      } else {
        return res.status(400).json({ mensagem: "Erro ao remover o banco. Entre em contato com o administrador do sistema." });
      }
    } catch (error) {
      console.log(`Erro ao remover um banco. ${error}`);
      return res.status(400).json({ mensagem: "Não foi possível remover o banco. Entre em contato com o administrador do sistema." });
    }
  }
}