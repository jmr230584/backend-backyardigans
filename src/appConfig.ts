/**
 * Configuração de todas as rotas da interface web
 * Todas os endereços das páginas devem ser inseridas em APP_ROUTES
 */
export const APP_ROUTES = {
    ROUTE_HOME: '/',
    ROUTE_LOGIN: '/login',
    ROUTE_CADASTRO: '/cadastro', 
    
    ROUTE_LISTAGEM_METAS: '/metas',
    ROUTE_VISAO_GERAL: '/bancos',
    ROUTE_CONVERSOR_MOEDA: '/calculadora',
    ROUTE_PERFIL: '/perfil',
    
    // Rotas de Ações
    ROUTE_ADICIONAR_META: '/adicionar/meta',
    ROUTE_ATUALIZAR_META: '/atualizar/meta',
    ROUTE_ADICIONAR_USUARIO: '/adicionar/usuario',
    
    // Outras rotas importantes que podem existir
    ROUTE_CLIENTES: '/clientes',
};

/**
 * Configurações referente ao servidor da API
 */
export const API_CONFIG = {
    API_URL: 'http://localhost:3333',
    API_ROUTE_LOGIN: '/login',
}

export const SERVER_CFG = {
    SERVER_URL: 'http://localhost:3333',
}

// ----------------------------------------------------------------------
// 🚨 CORRIGIDO: Definição de todos os ENDPOINTS do Backend (SERVER_ROUTES)
// Esta é a única definição para exportar as rotas de API!
// ----------------------------------------------------------------------

export const SERVER_ROUTES = {
    // Rotas de Usuário/Autenticação
    NOVO_USUARIO: "/usuario/cadastro", 
    LOGIN: "/login", // 🚨 Resolve o erro da linha 106
    LOGOUT: "/logout",
    PERFIL_IMAGEM: "/perfil/imagem", // 🚨 Resolve o erro da linha 119
    PROFILE: "/profile", // 🚨 Resolve o erro da linha 125

    // Rotas de Cliente
    LISTAR_CLIENTES: "/cliente",
    NOVO_CLIENTE: "/cliente/novo",
    REMOVER_CLIENTE: "/cliente/remover",
    ATUALIZAR_CLIENTE: "/cliente/atualizar",
    
    // Rotas de Metas
    LISTAR_METAS: "/meta",
    NOVA_META: "/meta/nova",
    REMOVER_META: "/meta/remover:id",
    ATUALIZAR_META: "/meta/atualizar",
    BUSCAR_META_ID: "/meta/:id", // 🚨 Resolve o erro da linha 85

    // Rotas de Banco/Transações
    LISTAR_BANCOS: "/banco",
    NOVO_BANCO: "/banco/novo",
    ATUALIZAR_BANCO: "/banco/atualizar",
    REMOVER_BANCO: "/banco/remover",
    CRIAR_TRANSACAO: "/transacao",
};