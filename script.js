document.addEventListener('DOMContentLoaded', function() {
    // Elementos da DOM
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const timeSlotsContainer = document.getElementById('time-slots-container');
    const activityList = document.getElementById('activity-list');
    const newActivityInput = document.getElementById('new-activity-input');
    const addActivityBtn = document.getElementById('add-activity-btn');
    const generateRoutineBtn = document.getElementById('generate-routine');
    const routineTableBody = document.getElementById('routine-table-body');

    // Mapeamento de ícones para atividades
    const activityIcons = {
        'Café da manhã': 'fa-utensils',
        'Arrumar a cama': 'fa-bed',
        'Fazer tarefa de casa': 'fa-book',
        'Almoçar': 'fa-utensils',
        'Ir para a escola': 'fa-school',
        'Estudar (matérias diversas)': 'fa-graduation-cap',
        'Tomar banho': 'fa-shower',
        'Escovar os dentes': 'fa-tooth',
        'Lanchar': 'fa-apple-alt',
        'Estudar bateria': 'fa-drum',
        'Estudar tabuada': 'fa-times',
        'Ver TV': 'fa-tv',
        'Jogar no celular': 'fa-mobile-alt',
        'Jantar': 'fa-utensils',
        'Dormir': 'fa-moon'
    };

    // Dados da aplicação
    let routine = {};
    let activities = Object.keys(activityIcons);
    let selectedTimeSlot = null;

    // Inicialização
    loadFromLocalStorage();
    initializeTimeSlots();
    initializeActivities();
    setupEventListeners();

    // Funções principais
    function setupEventListeners() {
        // Navegação por abas
        tabButtons.forEach(button => {
            button.addEventListener('click', () => switchTab(button.dataset.tab));
        });

        // Adicionar nova atividade
        addActivityBtn.addEventListener('click', addNewActivity);
        newActivityInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') addNewActivity();
        });

        // Gerar rotina
        generateRoutineBtn.addEventListener('click', () => switchTab('view'));
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
                createTimeSlot(timeString);
            }
        }
    }

    function createTimeSlot(timeString) {
        const timeSlot = document.createElement('div');
        timeSlot.className = 'time-slot';
        timeSlot.dataset.time = timeString;

        timeSlot.addEventListener('click', () => {
            // Remover seleção anterior
            const previouslySelected = document.querySelector('.time-slot.selected');
            if (previouslySelected) {
                previouslySelected.classList.remove('selected');
            }
            // Selecionar novo
            timeSlot.classList.add('selected');
            selectedTimeSlot = timeString;
        });
        
        // Label do horário
        const timeLabel = document.createElement('div');
        timeLabel.className = 'time-label';
        timeLabel.textContent = timeString;
        
        // Slot para atividade
        const activitySlot = document.createElement('div');
        activitySlot.className = 'activity-slot';
        
        // Botão de remover
        const removeBtn = createRemoveButton(() => removeActivityFromSlot(timeString));
        
        // Adicionar atividade existente se houver
        if (routine[timeString]) {
            activitySlot.appendChild(createActivityElement(routine[timeString], false, true));
        }
        
        // Montar o slot
        timeSlot.append(timeLabel, activitySlot, removeBtn);
        timeSlotsContainer.appendChild(timeSlot);
    }

    function initializeActivities() {
        activityList.innerHTML = '';
        activities.forEach(activity => {
            activityList.appendChild(createActivityElement(activity, true, false));
        });
    }

    function createActivityElement(text, isFromActivityList, isInSlot) {
        const activity = document.createElement('div');
        activity.className = 'activity-item';
        if (isInSlot) {
            activity.classList.add('in-slot');
        }

        const icon = document.createElement('i');
        icon.className = `fas ${activityIcons[text] || 'fa-tasks'} activity-icon`;

        const textSpan = document.createElement('span');
        textSpan.textContent = text;

        activity.append(icon, textSpan);

        if (isFromActivityList) {
            activity.classList.add('clickable');
            activity.addEventListener('click', () => addActivityToSelectedSlot(text));

            const actions = createActivityActions(text);
            activity.appendChild(actions);
        }

        return activity;
    }

    function createActivityActions(text) {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'activity-actions';
        
        // Botão editar
        const editBtn = document.createElement('button');
        editBtn.className = 'activity-btn edit-activity-btn';
        editBtn.innerHTML = '<i class="fas fa-pencil-alt"></i>';
        editBtn.title = 'Editar atividade';
        editBtn.addEventListener('click', e => {
            e.stopPropagation();
            editActivityInList(text);
        });
        
        // Botão remover
        const removeBtn = document.createElement('button');
        removeBtn.className = 'activity-btn remove-activity-btn';
        removeBtn.innerHTML = '<i class="fas fa-trash"></i>';
        removeBtn.title = 'Remover atividade';
        removeBtn.addEventListener('click', e => {
            e.stopPropagation();
            removeActivityFromList(text);
        });
        
        actionsDiv.append(editBtn, removeBtn);
        return actionsDiv;
    }

    function createRemoveButton(clickHandler) {
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-slot-btn';
        removeBtn.innerHTML = '&times;';
        removeBtn.addEventListener('click', e => {
            e.stopPropagation();
            clickHandler();
        });
        return removeBtn;
    }

    function addNewActivity() {
        const newActivity = newActivityInput.value.trim();
        if (!newActivity || activities.includes(newActivity)) return;
        
        activities.push(newActivity);
        activityIcons[newActivity] = 'fa-plus-circle';
        activityList.appendChild(createActivityElement(newActivity, true, false));
        
        newActivityInput.value = '';
        saveToLocalStorage();
    }

    function editActivityInList(oldActivity) {
        const newActivity = prompt('Editar atividade:', oldActivity);
        if (!newActivity || newActivity.trim() === '') return;
        
        const index = activities.indexOf(oldActivity);
        if (index !== -1) {
            // Atualizar atividade
            activities[index] = newActivity.trim();
            
            // Manter o ícone ou usar padrão
            if (!activityIcons[newActivity]) {
                activityIcons[newActivity] = activityIcons[oldActivity] || 'fa-tasks';
            }
            
            // Atualizar na rotina
            for (const time in routine) {
                if (routine[time] === oldActivity) {
                    routine[time] = newActivity.trim();
                }
            }
            
            saveToLocalStorage();
            initializeActivities();
            initializeTimeSlots();
        }
    }

    function removeActivityFromList(activity) {
        if (!confirm(`Remover a atividade "${activity}"?`)) return;
        
        const index = activities.indexOf(activity);
        if (index !== -1) {
            activities.splice(index, 1);
            
            // Remover da rotina
            for (const time in routine) {
                if (routine[time] === activity) {
                    delete routine[time];
                }
            }
            
            saveToLocalStorage();
            initializeActivities();
            initializeTimeSlots();
        }
    }

    function removeActivityFromSlot(timeString) {
        if (routine[timeString]) {
            delete routine[timeString];
            saveToLocalStorage();
            initializeTimeSlots();
        }
    }

    function addActivityToSelectedSlot(activityText) {
        if (!selectedTimeSlot) {
            alert('Por favor, selecione um horário primeiro!');
            return;
        }

        routine[selectedTimeSlot] = activityText;
        saveToLocalStorage();

        // Atualizar a interface e desmarcar a seleção
        const selectedSlotElement = document.querySelector('.time-slot.selected');
        if (selectedSlotElement) {
            selectedSlotElement.classList.remove('selected');
        }
        
        initializeTimeSlots();
        selectedTimeSlot = null;
    }

    function updateRoutineView() {
        routineTableBody.innerHTML = '';
        let hasRoutine = false;
        
        for (let hour = 6; hour <= 21; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                const activity = routine[timeString];
                hasRoutine = hasRoutine || !!activity;
                
                const row = document.createElement('tr');
                row.classList.add('fade-in');
                
                // Célula de horário
                const timeCell = document.createElement('td');
                timeCell.textContent = timeString;
                
                // Célula de atividade (com ícone)
                const activityCell = document.createElement('td');
                if (activity) {
                    const icon = document.createElement('i');
                    icon.className = `fas ${activityIcons[activity] || 'fa-tasks'} activity-icon`;
                    activityCell.append(icon, ` ${activity}`);
                } else {
                    activityCell.textContent = '-';
                    activityCell.classList.add('empty-slot');
                }
                
                // Célula de ações
                const actionsCell = document.createElement('td');
                if (activity) {
                    const editBtn = document.createElement('button');
                    editBtn.className = 'edit-btn';
                    editBtn.innerHTML = '<i class="fas fa-pencil-alt"></i> Editar';
                    editBtn.addEventListener('click', () => editActivity(timeString));
                    
                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'delete-btn';
                    deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Excluir';
                    deleteBtn.addEventListener('click', () => deleteActivity(timeString));
                    
                    actionsCell.append(editBtn, deleteBtn);
                }
                
                row.append(timeCell, activityCell, actionsCell);
                routineTableBody.appendChild(row);
            }
        }
        
        if (!hasRoutine) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 3;
            cell.textContent = 'Nenhuma rotina criada ainda. Volte à aba "Criar Rotina" para começar.';
            cell.style.textAlign = 'center';
            row.appendChild(cell);
            routineTableBody.appendChild(row);
        }
    }

    function editActivity(timeString) {
        const newActivity = prompt('Editar atividade:', routine[timeString]);
        if (!newActivity || newActivity.trim() === '') return;
        
        routine[timeString] = newActivity.trim();
        saveToLocalStorage();
        updateRoutineView();
        initializeTimeSlots();
    }

    function deleteActivity(timeString) {
        if (confirm('Excluir esta atividade?')) {
            delete routine[timeString];
            saveToLocalStorage();
            updateRoutineView();
            initializeTimeSlots();
        }
    }

    function saveToLocalStorage() {
        localStorage.setItem('childRoutine', JSON.stringify(routine));
        localStorage.setItem('childActivities', JSON.stringify(activities));
        localStorage.setItem('childActivityIcons', JSON.stringify(activityIcons));
    }

    function loadFromLocalStorage() {
        routine = JSON.parse(localStorage.getItem('childRoutine')) || {};
        activities = JSON.parse(localStorage.getItem('childActivities')) || Object.keys(activityIcons);
        
        const savedIcons = JSON.parse(localStorage.getItem('childActivityIcons'));
        if (savedIcons) {
            Object.assign(activityIcons, savedIcons);
        }
    }
});