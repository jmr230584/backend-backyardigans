// server.ts (CÓDIGO CORRIGIDO)

import express from 'express';
import cors from 'cors';
import { router } from './routes';
import listEndpoints from 'express-list-endpoints';
import cookieParser from 'cookie-parser'; // Importação OK
import path from 'path'; 


const server = express();

// 1. CORS (Permite cookies)
server.use(cors({
    origin: "http://localhost:5173", 
    credentials: true     
}));

// 2. JSON Body Parser
server.use(express.json());

// 3. 🔑 CORREÇÃO: COOKIE PARSER APLICADO CEDO
// Isso garante que os cookies sejam parseados e que o Auth.ts/logout possa limpá-los.
server.use(cookieParser());


// 4. Static Files
server.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// 5. Rotas (Rotas/router)
server.use(router);

// O listEndpoints deve vir antes ou depois do router, mas não deve quebrar a ordem funcional.
// Mantenha aqui por conveniência de depuração:
console.log(listEndpoints(server)); 


export { server };