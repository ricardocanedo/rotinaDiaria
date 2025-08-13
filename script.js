import { supabase } from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', async function() {
    // DOM Elements
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const timeSlotsContainer = document.getElementById('time-slots-container');
    const clearRoutineBtn = document.getElementById('clear-routine');
    const routineTableBody = document.getElementById('routine-table-body');

    // Application state
    let routine = {};
    let activities = [];
    let activityIcons = {};
    let selectedTimeSlot = null;

    // Initialize
    try {
        await loadActivities();
        await loadRoutine();
        setupEventListeners();
        initializeTimeSlots();
    } catch (error) {
        console.error('Error initializing app:', error);
        alert('Erro ao inicializar o app.');
    }
    // CRUD de atividades
    async function loadActivities() {
        const { data, error } = await supabase
            .from('activities')
            .select('*');
        if (error) {
            console.error('Erro ao carregar atividades:', error);
            alert('Erro ao carregar atividades.');
            activities = [];
            activityIcons = {};
        } else {
            activities = [];
            activityIcons = {};
            data.forEach(item => {
                activities.push(item.name);
                activityIcons[item.name] = item.icon;
            });
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
        
        // Add activity options
        activities.forEach(activity => {
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
            if (routine[time]) {
                select.value = routine[time].text;
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
                delete routine[timeString];
                await saveRoutine();
                updateRoutineView();
                initializeTimeSlots();
            } catch (error) {
                console.error('Error deleting activity:', error);
                alert('Erro ao excluir atividade. Tente novamente.');
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
                    routine_data: routine,
                    updated_at: new Date().toISOString()
                };

                const { data, error: routineError } = await supabase
                    .from('routines')
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

    async function toggleTaskStatus(timeString) {
        if (routine[timeString]) {
            routine[timeString].done = !routine[timeString].done;
            await saveRoutine();
            updateRoutineView();
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
                .select('*')
                .eq('id', 1)
                .single();
            if (routineError && routineError.code !== 'PGRST116') {
                console.warn('Erro ao carregar rotina do Supabase:', routineError);
            } else if (routineData) {
                routine = routineData.routine_data || {};
                return;
            } else {
                routine = {};
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