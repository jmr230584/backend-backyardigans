import { Request, Response } from "express";
import { Banco } from "../model/Banco"; // Presumindo que o caminho para o Model está correto

interface BancoDTO {
  idCliente: number;
  idMeta: number;
  nomeBanco: string;
  saldo: number;
  transacao: number;
  dividas: number;
}

// Interface para o corpo da requisição de transação
interface TransacaoDTO {
    idCliente: number;
    tipo: 'RECEITA' | 'DESPESA'; // Tipo de transação
    valor: number;
    // Você pode adicionar idBanco aqui se estiver enviando por banco específico
}

export class BancoController {
  
    // ... (Funções existentes: lista, novo, atualizar, remover, listarBancosPorCliente)

    // --- FUNÇÃO DE REGISTRO DE TRANSAÇÃO (RECEITA/DESPESA) ---
    static async criarTransacao(req: Request, res: Response): Promise<Response> {
        // Tipagem do corpo da requisição
        const { idCliente, tipo, valor } = req.body as TransacaoDTO;

        // --- 1. VALIDAÇÃO DE ENTRADA ---
        if (!idCliente || !tipo || !valor || typeof valor !== 'number' || valor <= 0) {
            return res.status(400).json({ error: 'Dados da transação incompletos. idCliente, tipo e valor são obrigatórios.' });
        }
        
        // Garantir que o tipo é válido e em maiúsculas (para o Model)
        const tipoUpperCase = tipo.toUpperCase() as 'RECEITA' | 'DESPESA';
        if (tipoUpperCase !== 'RECEITA' && tipoUpperCase !== 'DESPESA') {
            return res.status(400).json({ error: 'Tipo de transação inválido. Deve ser RECEITA ou DESPESA.' });
        }

        try {
            // --- 2. CHAMADA AO MODEL ---
            // Chamamos a função do Model que irá buscar o banco, calcular os novos valores
            // (saldo, transacao/dividas) e atualizar o registro no DB.
            const sucesso = await Banco.registrarTransacao(idCliente, tipoUpperCase, valor);

            if (sucesso) {
                // Sucesso na transação e atualização do DB
                return res.status(201).json({ message: `${tipoUpperCase} registrada com sucesso. Saldo atualizado.` });
            } else {
                // Falha interna do Model (ex: cliente não tem banco ativo, erro de query)
                return res.status(400).json({ error: 'Falha ao registrar transação. Verifique se o cliente possui um banco ativo.' });
            }

        } catch (error) {
            // Erro de sistema ou conexão
            console.error("Erro interno ao processar a transação:", error);
            return res.status(500).json({ error: 'Erro interno do servidor ao registrar transação.' });
        }
    }


    // As funções já existentes permanecem abaixo:

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