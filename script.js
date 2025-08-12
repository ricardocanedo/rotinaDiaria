// Importa as configurações da API
import { API_CONFIG } from './config.js';

// Tarefas pré-definidas
const TAREFAS_PRE_DEFINIDAS = [
    'Tomar café da manhã',
    'Arrumar a cama',
    'Escovar os dentes',
    'Ir para a escola',
    'Aula de inglês',
    'Estudar bateria',
    'Dormir',
    'Jantar',
    'Almoçar',
    'Tomar lanche',
    'Ver TV',
    'Jogar',
    'Brincar',
    'Tomar banho',
    'Aula com a tia Ariely',
    'Ir no jiu-jitsu com a mamãe',
    'Ir no mercado',
    'Ir na vovó',
    'Passear com a Belinha',
    'Andar de bicicleta',
    'Fazer lição de casa',
    'Ler um livro',
    'Hora do descanso',
    'Hora da soneca',
    'Livre' // Opção para atividades personalizadas
];

// Elementos do DOM
const timeSlotsContainer = document.getElementById('time-slots-container');
const routineSelect = document.getElementById('routine-select');
const newRoutineBtn = document.getElementById('new-routine');
const routineNameInput = document.getElementById('routine-name');
const saveRoutineNameBtn = document.getElementById('save-routine-name');

// Estado da aplicação
let currentRoutineId = null;
let activities = {};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    generateTimeSlots();
    setupEventListeners();
    loadRoutines();
});

// Gerar slots de horário de 30 em 30 minutos
function generateTimeSlots() {
    timeSlotsContainer.innerHTML = '';
    
    // Horário inicial (6:00) e final (22:00)
    const startHour = 6;
    const endHour = 22;
    
    for (let hour = startHour; hour <= endHour; hour++) {
        // Adiciona horário cheio (ex: 09:00)
        addTimeSlot(hour, 0);
        
        // Adiciona meia hora (ex: 09:30), exceto no último horário
        if (hour < endHour) {
            addTimeSlot(hour, 30);
        }
    }
}

function addTimeSlot(hour, minutes) {
    const timeString = `${String(hour).padStart(2, '0')}:${String(minutes).padEnd(2, '0')}`;
    const row = document.createElement('tr');
    
    // Criar as opções do select com as tarefas pré-definidas
    const options = TAREFAS_PRE_DEFINIDAS.map(tarefa => 
        `<option value="${tarefa}">${tarefa}</option>`
    ).join('');
    
    row.innerHTML = `
        <td>${timeString}</td>
        <td class="activity-cell">
            <select class="activity-select" data-time="${timeString}">
                <option value="">Selecione uma atividade</option>
                ${options}
                <option value="">──────────</option>
                <option value="outra">Outra atividade...</option>
            </select>
            <input type="text" class="activity-input custom-activity" 
                   data-time="${timeString}" 
                   placeholder="Digite a atividade"
                   style="display: none;">
        </td>
        <td class="actions">
            <button class="btn save-activity" data-time="${timeString}" title="Salvar">
                <i class="fas fa-save"></i>
            </button>
        </td>
    `;
    
    // Adiciona evento para mostrar campo de texto quando selecionar "Outra atividade..."
    const select = row.querySelector('.activity-select');
    const input = row.querySelector('.activity-input');
    
    select.addEventListener('change', function() {
        if (this.value === 'outra') {
            this.style.display = 'none';
            input.style.display = 'block';
            input.focus();
        } else if (this.value) {
            input.style.display = 'none';
            input.value = ''; // Limpa o input personalizado
        }
    });
    
    // Se o input personalizado perder o foco e estiver vazio, volta a mostrar o select
    input.addEventListener('blur', function() {
        if (!this.value.trim()) {
            this.style.display = 'none';
            select.style.display = 'block';
            select.value = '';
        }
    });
    
    timeSlotsContainer.appendChild(row);
}

