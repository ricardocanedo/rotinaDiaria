import { Activity, UserActivity } from '../interfaces/activity.interface';
import availableActivities from '../data/available-activities';

const STORAGE_KEY = 'user_activities';

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
    }
};
