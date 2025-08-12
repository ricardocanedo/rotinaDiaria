/**
 * Configurações da aplicação
 * 
 * Este arquivo contém as configurações globais da aplicação,
 * incluindo URLs da API e outras constantes que podem ser reutilizadas.
 */

// Configurações da API
const API_CONFIG = {
    // URL base da API do backend
    BASE_URL: 'http://localhost:3000/api',
    
    // Timeout para requisições em milissegundos
    TIMEOUT: 10000,
    
    // Cabeçalhos padrão para as requisições
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

// Configurações de armazenamento local
const STORAGE_KEYS = {
    CURRENT_ROUTINE: 'currentRoutineId',
    LAST_ACTIVE_TAB: 'lastActiveTab'
};

// Exporta as configurações
export { 
    API_CONFIG,
    STORAGE_KEYS
};
