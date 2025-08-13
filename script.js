import { supabase } from './supabaseClient.js';

// Função para garantir que a tabela user_data existe
async function ensureUserDataTable() {
    try {
        // Verifica se a tabela user_data existe
        const { data: tableExists, error: checkError } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public')
            .eq('table_name', 'user_data')
            .single();

        if (checkError && checkError.code !== 'PGRST116') { // 116 = nenhum resultado
            console.error('Erro ao verificar tabela user_data:', checkError);
            return false;
        }

        if (!tableExists) {
            console.log('Tabela user_data não encontrada, criando...');
            // Cria a tabela user_data se não existir
            const { error: createError } = await supabase.rpc(`
                CREATE TABLE IF NOT EXISTS public.user_data (
                    id bigint PRIMARY KEY,
                    coins integer NOT NULL DEFAULT 0,
                    created_at timestamp with time zone DEFAULT now(),
                    updated_at timestamp with time zone DEFAULT now()
                );
            `);

            if (createError) throw createError;
            console.log('Tabela user_data criada com sucesso!');
        }
        
        // Garante que existe um registro com ID 1
        const { error: upsertError } = await supabase
            .from('user_data')
            .upsert(
                { id: 1, coins: 0 },
                { onConflict: 'id', returning: 'minimal' }
            );
            
        if (upsertError) throw upsertError;
        
        return true;
    } catch (error) {
        console.error('Erro ao garantir a tabela user_data:', error);
        return false;
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    // DOM Elements
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const timeSlotsContainer = document.getElementById('time-slots-container');
    const clearRoutineBtn = document.getElementById('clear-routine');
    const routineTableBody = document.getElementById('routine-table-body');
    const coinCountElement = document.getElementById('coin-count');
    
    // Estado dos coins
    let coins = 0;

    // Application state
    let routine = {};
    let activities = [];
    let activityIcons = {};
    let selectedTimeSlot = null;

    // Initialize
    try {
        // Garante que a tabela user_data existe antes de carregar os dados
        await ensureUserDataTable();
        await loadActivities();
        await loadRoutine();
        await loadCoins(); // Carrega os coins salvos
        setupEventListeners();
        initializeTimeSlots();
    } catch (error) {
        console.error('Error initializing app:', error);
        alert('Erro ao inicializar o app: ' + error.message);
    }
    // CRUD de atividades
    async function loadActivities() {
        try {
            const { data, error } = await supabase
                .from('activities')
                .select('*');
                
            if (error) throw error;
            
            // Limpa os arrays atuais
            activities = [];
            activityIcons = {};
            
            if (data && data.length > 0) {
                // Ordena as atividades alfabeticamente, considerando acentuação (pt-BR)
                const sortedData = [...data].sort((a, b) => 
                    a.name.localeCompare(b.name, 'pt-BR', {sensitivity: 'base'})
                );
                
                // Preenche os arrays com os dados ordenados
                sortedData.forEach(item => {
                    activities.push(item.name);
                    activityIcons[item.name] = item.icon;
                });
                
                console.log('Atividades carregadas e ordenadas:', activities);
            } else {
                console.log('Nenhuma atividade encontrada no banco de dados');
            }
        } catch (error) {
            console.error('Erro ao carregar atividades:', error);
            alert('Erro ao carregar atividades: ' + error.message);
            activities = [];
            activityIcons = {};
        }
    }

    async function addActivity(name, icon) {
        const { error } = await supabase
            .from('activities')
            .insert([{ name, icon, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }]);
        if (error) {
            alert('Erro ao adicionar atividade: ' + error.message);
        } else {
            await loadActivities();
            initializeTimeSlots();
        }
    }

    async function editActivity(name, newName, newIcon) {
        const { error } = await supabase
            .from('activities')
            .update({ name: newName, icon: newIcon, updated_at: new Date().toISOString() })
            .eq('name', name);
        if (error) {
            alert('Erro ao editar atividade: ' + error.message);
        } else {
            await loadActivities();
            initializeTimeSlots();
        }
    }

    async function deleteActivity(name) {
        const { error } = await supabase
            .from('activities')
            .delete()
            .eq('name', name);
        if (error) {
            alert('Erro ao remover atividade: ' + error.message);
        } else {
            await loadActivities();
            initializeTimeSlots();
        }
    }

    // Funções principais
    function setupEventListeners() {
        // Tab navigation
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                switchTab(e.target.dataset.tab);
            });
        });

        // Auto-save functionality
    async function autoSaveRoutine() {
        try {
            await saveRoutine();
            // Atualiza a visualização se estiver na aba de visualização
            if (document.querySelector('.tab-button[data-tab="view"].active')) {
                updateRoutineView();
            }
        } catch (error) {
            console.error('Error auto-saving routine:', error);
        }
    }
        
        // Clear routine
    clearRoutineBtn.addEventListener('click', async () => {
        if (confirm('Tem certeza que deseja limpar toda a rotina?')) {
            try {
                routine = {};
                await saveRoutine();
                initializeTimeSlots(); // Isso irá redefinir todos os seletores
                updateRoutineView();
                // Mostra mensagem de sucesso
                alert('Rotina limpa com sucesso!');
            } catch (error) {
                console.error('Error clearing routine:', error);
                alert('Erro ao limpar a rotina. Tente novamente.');
            }
        }
    });
    }

    function switchTab(tabId) {
        // Atualizar botões das abas
        tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabId));
        
        // Atualizar conteúdo das abas
        tabContents.forEach(content => content.classList.toggle('active', content.id === tabId));
        
        // Atualizar visualização se necessário
        if (tabId === 'view') updateRoutineView();
    }

    function initializeTimeSlots() {
        timeSlotsContainer.innerHTML = '';
        
        for (let hour = 6; hour <= 21; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                createTimeSlotRow(timeString);
            }
        }
        
        // Update the activity selectors with current routine data
        updateActivitySelectors();
    }

    function createTimeSlotRow(timeString) {
        const row = document.createElement('tr');
        row.className = 'time-slot-row';
        row.dataset.time = timeString;
        
        // Time cell
        const timeCell = document.createElement('td');
        timeCell.className = 'time-slot-time';
        timeCell.textContent = timeString;
        
        // Activity select cell
        const activityCell = document.createElement('td');
        activityCell.className = 'time-slot-activity';
        
        // Create select element
        const select = document.createElement('select');
        select.className = 'time-slot-select';
        select.dataset.time = timeString;
        
        // Add empty option
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = 'Selecione uma atividade';
        select.appendChild(emptyOption);
        
        // Add activity options in alphabetical order
        const sortedActivities = [...activities].sort((a, b) => a.localeCompare(b, 'pt-BR', {sensitivity: 'base'}));
        sortedActivities.forEach(activity => {
            const option = document.createElement('option');
            option.value = activity;
            option.textContent = activity;
            select.appendChild(option);
        });
        
        // Set selected value if exists in routine
        if (routine[timeString]) {
            select.value = routine[timeString].text;
        }
        
        // Add change event - auto-save when activity changes
        select.addEventListener('change', async (e) => {
            const activity = e.target.value;
            if (activity) {
                // Atualiza a rotina
                routine[timeString] = { text: activity, done: false };
                // Salva automaticamente
                await autoSaveRoutine();
                // Atualiza o seletor para refletir a seleção atual
                updateActivitySelectors();
            }
        });
        
        activityCell.appendChild(select);
        
        // Actions cell
        const actionsCell = document.createElement('td');
        actionsCell.className = 'time-slot-actions';
        
        const clearBtn = document.createElement('button');
        clearBtn.className = 'clear-slot-btn';
        clearBtn.title = 'Limpar atividade';
        clearBtn.innerHTML = '<i class="fas fa-times"></i>';
        clearBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const time = row.dataset.time;
            delete routine[time];
            
            try {
                await saveRoutine();
                updateRoutineView();
                
                // Reset the select
                const select = row.querySelector('.time-slot-select');
                if (select) {
                    select.value = '';
                }
            } catch (error) {
                console.error('Error clearing activity:', error);
                alert('Erro ao remover atividade. Tente novamente.');
            }
        });
        
        actionsCell.appendChild(clearBtn);
        
        // Build the row
        row.append(timeCell, activityCell, actionsCell);
        timeSlotsContainer.appendChild(row);
    }




    async function removeActivityFromSlot(timeString) {
        if (routine[timeString]) {
            delete routine[timeString];
            try {
                await saveRoutine();
                initializeTimeSlots();
            } catch (error) {
                console.error('Error removing activity:', error);
                throw error;
            }
        }
    }

    function updateActivitySelectors() {
        // Update all select elements with current routine data
        document.querySelectorAll('.time-slot-select').forEach(select => {
            const time = select.dataset.time;
            const currentValue = routine[time] ? routine[time].text : '';
            
            // Store the current selection
            const selectedOption = select.options[select.selectedIndex];
            const selectedValue = selectedOption ? selectedOption.value : '';
            
            // Clear all options except the first one (empty option)
            while (select.options.length > 1) {
                select.remove(1);
            }
            
            // Add activities in alphabetical order
            const sortedActivities = [...activities].sort((a, b) => a.localeCompare(b, 'pt-BR', {sensitivity: 'base'}));
            sortedActivities.forEach(activity => {
                const option = document.createElement('option');
                option.value = activity;
                option.textContent = activity;
                select.appendChild(option);
            });
            
            // Restore the selected value if it still exists
            if (currentValue && [...select.options].some(opt => opt.value === currentValue)) {
                select.value = currentValue;
            } else if (selectedValue && [...select.options].some(opt => opt.value === selectedValue)) {
                // If the current value is not valid, try to restore the previously selected value
                select.value = selectedValue;
            } else {
                select.value = '';
            }
        });
    }

    function updateRoutineView() {
        routineTableBody.innerHTML = '';
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinutes = now.getMinutes();
        const currentTimeSlot = `${currentHour.toString().padStart(2, '0')}:${currentMinutes < 30 ? '00' : '30'}`;
        
        // Create a container for the routine list
        const routineList = document.createElement('ul');
        routineList.className = 'routine-list';
        
        // Get all time slots with activities
        const timeSlots = [];
        for (let hour = 6; hour <= 21; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                if (routine[timeString]) {
                    timeSlots.push({
                        time: timeString,
                        activity: routine[timeString]
                    });
                }
            }
        }
        
        if (timeSlots.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <i class="far fa-calendar-plus"></i>
                <h3>Nenhuma rotina criada</h3>
                <p>Volte à aba "Criar Rotina" para começar</p>
            `;
            routineTableBody.appendChild(emptyState);
            return;
        }
        
        // Create list items for each time slot
        timeSlots.forEach((slot, index) => {
            const { time, activity } = slot;
            
            const listItem = document.createElement('li');
            listItem.className = 'routine-item' + (activity.done ? ' task-done' : '');
            listItem.style.animationDelay = `${index * 0.05}s`;
            
            if (time === currentTimeSlot) {
                listItem.classList.add('current-time');
            }
            
            // Activity container
            const activityContainer = document.createElement('div');
            activityContainer.className = 'activity-container';
            
            // Time display
            const timeDisplay = document.createElement('span');
            timeDisplay.className = 'routine-time-display';
            timeDisplay.textContent = time;
            
            // Icon with colored background
            const iconContainer = document.createElement('div');
            iconContainer.className = 'activity-icon';
            
            const icon = document.createElement('i');
            icon.className = `fas ${activityIcons[activity.text] || 'fa-tasks'}`;
            iconContainer.appendChild(icon);
            
            // Activity text
            const activityText = document.createElement('span');
            activityText.className = 'activity-text';
            activityText.textContent = activity.text;
            
            // Assemble activity container
            activityContainer.appendChild(timeDisplay);
            activityContainer.appendChild(iconContainer);
            activityContainer.appendChild(activityText);
            
            // Actions container
            const actions = document.createElement('div');
            actions.className = 'routine-actions';
            
            // Check/Uncheck button
            const checkBtn = document.createElement('button');
            checkBtn.className = 'action-btn check-btn';
            checkBtn.innerHTML = activity.done ? '<i class="fas fa-check"></i>' : '<i class="far fa-circle"></i>';
            checkBtn.title = activity.done ? 'Desmarcar' : 'Concluir';
            checkBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleTaskStatus(time);
            });
            
            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'action-btn delete-btn';
            deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
            deleteBtn.title = 'Excluir';
            deleteBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                if (confirm('Tem certeza que deseja remover esta atividade?')) {
                    delete routine[time];
                    try {
                        await saveRoutine();
                        updateRoutineView();
                    } catch (error) {
                        console.error('Error removing activity:', error);
                        alert('Erro ao remover atividade. Tente novamente.');
                    }
                }
            });
            
            // Add buttons to actions
            actions.append(checkBtn, deleteBtn);
            
            // Assemble list item
            listItem.append(activityContainer, actions);
            routineList.appendChild(listItem);
        });
        
        routineTableBody.appendChild(routineList);
    }

    function editActivity(timeString) {
        const oldText = routine[timeString] ? routine[timeString].text : '';
        const newActivity = prompt('Editar atividade:', oldText);
        if (!newActivity || newActivity.trim() === '') return;
        
        if (routine[timeString]) {
            routine[timeString].text = newActivity.trim();
        }
        saveToLocalStorage();
        updateRoutineView();
        initializeTimeSlots();
    }

    async function deleteActivity(timeString) {
        if (confirm('Excluir esta atividade?')) {
            try {
                // Verifica se a atividade existe e está marcada como concluída
                const wasCompleted = routine[timeString]?.done || false;
                
                // Remove a atividade da rotina
                delete routine[timeString];
                
                // Se a atividade estava concluída, ajusta a contagem de moedas
                if (wasCompleted) {
                    coins = Math.max(0, coins - 1);
                    if (coinCountElement) {
                        coinCountElement.textContent = coins;
                    }
                }
                
                // Salva a rotina e os coins atualizados
                await Promise.all([
                    saveRoutine(),
                    saveCoins()
                ]);
                
                // Atualiza a visualização e os slots de tempo
                updateRoutineView();
                initializeTimeSlots();
                
                console.log('Atividade excluída. Coins atualizados para:', coins);
                
            } catch (error) {
                console.error('Error deleting activity:', error);
                alert('Erro ao excluir atividade. Tente novamente.');
                
                // Em caso de erro, tenta recarregar os dados para garantir consistência
                try {
                    await loadCoins();
                } catch (reloadError) {
                    console.error('Erro ao recarregar os dados:', reloadError);
                }
            }
        }
    }

    async function saveRoutine() {
        try {
            // First save to local storage as fallback
            saveToLocalStorage();
            
            // Only try to save to Supabase if it's available
            if (supabase) {
                // Salva as atividades na tabela activities
                const activitiesToSave = activities.map(activity => ({
                    name: activity,
                    icon: activityIcons[activity] || 'fa-question',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }));

                // Insere ou atualiza as atividades
                const { error: activitiesError } = await supabase
                    .from('activities')
                    .upsert(activitiesToSave, { onConflict: 'name' });

                if (activitiesError) throw activitiesError;

                // Salva a rotina na tabela routines
                const routineToSave = {
                    id: 1, // ID fixo para a rotina principal
                    routine_data: routine, // Coluna routine_data na tabela routines
                    updated_at: new Date().toISOString()
                };

                const { data, error: routineError } = await supabase
                    .from('routines') // Nome correto da tabela
                    .upsert(routineToSave, { onConflict: 'id' });

                if (routineError) throw routineError;
                
                return data;
            }
            
            return null;
        } catch (error) {
            console.error('Error saving data to Supabase:', error);
            // Já salvamos no localStorage, então apenas registramos o erro
            return null;
        }
    }
    
    function saveToLocalStorage() {
        localStorage.setItem('childRoutine', JSON.stringify(routine));
        localStorage.setItem('childActivities', JSON.stringify(activities));
        localStorage.setItem('childActivityIcons', JSON.stringify(activityIcons));
    }

    // Funções para gerenciar coins
    function updateCoinDisplay() {
        if (!coinCountElement) return;
        
        // Conta quantas tarefas estão marcadas como concluídas
        const completedTasks = Object.values(routine).filter(task => task.done).length;
        
        // Se não houver rotina ou tarefas, define coins como 0
        if (Object.keys(routine).length === 0) {
            console.log('Nenhuma rotina encontrada, definindo coins para 0');
            coins = 0;
        } else {
            // Garante que o valor de coins não seja maior que o número de tarefas concluídas
            coins = Math.min(coins, completedTasks);
        }
        
        // Atualiza o contador na interface
        coinCountElement.textContent = coins;
        
        // Anima o ícone se houver tarefas concluídas
        const coinIcon = document.querySelector('.coin-counter i');
        if (coinIcon && coins > 0) {
            coinIcon.classList.add('coin-animation');
            setTimeout(() => coinIcon.classList.remove('coin-animation'), 500);
        }
        
        // Força o salvamento no banco de dados se o valor foi alterado
        saveCoins().then(() => {
            console.log('Coins atualizados para:', coins);
        }).catch(error => {
            console.error('Erro ao salvar coins:', error);
        });
    }

    async function saveCoins() {
        console.log('Salvando coins:', coins);
        
        try {
            // Atualiza o localStorage imediatamente para feedback visual mais rápido
            localStorage.setItem('childCoins', coins.toString());
            console.log('Salvo no localStorage:', coins);
            
            // Atualiza o banco de dados se o Supabase estiver disponível
            if (supabase) {
                console.log('Tentando salvar no Supabase...');
                
                // Primeiro, verifica se o registro já existe
                const { data: existingData, error: selectError } = await supabase
                    .from('user_data')
                    .select('id, coins')
                    .eq('id', 1)
                    .single();
                
                console.log('Dados existentes:', existingData, 'Erro:', selectError);
                
                // Se não existir, insere um novo registro
                if (selectError && selectError.code === 'PGRST116') {
                    console.log('Inserindo novo registro...');
                    const { data, error: insertError } = await supabase
                        .from('user_data')
                        .insert([{ 
                            id: 1, 
                            coins: coins,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        }])
                        .select();
                    
                    console.log('Resultado da inserção:', data, 'Erro:', insertError);
                    
                    if (insertError) throw insertError;
                    return data;
                } 
                // Se existir, atualiza o registro existente
                else if (!selectError) {
                    console.log('Atualizando registro existente...');
                    const { data, error: updateError } = await supabase
                        .from('user_data')
                        .update({ 
                            coins: coins,
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', 1)
                        .select();
                    
                    console.log('Resultado da atualização:', data, 'Erro:', updateError);
                    
                    if (updateError) throw updateError;
                    return data;
                } else {
                    throw selectError;
                }
            }
            
            return null;
        } catch (error) {
            console.error('Erro ao salvar coins:', error);
            throw error; // Propaga o erro para quem chamou
        }
    }

    async function resetCoins() {
        console.log('Redefinindo coins para 0...');
        coins = 0;
        if (coinCountElement) {
            coinCountElement.textContent = '0';
        }
        await saveCoins();
    }

    async function loadCoins() {
        console.log('Carregando coins...');
        
        try {
            // Se não houver rotina definida, reseta os coins para 0
            if (Object.keys(routine).length === 0) {
                console.log('Nenhuma rotina encontrada, redefinindo coins...');
                await resetCoins();
                return;
            }
            
            // Conta as tarefas concluídas atuais
            const completedTasks = Object.values(routine).filter(task => task.done).length;
            console.log('Tarefas concluídas atuais:', completedTasks);
            
            // Tenta carregar do localStorage
            const savedCoins = parseInt(localStorage.getItem('childCoins') || '0', 10);
            console.log('Coins no localStorage:', savedCoins);
            
            // Inicializa com o valor salvo, mas não pode ser maior que o número de tarefas concluídas
            let newCoins = (!isNaN(savedCoins) && savedCoins <= completedTasks) ? savedCoins : 0;
            
            // Sincroniza com o banco de dados se disponível
            if (supabase) {
                try {
                    console.log('Buscando coins no Supabase...');
                    const { data, error } = await supabase
                        .from('user_data')
                        .select('coins')
                        .eq('id', 1)
                        .single();
                    
                    if (!error && data) {
                        console.log('Coins encontrados no banco de dados:', data.coins);
                        
                        // Garante que o valor dos coins não seja maior que o número de tarefas concluídas
                        // e não seja menor que zero
                        newCoins = Math.min(
                            Math.max(
                                data.coins || 0,
                                0
                            ),
                            completedTasks
                        );
                        
                        console.log('Valor de coins após validação:', newCoins);
                        
                        console.log('Novo valor de coins após sincronização:', newCoins);
                        
                        // Se o valor no banco estiver diferente do calculado, atualiza
                        if (data.coins !== newCoins) {
                            console.log('Atualizando valor no banco de dados...');
                            await saveCoins(); // Isso vai salvar o novo valor
                        }
                    } else if (error && error.code !== 'PGRST116') { // 116 = nenhum resultado
                        console.error('Erro ao carregar coins do banco:', error);
                        // Em caso de erro, mantém o valor atual
                    } else {
                        console.log('Nenhum dado de coins encontrado no banco.');
                        // Se não houver dados no banco, salva o valor atual
                        await saveCoins();
                    }
                } catch (dbError) {
                    console.error('Erro ao sincronizar com o banco de dados:', dbError);
                    // Em caso de erro, continua com o valor atual
                }
            }
            
            // Atualiza o estado local
            coins = newCoins;
            
            // Atualiza a interface do usuário
            if (coinCountElement) {
                coinCountElement.textContent = coins;
            }
            
            console.log('Coins carregados com sucesso:', coins);
        } catch (error) {
            console.error('Erro ao carregar coins:', error);
            // Em caso de erro, garante que o contador seja 0
            coins = 0;
            if (coinCountElement) {
                coinCountElement.textContent = '0';
            }
        }
    }

    async function toggleTaskStatus(timeString) {
        if (!routine[timeString]) return;
        
        try {
            console.log('Alternando status da tarefa:', timeString);
            
            // Alterna o status da tarefa
            const wasCompleted = routine[timeString].done;
            routine[timeString].done = !wasCompleted;
            
            // Calcula o novo número de moedas
            const completedTasks = Object.values(routine).filter(task => task.done).length;
            
            // Atualiza o contador de coins
            if (coinCountElement) {
                coins = completedTasks;
                coinCountElement.textContent = coins;
                
                // Anima o ícone
                const coinIcon = document.querySelector('.coin-counter i');
                if (coinIcon) {
                    coinIcon.classList.add('coin-animation');
                    setTimeout(() => coinIcon.classList.remove('coin-animation'), 500);
                }
            }
            
            console.log('Status da tarefa alterado. Tarefas concluídas:', completedTasks, 'Coins:', coins);
            
            // Salva a rotina e os coins atualizados
            await Promise.all([
                saveRoutine(),
                saveCoins()
            ]);
            
            console.log('Dados salvos com sucesso.');
            
            // Atualiza a visualização
            updateRoutineView();
            
        } catch (error) {
            console.error('Erro ao alternar status da tarefa:', error);
            alert('Ocorreu um erro ao atualizar a tarefa. Tente novamente.');
            
            // Reverte a mudança em caso de erro
            if (routine[timeString]) {
                routine[timeString].done = !routine[timeString].done;
            }
            
            // Recarrega os coins para garantir consistência
            try {
                await loadCoins();
            } catch (reloadError) {
                console.error('Erro ao recarregar os dados:', reloadError);
            }
        }
    }

    async function loadRoutine() {
        try {
            // Carrega as atividades da tabela activities
            const { data: activitiesData, error: activitiesError } = await supabase
                .from('activities')
                .select('*');
            if (activitiesError) throw activitiesError;
            activities = [];
            activityIcons = {};
            if (activitiesData && activitiesData.length > 0) {
                activitiesData.forEach(item => {
                    activities.push(item.name);
                    activityIcons[item.name] = item.icon;
                });
            }

            // Carrega a rotina da tabela routines
            const { data: routineData, error: routineError } = await supabase
                .from('routines')
                .select('routine_data')
                .eq('id', 1)
                .single();
                
            if (routineError && routineError.code !== 'PGRST116') {
                console.warn('Erro ao carregar rotina do Supabase:', routineError);
                routine = {};
            } else if (routineData && routineData.routine_data) {
                routine = routineData.routine_data;
                console.log('Rotina carregada com sucesso:', routine);
            } else {
                console.log('Nenhuma rotina encontrada no banco de dados');
                routine = {};
                // Se não houver rotina, garante que os coins sejam 0
                await resetCoins();
            }
        } catch (error) {
            console.error('Erro ao carregar rotina do Supabase:', error);
            alert('Erro ao consultar rotina no banco.');
            routine = {};
        }
    }
    
    // Fallback function for local storage
    function loadFromLocalStorage() {
        let loadedRoutine = JSON.parse(localStorage.getItem('childRoutine')) || {};
        
        // Migração de dados do formato antigo para o novo
        for (const time in loadedRoutine) {
            if (typeof loadedRoutine[time] === 'string') {
                loadedRoutine[time] = { text: loadedRoutine[time], done: false };
            }
        }
        routine = loadedRoutine;

        // Mesclar atividades padrão com as salvas para garantir que novas atividades sejam adicionadas
        const defaultActivities = Object.keys(activityIcons);
        const savedActivities = JSON.parse(localStorage.getItem('childActivities')) || [];
        const allActivities = new Set([...defaultActivities, ...savedActivities]);
        activities = Array.from(allActivities).sort((a, b) => a.localeCompare(b));

        const savedIcons = JSON.parse(localStorage.getItem('childActivityIcons'));
        if (savedIcons) {
            Object.assign(activityIcons, savedIcons);
        }

        // Salvar a lista mesclada para futuras sessões
        saveToLocalStorage();
    }
});