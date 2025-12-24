export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    birthday?: string; 
    gender?: 'male' | 'female' | 'other';
    avatar_url?: string;
    location?: string;        
    registration_date?: string;
    created_at?: string;
    updated_at?: string;
}
