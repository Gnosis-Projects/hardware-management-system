export interface Notification{
    message: string;
    time: Date;
    
}

export interface Notifications{
    notifications: Notification[];
}