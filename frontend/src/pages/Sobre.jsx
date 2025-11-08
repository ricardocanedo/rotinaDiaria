function Sobre() {
    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="container">
                <div className="card" style={{backgroundColor: '#eee'}}>
                    <div className="card-header">
                        <h1 className="card-title p-3">Sobre o projeto Rotina Diária</h1>
                    </div>
                    <div className="card-body p-4">
                        <p>
                            Rotina Diária é uma aplicação web desenvolvida para ajudar crianças e adolescentes,
                            especialmente aqueles com Transtorno do Espectro Autista (TEA), a organizarem suas rotinas
                            de forma previsível, visual e lúdica. A ferramenta permite criar, agendar e gerenciar atividades,
                            fornecendo feedbacks e recompensas (coins) ao concluir tarefas.
                        </p>

                        <h5 className="mt-4">Objetivo</h5>
                        <p>
                            Facilitar a construção de rotinas diárias personalizadas que aumentem a previsibilidade,
                            reduzam a ansiedade e promovam autonomia para usuários e apoio prático para familiares e cuidadores.
                        </p>

                        <h5 className="mt-4">Principais funcionalidades</h5>
                        <ul>
                            <li>Catálogo de atividades com ícones e imagens</li>
                            <li>Criar e editar atividades do usuário com horário, repetição e status (ativo/inativo)</li>
                            <li>Listagem das atividades agendadas e cards de execução na Home</li>
                            <li>Registro de conclusões e recompensa em coins</li>
                            <li>Persistência inicial em LocalStorage (integração com backend planejada)</li>
                            <li>Interface responsiva e acessível</li>
                        </ul>

                        <h5 className="mt-4">Como usar (resumo)</h5>
                        <ol>
                            <li>Acesse "Gerenciar" para adicionar atividades ao seu catálogo pessoal.</li>
                            <li>Defina horário, repetição e ative/desative a atividade.</li>
                            <li>Na página inicial (Home), acompanhe e conclua as atividades quando estiverem no horário.</li>
                            <li>Cada conclusão registra data/hora e credita coins ao usuário.</li>
                        </ol>

                        <h5 className="mt-4">Equipe</h5>
                        <p className="mb-1"><strong>Autores:</strong></p>
                        <ul>
                            <li>Alisson Thales Fabro</li>
                            <li>Cintia Mara Vieira Franco</li>
                            <li>Claudio Eduardo Cesario de Oliveira</li>
                            <li>Jaqueline Micaele Maria Silva</li>
                            <li>Luiz Fernando da Silva Pinto</li>
                            <li>Piterson Murilo Boscolo</li>
                            <li>Ricardo Henrique Canedo</li>
                            <li>Tais Alves Silva Ribeiro</li>
                        </ul>

                        <h5 className="mt-4">Contato e contribuição</h5>
                        <p>
                            Projeto em desenvolvimento. Para contribuir, abra issues ou pull requests no repositório do projeto.
                            Para dúvidas e sugestões, use o canal do repositório ou envie um email para: <em>ricardocanedo@live.com</em>
                        </p>

                        <div className="text-end mt-3">
                            <small className="text-muted">Versão inicial — desenvolvido com React + Vite (frontend) e NestJS (backend)</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sobre