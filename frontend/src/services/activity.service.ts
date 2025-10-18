import { Activity, UserActivity } from '../interfaces/activity.interface';
import availableActivities from '../data/available-activities';
import { CompletionService } from './completion.service';

interface OcultarContextType {
    ocultarAtividadesConcluidas: boolean;
    serToogleOcultarAtividadesConcluidas: (value: boolean) => void;
}

const STORAGE_KEY = 'user_activities';
const OcultarContextType: OcultarContextType = {
    ocultarAtividadesConcluidas: false,
    serToogleOcultarAtividadesConcluidas: (value: boolean) => {
        OcultarContextType.ocultarAtividadesConcluidas = value;
    }
};

export const ActivityService = {
    getAvailableActivities(): Activity[] {
        return availableActivities;
    },

    getUserActivities(): UserActivity[] {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    },

    saveUserActivity(activity: Partial<UserActivity>): void {
        const activities = this.getUserActivities();
        const newActivity: UserActivity = {
            ...activity,
            id: activity.id || Date.now(),
            isActive: activity.isActive ?? true,
            repeat: activity.repeat || 'none',
            time: activity.time || '',
        } as UserActivity;

        if (activity.id) {
            const index = activities.findIndex(a => a.id === activity.id);
            if (index >= 0) {
                activities[index] = newActivity;
            }
        } else {
            activities.push(newActivity);
        }
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
    },

    deleteUserActivity(id: number): void {
        const activities = this.getUserActivities().filter(a => a.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
    },

    getUserActivity(id: number): UserActivity | null {
        return this.getUserActivities().find(a => a.id === id) || null;
    },

    getCurrentActivities(): UserActivity[] {
        const now = new Date();
        const currentTime = now.getHours().toString().padStart(2, '0') + ':' + 
                          now.getMinutes().toString().padStart(2, '0');
        
        return this.getUserActivities()
            .filter(activity => {
                // filtra atividades inativas
                if (!activity.isActive) {
                    return false;
                } 

                // filtra atividades concluídas
                if (OcultarContextType.ocultarAtividadesConcluidas && CompletionService.isCompletedToday(activity.id)) {
                    console.log('filtrou atividade', activity);
                    
                    return false;
                } 
                
                // Se for atividade diária, compara apenas o horário
                if (activity.repeat === 'daily') {
                    return activity.time <= currentTime;
                }
                
                // // Se for semanal, verifica também o dia da semana
                // if (activity.repeat === 'weekly') {
                //     const today = now.getDay();
                //     return activity.time <= currentTime;
                // }
                
                // none, só considera o horario
                return activity.time <= currentTime;
            });
    },

    onToogleOcultarAtividadesConcluidas(value: boolean): void {
        OcultarContextType.serToogleOcultarAtividadesConcluidas(value);
    }
};