// Configurar event listeners
function setupEventListeners() {
    // Salvar atividade ao clicar no botão de salvar
    document.addEventListener('click', async (e) => {
        if (e.target.closest('.save-activity')) {
            const button = e.target.closest('.save-activity');
            const time = button.dataset.time;
            const activity = getActivityForTime(time);
            
            if (activity) {
                await saveActivity(time, activity);
            } else {
                // Feedback visual quando não há atividade para salvar
                const saveBtn = button;
                const originalHTML = saveBtn.innerHTML;
                saveBtn.innerHTML = '<i class="fas fa-exclamation"></i>';
                saveBtn.classList.add('error');
                
                setTimeout(() => {
                    saveBtn.innerHTML = originalHTML;
                    saveBtn.classList.remove('error');
                }, 2000);
            }
        }
    });
    
    // Criar nova rotina
    newRoutineBtn.addEventListener('click', () => {
        routineSelect.value = '';
        routineNameInput.style.display = 'inline-block';
        saveRoutineNameBtn.style.display = 'inline-block';
        newRoutineBtn.style.display = 'none';
        routineNameInput.focus();
    });
    
    // Salvar nome da nova rotina ao pressionar Enter
    routineNameInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            await saveNewRoutine();
        }
    });
    
    // Salvar nome da nova rotina ao clicar no botão
    saveRoutineNameBtn.addEventListener('click', saveNewRoutine);
    
    // Carregar atividades ao selecionar uma rotina
    routineSelect.addEventListener('change', () => {
        currentRoutineId = routineSelect.value;
        if (currentRoutineId) {
            loadActivities();
        } else {
            clearActivities();
        }
    });
    
    // Permitir salvar com Enter no campo de atividade personalizada
    document.addEventListener('keypress', (e) => {
        if (e.target.classList.contains('custom-activity') && e.key === 'Enter') {
            const input = e.target;
            const time = input.dataset.time;
            const activity = input.value.trim();
            
            if (activity) {
                saveActivity(time, activity);
                // Esconde o input e mostra o select novamente
                input.style.display = 'none';
                const select = input.previousElementSibling;
                select.style.display = 'block';
                select.focus();
            }
        }
    });
}

// Função auxiliar para salvar uma nova rotina
async function saveNewRoutine() {
    const routineName = routineNameInput.value.trim();
    if (routineName) {
        await createRoutine(routineName);
        routineNameInput.value = '';
        routineNameInput.style.display = 'none';
        saveRoutineNameBtn.style.display = 'none';
        newRoutineBtn.style.display = 'inline-block';
    }
}

