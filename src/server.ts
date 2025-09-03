import express from 'express';
import cors from 'cors';
import { router } from './routes';
import cookieParser from 'cookie-parser';

// Cria o servidor express
const server = express();

// Configura o servidor para aceitar requisições de outros domínios
server.use(cors({
  origin: "http://localhost:5173", 
  credentials: true               
}));

// Configura o servidor para aceitar requisições no formato JSON
server.use(express.json());

// Habilita uso de cookies
server.use(cookieParser());

// Configurando as rotas no servidor
server.use(router);

// Exporta o servidor
export { server };
