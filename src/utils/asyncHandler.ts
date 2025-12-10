// src/utils/asyncHandler.ts

import { Request, Response, NextFunction, RequestHandler } from 'express';

// Define a tipagem correta para o Controller
type AsyncRequestHandler = (
    req: Request, 
    res: Response, 
    next: NextFunction
) => Promise<any>;

/**
 * Função utilitária para encapsular controllers assíncronos.
 * Resolve o problema de tipagem do Express/TypeScript (Promise<Response> vs. void)
 * e garante que erros em funções async sejam capturados e passados para o Express.
 */
export const asyncHandler = (fn: AsyncRequestHandler): RequestHandler => 
    (req: Request, res: Response, next: NextFunction) => {
        // Envolve a execução do controller assíncrono. 
        // Se houver um erro, ele chama next(error), permitindo que o Express o trate.
        Promise.resolve(fn(req, res, next)).catch(next);
    };