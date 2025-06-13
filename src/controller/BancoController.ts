import { Request, Response } from "express";
import { Banco } from "../model/Banco";

interface BancoDTO {
  idCliente: number;
  idMeta: number;
  nomeBanco: string;
  saldo: number;
  transacao: number;
  dividas: number;
}

export class BancoController {
  static async lista(req: Request, res: Response): Promise<any> {
    try {
      const listaDeContas = await Banco.listarBancos();
      return res.status(200).json(listaDeContas);
    } catch (error) {
      console.log('Erro ao acessar a listagem de contas bancárias');
      return res.status(400).json({ mensagem: "Não foi possível acessar a listagem de contas bancárias" });
    }
  }

  static async novo(req: Request, res: Response): Promise<any> {
    try {
      const bancoRecebido: BancoDTO = req.body;
      const novoBanco = new Banco(
        bancoRecebido.idCliente,
        bancoRecebido.idMeta,
        bancoRecebido.nomeBanco,
        bancoRecebido.saldo,
        bancoRecebido.transacao,
        bancoRecebido.dividas
      );
      const respostaClasse = await Banco.cadastroBanco(novoBanco);
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
        !dadosRecebidos.idCliente ||
        !dadosRecebidos.idMeta ||
        !dadosRecebidos.nomeBanco ||
        !dadosRecebidos.saldo ||
        !dadosRecebidos.transacao ||
        !dadosRecebidos.dividas
      ) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
      }
      const bancoAtualizado = await Banco.atualizarBanco(
        idBanco,
        dadosRecebidos.idCliente,
        dadosRecebidos.idMeta,
        dadosRecebidos.nomeBanco,
        dadosRecebidos.saldo,
        dadosRecebidos.transacao,
        dadosRecebidos.dividas
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

  static async listarBancosPorCliente(req: Request, res: Response): Promise<any> {
    try {
      const { idCliente } = req.params;
      if (!idCliente || isNaN(Number(idCliente))) {
        return res.status(400).json({ mensagem: "ID do cliente inválido." });
      }
      const bancosDoCliente = await Banco.listarBancosPorCliente(Number(idCliente));
      return res.status(200).json(bancosDoCliente);
    } catch (error) {
      console.error("Erro ao buscar bancos por cliente:", error);
      return res.status(500).json({ mensagem: "Erro interno ao buscar bancos por cliente." });
    }
  }
}
