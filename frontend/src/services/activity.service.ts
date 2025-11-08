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
        const activities = stored ? JSON.parse(stored) : [];

        // Ordenação por horário ao carregar
        return activities.sort((a: UserActivity, b: UserActivity) => 
                a.time.localeCompare(b.time)    
            );
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
        return this.getUserActivities()
            .filter(activity => {
                // filtra atividades inativas
                if (!activity.isActive) {
                    return false;
                } 

                // filtra atividades concluídas
                if (OcultarContextType.ocultarAtividadesConcluidas && CompletionService.isCompletedToday(activity.id)) {
                    return false;
                }

                // filtra ativididades concluídas que não se repetem
                if (activity.repeat === 'none' && CompletionService.isCompleted(activity.id)) {
                    return false;
                }

                return true;
            });
    },

    onToogleOcultarAtividadesConcluidas(value: boolean): void {
        OcultarContextType.serToogleOcultarAtividadesConcluidas(value);
    },

    getOcultarAtividadesConcluidas(): boolean {
        return OcultarContextType.ocultarAtividadesConcluidas;
    },
};
