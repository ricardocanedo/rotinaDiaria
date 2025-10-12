export interface Activity {
    id?: number;
    name: string;
    icon: string;
    color: string;
    category: string;
    description: string;
    imageSrc: string;
}

export interface UserActivity extends Activity {
    id: number;  // Required for user activities
    time: string;
    isActive: boolean;
    repeat: 'daily' | 'weekly' | 'none';
}
