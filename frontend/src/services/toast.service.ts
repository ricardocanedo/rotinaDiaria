import { toast, ToastOptions } from 'react-toastify';

const defaultOptions: ToastOptions = {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true
};

    export const ToastService = {
    success(message: string, options?: ToastOptions) {
        toast.success(message, { ...defaultOptions, ...options });
    },

    error(message: string, options?: ToastOptions) {
        toast.error(message, { ...defaultOptions, ...options });
    },

    warn(message: string, options?: ToastOptions) {
        toast.warn(message, { ...defaultOptions, ...options });
    },

    info(message: string, options?: ToastOptions) {
        toast.info(message, { ...defaultOptions, ...options });
    },

    /**
     * Exibe erros do backend
     */
    errorApi(error: any, options?: ToastOptions) {
        // Se for erro de conexão/rede
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            return this.errorConnection(error, options);
        }

        let message: string;

        // Caso seja um array de mensagens de erro
        if (error?.message && Array.isArray(error.message)) {
        message = error.message.join('\n');
        }
        // Caso seja uma única mensagem
        else if (error?.message && typeof error.message === 'string') {
        message = error.message;
        }
        // Caso seja um erro genérico
        else {
        message = 'Ocorreu um erro inesperado';
        }

        this.error(message, { 
        ...defaultOptions, 
        ...options,
        autoClose: false // Erros da api ficam até o usuário fechar
        });
    },

    /**
     * Exibe erros de conexão
     */
    errorConnection(error: any, options?: ToastOptions) {
        const message = 'Não foi possível conectar ao servidor. Verifique a conexão.';
        
        this.error(message, { 
        ...defaultOptions, 
        ...options,
        autoClose: false
        });
    },

    /**
     * Limpa todas as notificações ativas
     */
    clearAll() {
        toast.dismiss();
    }
};