// Carregar rotinas do servidor
async function loadRoutines() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
        
        const response = await fetch(`${API_CONFIG.BASE_URL}/rotinas`, {
            headers: API_CONFIG.HEADERS,
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const routines = await response.json();
        
        routineSelect.innerHTML = '<option value="">Nova Rotina</option>';
        routines.forEach(routine => {
            const option = document.createElement('option');
            option.value = routine.id;
            option.textContent = routine.nome || `Rotina ${routine.id}`;
            routineSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar rotinas:', error);
        if (error.name === 'AbortError') {
            alert('A requisição demorou muito para responder. Verifique sua conexão e tente novamente.');
        } else {
            alert('Erro ao carregar as rotinas. Tente novamente mais tarde.');
        }
    }
}

// Carregar atividades da rotina selecionada
async function loadActivities() {
    if (!currentRoutineId) {
        clearActivities();
        return;
    }
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
        
        const response = await fetch(`${API_CONFIG.BASE_URL}/rotinas/${currentRoutineId}/atividades`, {
            headers: API_CONFIG.HEADERS,
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const activities = await response.json();
        
        // Limpar todos os campos de entrada
        clearActivities();
        
        // Preencher com as atividades salvas
        activities.forEach(activity => {
            const time = activity.hora;
            const title = activity.titulo;
            
            // Encontra a linha correspondente ao horário
            const row = document.querySelector(`.activity-select[data-time="${time}"]`)?.closest('tr') ||
                       document.querySelector(`.activity-input[data-time="${time}"]`)?.closest('tr');
            
            if (!row) return;
            
            const select = row.querySelector('.activity-select');
            const customInput = row.querySelector('.custom-activity');
            
            // Verifica se a atividade está na lista de pré-definidas
            const isPredefined = TAREFAS_PRE_DEFINIDAS.includes(title);
            
            if (isPredefined) {
                // Se for uma atividade pré-definida, seleciona no select
                select.value = title;
                if (customInput) customInput.style.display = 'none';
            } else {
                // Se for uma atividade personalizada, mostra o input
                select.value = 'outra';
                select.style.display = 'none';
                if (customInput) {
                    customInput.style.display = 'block';
                    customInput.value = title;
                }
            }
        });
    } catch (error) {
        console.error('Erro ao carregar atividades:', error);
        if (error.name === 'AbortError') {
            alert('A requisição demorou muito para responder. Verifique sua conexão e tente novamente.');
        } else {
            alert('Erro ao carregar as atividades. Tente novamente mais tarde.');
        }
    }
}

// Limpar atividades da tela
function clearActivities() {
    document.querySelectorAll('.activity-input').forEach(input => {
        input.value = '';
    });
}

// Criar nova rotina no servidor
async function createRoutine(name) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
        
        const response = await fetch(`${API_CONFIG.BASE_URL}/rotinas`, {
            method: 'POST',
            headers: API_CONFIG.HEADERS,
            body: JSON.stringify({ nome: name }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const newRoutine = await response.json();
        
        // Atualiza a lista de rotinas e seleciona a nova rotina
        await loadRoutines();
        routineSelect.value = newRoutine.id;
        currentRoutineId = newRoutine.id;
        
        return newRoutine;
    } catch (error) {
        console.error('Erro ao criar rotina:', error);
        if (error.name === 'AbortError') {
            alert('A requisição demorou muito para responder. Verifique sua conexão e tente novamente.');
        } else if (error.message.includes('400')) {
            alert('O nome da rotina é inválido. Por favor, escolha outro nome.');
        } else if (error.message.includes('409')) {
            alert('Já existe uma rotina com este nome. Por favor, escolha outro nome.');
        } else {
            alert('Erro ao criar a rotina. Tente novamente mais tarde.');
        }
        throw error; // Propaga o erro para quem chamou a função
    }
}

// Salvar atividade no servidor
async function saveActivity(time, title) {
    if (!currentRoutineId) {
        alert('Por favor, selecione ou crie uma rotina antes de adicionar atividades.');
        return;
    }
    
    if (!title || !title.trim()) {
        alert('Por favor, insira um título para a atividade.');
        return;
    }
    
    const saveBtn = document.querySelector(`.save-activity[data-time="${time}"]`);
    const originalHTML = saveBtn?.innerHTML;
    
    try {
        // Mostra feedback visual de carregamento
        if (saveBtn) {
            saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            saveBtn.disabled = true;
        }
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
        
        const response = await fetch(`${API_CONFIG.BASE_URL}/rotinas/${currentRoutineId}/atividades`, {
            method: 'POST',
            headers: API_CONFIG.HEADERS,
            body: JSON.stringify({
                hora: time,
                titulo: title.trim()
            }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        // Atualiza a lista de atividades
        await loadActivities();
        
        // Feedback visual de sucesso
        if (saveBtn) {
            saveBtn.innerHTML = '<i class="fas fa-check"></i>';
            saveBtn.classList.add('saved');
            
            // Volta ao ícone original após 2 segundos
            setTimeout(() => {
                if (saveBtn) {
                    saveBtn.innerHTML = originalHTML;
                    saveBtn.classList.remove('saved');
                    saveBtn.disabled = false;
                }
            }, 2000);
        }
        
        return true;
    } catch (error) {
        console.error('Erro ao salvar atividade:', error);
        
        // Feedback visual de erro
        if (saveBtn) {
            saveBtn.innerHTML = '<i class="fas fa-exclamation"></i>';
            saveBtn.classList.add('error');
            
            // Volta ao ícone original após 2 segundos
            setTimeout(() => {
                if (saveBtn) {
                    saveBtn.innerHTML = originalHTML;
                    saveBtn.classList.remove('error');
                    saveBtn.disabled = false;
                }
            }, 2000);
        }
        
        // Mensagem de erro amigável
        if (error.name === 'AbortError') {
            alert('A requisição demorou muito para responder. Verifique sua conexão e tente novamente.');
        } else if (error.message.includes('400')) {
            alert('Os dados da atividade são inválidos. Por favor, verifique e tente novamente.');
        } else if (error.message.includes('404')) {
            alert('Rotina não encontrada. Por favor, recarregue a página e tente novamente.');
        } else {
            alert('Erro ao salvar a atividade. Tente novamente mais tarde.');
        }
        
        return false;
    }
}

// Função auxiliar para obter a atividade de um horário específico
function getActivityForTime(time) {
    const row = document.querySelector(`tr[data-time="${time}"]`) || 
               document.querySelector(`.activity-select[data-time="${time}"]`)?.closest('tr') ||
               document.querySelector(`.activity-input[data-time="${time}"]`)?.closest('tr');
    
    if (!row) return null;
    
    // Primeiro verifica se há um input de texto visível
    const customInput = row.querySelector('.custom-activity');
    if (customInput && customInput.style.display !== 'none') {
        return customInput.value.trim();
    }
    
    // Se não, verifica o select
    const select = row.querySelector('.activity-select');
    if (select && select.value && select.value !== 'outra') {
        return select.value;
    }
    
    return null;
}
